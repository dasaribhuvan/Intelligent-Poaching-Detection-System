from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import random

from app.auth import get_current_user
from app.models import User, Incident, IncidentDetection
from app.database import SessionLocal
from app.clip_model import classify_person
from app.blip_model import understand_scene
from app.email_service import send_alert_email
from app.pdf_generator import generate_evidence_pdf

import os
from datetime import datetime
import cv2
import numpy as np

from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction

router = APIRouter()

# ---------------- YOLO MODEL ----------------

detection_model = AutoDetectionModel.from_pretrained(
    model_type="yolov8",
    model_path="models/best.pt",
    confidence_threshold=0.15,
    device="cpu"
)

# ---------------- DATABASE ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- GPS GENERATOR ----------------

def generate_location():
    lat = 17.68 + random.uniform(-0.02, 0.02)
    lng = 83.21 + random.uniform(-0.02, 0.02)
    return lat, lng


# ---------------- CAPTION ANALYSIS ----------------

def analyze_caption(caption):

    caption = caption.lower()

    weapon_words = ["rifle","gun","pistol","shotgun","weapon","firearm"]
    ranger_words = ["ranger","forest officer","park ranger"]
    animal_words = ["deer","elephant","rhino","tiger","lion","animal"]

    return {
        "weapon": any(w in caption for w in weapon_words),
        "ranger": any(w in caption for w in ranger_words),
        "animal": any(w in caption for w in animal_words)
    }


# ---------------- DETECT API ----------------

@router.post("/detect")
async def detect(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    contents = await file.read()

    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if img is None:
        return {"error": "Invalid image"}

    img = cv2.convertScaleAbs(img, alpha=1.2, beta=10)

    detections = []

    # ---------------- YOLO DETECTION ----------------

    result = get_sliced_prediction(
        img,
        detection_model,
        slice_height=640,
        slice_width=640,
        overlap_height_ratio=0.15,
        overlap_width_ratio=0.15
    )

    height, width = img.shape[:2]

    for obj in result.object_prediction_list:

        label = obj.category.name
        confidence = obj.score.value

        x1, y1, x2, y2 = map(int, obj.bbox.to_xyxy())

        x1 = max(0,x1)
        y1 = max(0,y1)
        x2 = min(width,x2)
        y2 = min(height,y2)

        crop = img[y1:y2,x1:x2]

        if crop.size == 0:
            continue

        if label == "person":
            refined_label, refined_conf = classify_person(crop)
        else:
            refined_label = label
            refined_conf = confidence

        if refined_conf >= 0.55:

            detections.append({
                "label": refined_label,
                "confidence": float(refined_conf)
            })

    caption = understand_scene(img)

    context = analyze_caption(caption)

    labels = [d["label"] for d in detections]

    # ---------------- HUMAN FALLBACK (BLIP) ----------------

    human_words = ["man", "person", "people", "hunter", "human"]

# If YOLO didn't detect any human-like label
    if not any(d["label"] in ["person", "poacher", "ranger"] for d in detections):

        if any(word in caption.lower() for word in human_words):

            detections.append({
            "label": "poacher",
            "confidence": 0.60
            })

    if context["weapon"] and "weapon" not in labels:
        detections.append({"label":"weapon","confidence":0.65})

    if context["animal"] and "animal" not in labels:
        detections.append({"label":"animal","confidence":0.65})

    humans = [d for d in detections if d["label"] in ["person","poacher","ranger"]]

    if humans:

        if context["ranger"] and "weapon" not in labels:

            for h in humans:
                h["label"] = "ranger"

        else:

            for h in humans:
                h["label"] = "poacher"

    labels = [d["label"] for d in detections]

    # ---------------- THREAT LOGIC ----------------

    threat = "LOW"

    if "poacher" in labels:
        threat = "HIGH"

    elif "weapon" in labels:
        threat = "MEDIUM"

    # ---------------- GPS ----------------

    latitude, longitude = generate_location()

    # ---------------- STORE INCIDENT ----------------

    incident = Incident(
        camera_id=1,
        threat_level=threat,
        latitude=latitude,
        longitude=longitude
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    for d in detections:

        db.add(
            IncidentDetection(
                incident_id=incident.id,
                label=d["label"],
                confidence=d["confidence"]
            )
        )

    db.commit()

    # ---------------- EMAIL ALERT ----------------

    if threat == "HIGH":
        
        # Save image temporarily for the PDF report
        temp_img_path = f"temp_evidence_{incident.id}.jpg"
        cv2.imwrite(temp_img_path, img)
        
        # Prepare data for report
        detection_date = datetime.now().strftime("%Y-%m-%d")
        detection_time = datetime.now().strftime("%H:%M:%S")
        
        # Find max confidence
        max_conf = 0.0
        if detections:
            max_conf = max(d["confidence"] for d in detections)
            
        pdf_report_path = generate_evidence_pdf(
            incident_id=incident.id,
            detection_date=detection_date,
            detection_time=detection_time,
            threat_level=threat,
            labels=labels,
            max_confidence=max_conf,
            latitude=latitude,
            longitude=longitude,
            image_path=temp_img_path
        )

        users = db.query(User).all()

        for user in users:

            send_alert_email(
                to_email=user.email,
                subject="🚨 Poaching Alert",
                body=f"""
High Threat Detected

Incident ID: {incident.id}

Location:
Latitude: {latitude}
Longitude: {longitude}

Detected:
{labels}
""",
                attachments=[temp_img_path, pdf_report_path]
            )
            
        # Cleanup temporary files
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
        if os.path.exists(pdf_report_path):
            os.remove(pdf_report_path)

    return {
        "incident_id": incident.id,
        "detections": detections,
        "threat_level": threat,
        "latitude": latitude,
        "longitude": longitude
    }


# ---------------- INCIDENT HISTORY ----------------

@router.get("/incidents")
def get_incidents(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    incidents = db.query(Incident).order_by(Incident.id.desc()).all()

    return [
        {
            "id": i.id,
            "camera_id": i.camera_id,
            "threat_level": i.threat_level,
            "latitude": i.latitude,
            "longitude": i.longitude,
            "created_at": i.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for i in incidents
    ]