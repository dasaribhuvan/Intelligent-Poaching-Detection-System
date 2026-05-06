import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

def generate_evidence_pdf(
    incident_id: int, 
    detection_date: str, 
    detection_time: str, 
    threat_level: str, 
    labels: list, 
    max_confidence: float, 
    latitude: float,
    longitude: float,
    image_path: str
) -> str:
    timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M")
    pdf_filename = f"poaching_report_{timestamp}.pdf"
    
    # Temporarily store to the current working directory or a temp folder
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "System Name: Intelligent Poaching Detection and Response System")
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 90, "Captured Evidence:")
    
    current_y = height - 110
    
    try:
        if os.path.exists(image_path):
            img = ImageReader(image_path)
            img_width, img_height = img.getSize()
            
            # calculate aspect ratio to fit image beautifully
            max_img_width = width - 100
            max_img_height = 350
            
            aspect = img_height / float(img_width)
            
            # constrain width and height
            target_width = min(max_img_width, max_img_height / aspect)
            target_height = target_width * aspect
            
            # Center the image horizontally
            x_offset = (width - target_width) / 2
            
            # draw the image top-aligned just below the text
            c.drawImage(img, x_offset, current_y - target_height, width=target_width, height=target_height, preserveAspectRatio=True)
            
            # adjust Y for the next element
            current_y -= (target_height + 40)
    except Exception as e:
        c.drawString(50, current_y, f"Could not load image: {str(e)}")
        current_y -= 40
        
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, current_y, "Detection Metadata:")
    current_y -= 30
    
    c.setFont("Helvetica", 12)
    c.drawString(50, current_y, f"Incident ID: {incident_id}")
    current_y -= 20
    
    c.drawString(50, current_y, f"Detection Date: {detection_date}")
    current_y -= 20
    
    c.drawString(50, current_y, f"Detection Time: {detection_time}")
    current_y -= 20
    
    c.drawString(50, current_y, f"Detection Result: {', '.join(labels)} (Threat: {threat_level})")
    current_y -= 20
    
    conf_str = f"{max_confidence:.2f}" if max_confidence > 0 else "N/A"
    c.drawString(50, current_y, f"Confidence Score: {conf_str}")
    current_y -= 20
    
    c.drawString(50, current_y, f"Location Coordinates: {latitude}, {longitude}")
    
    c.save()
    return pdf_path
