from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str  # Present or Absent

class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str

    class Config:
        from_attributes = True

class AttendanceSummary(BaseModel):
    total_present: int
    total_absent: int
    total_days: int