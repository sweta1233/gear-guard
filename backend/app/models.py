from sqlalchemy import Column, Integer, String
from .database import Base

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    serial_number = Column(String, unique=True)
