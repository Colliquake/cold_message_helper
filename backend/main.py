from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import utils

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    ocr_texts: List[str]
    user_message: str

@app.post("/generate")
async def generate_message(payload: GenerateRequest):
    all_experiences = []
    for ocr_text in payload.ocr_texts:
        experiences = utils.extract_profile_fields(ocr_text)
        # print(f"Extracted from one image: {experiences!r} (type: {type(experiences)})")
        all_experiences.extend(experiences)

    # print(all_experiences)
    cold_message = utils.generate_cold_message(all_experiences, payload.user_message)

    return {
        "status": "ok",
        "profile_fields": all_experiences,
        "generated_message": cold_message,
    }