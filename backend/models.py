from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class AttendanceStatus(enum.Enum):
    Present = "Present"
    Absent = "Absent"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    attendances = relationship("Attendance", back_populates="employee")

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatus), nullable=False)

    employee = relationship("Employee", back_populates="attendances")

    __table_args__ = (
        UniqueConstraint('employee_id', 'date', name='_employee_date_uc'),
    )