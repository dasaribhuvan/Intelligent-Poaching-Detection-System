from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from ultralytics import YOLO

from app.auth import get_current_user
from app.models import User, Incident, IncidentDetection
from app.database import SessionLocal
from app.email_service import send_alert_email
from app.pdf_generator import generate_evidence_pdf

import cv2
import numpy as np
import os
import torch
import random

from pathlib import Path
from datetime import datetime

router = APIRouter()

# =========================================================
# FIX FOR PYTORCH 2.6+ (weights_only issue)
# =========================================================

_original_torch_load = torch.load

def _patched_torch_load(*args, **kwargs):
    kwargs["weights_only"] = False
    return _original_torch_load(*args, **kwargs)

torch.load = _patched_torch_load

# =========================================================
# PROJECT ROOT
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# =========================================================
# MODEL PATH RESOLVER
# =========================================================

def resolve_model_path(model_path="best.pt"):

    # Direct path
    if os.path.isfile(model_path):
        return model_path

    # models/ folder
    model_dir_path = PROJECT_ROOT / "models" / model_path

    if model_dir_path.is_file():
        return str(model_dir_path)

    # Root folder
    root_path = PROJECT_ROOT / model_path

    if root_path.is_file():
        return str(root_path)

    raise FileNotFoundError(
        f"Model file '{model_path}' not found."
    )

# =========================================================
# LOAD YOLO MODEL
# =========================================================

MODEL_PATH = resolve_model_path("best.pt")

print(f"Loading YOLO model from: {MODEL_PATH}")

model = YOLO(MODEL_PATH)

print("YOLO model loaded successfully")
print("Detected classes:", model.names)

# =========================================================
# DATABASE
# =========================================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# =========================================================
# GPS GENERATOR
# =========================================================

def generate_location():

    lat = 17.68 + random.uniform(-0.02, 0.02)
    lng = 83.21 + random.uniform(-0.02, 0.02)

    return lat, lng

# =========================================================
# THREAT LEVEL LOGIC
# =========================================================

def determine_threat(labels):

    labels = [l.lower() for l in labels]

    if "poacher" in labels:
        return "HIGH"

    if "weapon" in labels:
        return "MEDIUM"

    return "LOW"

# =========================================================
# DETECT API
# =========================================================

@router.post("/detect")
async def detect(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:

        # =================================================
        # READ IMAGE
        # =================================================

        contents = await file.read()

        np_img = np.frombuffer(contents, np.uint8)

        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Invalid image"}

        # =================================================
        # YOLO INFERENCE
        # =================================================

        results = model.predict(
            source=img,
            conf=0.50,
            verbose=False
        )

        detections = []

        # =================================================
        # PROCESS RESULTS
        # =================================================

        for r in results:

            boxes = r.boxes

            for box in boxes:

                class_id = int(box.cls[0])

                confidence = float(box.conf[0])

                label = model.names[class_id]

                detections.append({
                    "label": label,
                    "confidence": round(confidence, 4)
                })

        # =================================================
        # REMOVE DUPLICATES
        # =================================================

        unique_detections = []

        seen = set()

        for d in detections:

            key = (d["label"], round(d["confidence"], 2))

            if key not in seen:

                seen.add(key)

                unique_detections.append(d)

        detections = unique_detections

        # =================================================
        # THREAT LEVEL
        # =================================================

        labels = [d["label"] for d in detections]

        threat = determine_threat(labels)

        # =================================================
        # GPS
        # =================================================

        latitude, longitude = generate_location()

        # =================================================
        # STORE INCIDENT
        # =================================================

        incident = Incident(
            camera_id=1,
            threat_level=threat,
            latitude=latitude,
            longitude=longitude
        )

        db.add(incident)

        db.commit()

        db.refresh(incident)

        # =================================================
        # STORE DETECTIONS
        # =================================================

        for d in detections:

            detection_entry = IncidentDetection(
                incident_id=incident.id,
                label=d["label"],
                confidence=d["confidence"]
            )

            db.add(detection_entry)

        db.commit()

        # =================================================
        # SEND ALERT EMAIL
        # =================================================

        if threat == "HIGH":

            temp_img_path = f"temp_evidence_{incident.id}.jpg"

            cv2.imwrite(temp_img_path, img)

            detection_date = datetime.now().strftime("%Y-%m-%d")

            detection_time = datetime.now().strftime("%H:%M:%S")

            max_conf = 0.0

            if detections:
                max_conf = max(
                    d["confidence"] for d in detections
                )

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

Threat Level: {threat}

Location:
Latitude: {latitude}
Longitude: {longitude}

Detected Objects:
{labels}
""",
                    attachments=[
                        temp_img_path,
                        pdf_report_path
                    ]
                )

            # =============================================
            # CLEANUP
            # =============================================

            if os.path.exists(temp_img_path):
                os.remove(temp_img_path)

            if os.path.exists(pdf_report_path):
                os.remove(pdf_report_path)

        # =================================================
        # RESPONSE
        # =================================================

        return {
            "success": True,
            "incident_id": incident.id,
            "threat_level": threat,
            "detections": detections,
            "total_detections": len(detections),
            "latitude": latitude,
            "longitude": longitude
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

# =========================================================
# INCIDENT HISTORY
# =========================================================

@router.get("/incidents")
def get_incidents(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    incidents = db.query(Incident).order_by(
        Incident.id.desc()
    ).all()

    return [
        {
            "id": i.id,
            "camera_id": i.camera_id,
            "threat_level": i.threat_level,
            "latitude": i.latitude,
            "longitude": i.longitude,
            "created_at": i.created_at.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        }
        for i in incidents
    ]