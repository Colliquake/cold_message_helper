from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import utils

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate_message(
    image: UploadFile = File(...),
    ocr_text: str = Form(...),
    user_message: str = Form(...),
):
    profile_fields = utils.extract_profile_fields(ocr_text)
    # print(profile_fields)
    
    # print("received ocr text:", ocr_text)
    # print("received user message:", user_message)
    
    cold_message = utils.generate_cold_message(profile_fields, user_message)
    print(cold_message)
    
    return {
        "status": "ok",
        "profile_fields": profile_fields,
        "generated_message": cold_message,
    }
