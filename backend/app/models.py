from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# ---------------- USER MODEL ----------------

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    password_hash = Column(String, nullable=False)

    role = Column(String, default="ranger")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ---------------- INCIDENT MODEL ----------------

class Incident(Base):

    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    camera_id = Column(Integer)

    threat_level = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    detected_at = Column(DateTime, default=datetime.utcnow)

    created_at = Column(DateTime, default=datetime.utcnow)

    is_confirmed = Column(Boolean, default=False)

    # RELATIONSHIP TO INCIDENT DETECTIONS
    detections = relationship(
        "IncidentDetection",
        back_populates="incident",
        cascade="all, delete"
    )


# ---------------- INCIDENT DETECTIONS ----------------

class IncidentDetection(Base):

    __tablename__ = "incident_detections"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(Integer, ForeignKey("incidents.id"))

    label = Column(String, nullable=False)

    confidence = Column(Float, nullable=False)

    # RELATIONSHIP BACK TO INCIDENT
    incident = relationship(
        "Incident",
        back_populates="detections"
    )