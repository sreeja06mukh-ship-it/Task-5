from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# OCR reader
reader = easyocr.Reader(['en'])


@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):

    try:

        # Save uploaded file
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Extract text from receipt
        result = reader.readtext(file_path, detail=0)

        # Convert list to readable text
        extracted_text = "\n".join(result)

        return {
            "result": extracted_text
        }

    except Exception as e:
        return {
            "error": str(e)
        }