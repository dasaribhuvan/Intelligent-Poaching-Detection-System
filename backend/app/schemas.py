from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class DetectionItem(BaseModel):
    label: str
    confidence: float


class DetectionRequest(BaseModel):
    camera_id: int
    detections: list[DetectionItem]