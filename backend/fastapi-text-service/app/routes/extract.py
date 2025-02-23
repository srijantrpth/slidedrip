from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil 
import os
from app.services.extract_text import extract_text

router = APIRouter()

UPLOAD_DIR="uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/extract")
async def extract_text_from_file(file: UploadFile = File(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        extracted_text = extract_text(file_path)
        return {"filename": file.filename, "text": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)