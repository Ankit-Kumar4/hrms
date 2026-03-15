from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceResponse, AttendanceSummary
from typing import Optional
from datetime import date

router = APIRouter()

@router.post("/attendance", response_model=AttendanceResponse)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    # Check employee exists
    employee = db.query(Employee).filter(Employee.id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check no duplicate
    existing = db.query(Attendance).filter(Attendance.employee_id == attendance.employee_id, Attendance.date == attendance.date).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    db_attendance = Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.get("/attendance/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(employee_id: int, date_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if date_filter:
        query = query.filter(Attendance.date == date.fromisoformat(date_filter))
    return query.all()

@router.get("/attendance/{employee_id}/summary", response_model=AttendanceSummary)
def get_attendance_summary(employee_id: int, db: Session = Depends(get_db)):
    attendances = db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
    total_present = sum(1 for a in attendances if a.status.value == "Present")
    total_absent = sum(1 for a in attendances if a.status.value == "Absent")
    total_days = len(attendances)
    return AttendanceSummary(total_present=total_present, total_absent=total_absent, total_days=total_days)