from database import SessionLocal, engine
from models import Receipt, ReceiptItem
from database import Base
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PIL import Image
import os
import json
import re

from database import SessionLocal, engine, Base
from models import Receipt, ReceiptItem

# Create FastAPI app
app = FastAPI()
Base.metadata.create_all(bind=engine)

# Create database tables
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(
    api_key="AIzaSyBTppu6kL3PqUAdJdkfTrFQAzc7LBc76sU"
)

# Gemini model
model = genai.GenerativeModel("gemini-3.1-flash-lite")

# Upload folder
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.get("/")
def home():
    return {
        "message": "Receipt AI Backend Running Successfully"
    }


@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):

    try:

        # Save uploaded file
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Open image
        image = Image.open(file_path)

        # AI Prompt
        prompt = """
        Analyze this receipt image carefully.

        Extract:
        - store_name
        - date
        - time
        - total_amount
        - tax
        - items

        The items array should contain:
        - name
        - price

        IMPORTANT:
        Return ONLY VALID JSON.

        Example:

        {
          "store_name": "ABC Store",
          "date": "2026-05-25",
          "time": "11:30 AM",
          "total_amount": "450",
          "tax": "20",
          "items": [
            {
              "name": "Burger",
              "price": "200"
            }
          ]
        }
        """

        # Generate AI response
        response = model.generate_content(
            [prompt, image]
        )

        text = response.text

        # Remove markdown formatting if present
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)

        # Convert AI response to JSON
        data = json.loads(text)

        # Create DB session
        db = SessionLocal()

        # Create receipt row
        new_receipt = Receipt(
            store_name=data.get("store_name"),
            date=data.get("date"),
            time=data.get("time"),
            total_amount=data.get("total_amount"),
            tax=data.get("tax")
        )

        db.add(new_receipt)
        db.commit()
        db.refresh(new_receipt)

        # Save receipt items
        for item in data.get("items", []):

            receipt_item = ReceiptItem(
                name=item.get("name"),
                price=item.get("price"),
                receipt_id=new_receipt.id
            )

            db.add(receipt_item)

        db.commit()

        db.close()

        return data

    except Exception as e:

        return {
            "error": str(e)
        }