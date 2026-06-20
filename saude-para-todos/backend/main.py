from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Saúde Para Todos - API", version="1.0.0")

# Habilitar CORS para permitir requisições do Frontend Web e do Mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de Dados usando Pydantic v2
class Appointment(BaseModel):
    id: Optional[int] = None
    patient_name: str
    appointment_type: str
    date_time: str
    status: str = "Agendado"

# Banco de dados simulado em memória para o MVP do projeto
db_appointments = [
    {
        "id": 1,
        "patient_name": "Sizina Maria do Nascimento",
        "appointment_type": "Unidade Móvel",
        "date_time": "2026-06-25 09:00",
        "status": "Confirmado"
    }
]

@app.get("/")
def read_root():
    return {"status": "Online", "service": "Saúde Para Todos API"}

@app.get("/appointments", response_model=List[Appointment])
def get_appointments():
    return db_appointments

@app.post("/appointments", response_model=Appointment, status_code=201)
def create_appointment(appointment: Appointment):
    new_id = len(db_appointments) + 1
    appointment_dict = appointment.model_dump()
    appointment_dict["id"] = new_id
    db_appointments.append(appointment_dict)
    return appointment_dict

@app.get("/health-units")
def get_health_units():
    return [
        {"id": 1, "name": "Unidade Móvel Zonas Periféricas", "location": "Itaquera - Feira Livre", "status": "Ativo"},
        {"id": 2, "name": "UBS Central", "location": "Centro Operacional", "status": "Ativo"}
    ]
