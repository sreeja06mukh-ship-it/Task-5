from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PIL import Image
import os
import json
import re
from sqlalchemy import extract

from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

from database import SessionLocal, engine, Base
from models import Expense

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
genai.configure(api_key=GEMINI_API_KEY)

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

@app.get("/expenses")
def get_expenses():

    from sqlalchemy import extract

@app.get("/expenses/summary")
def get_summary(month: str):

    db = SessionLocal()

    year = int(month.split("-")[0])
    month_num = int(month.split("-")[1])

    expenses = (
        db.query(Expense)
        .filter(
            extract("year", Expense.expense_date) == year,
            extract("month", Expense.expense_date) == month_num
        )
        .all()
    )

    summary = {}

    for expense in expenses:
        if expense.category not in summary:
            summary[expense.category] = 0

        summary[expense.category] += float(expense.amount)

    db.close()

    return summary 

    db = SessionLocal()

    expenses = db.query(Expense).all()

    result = []

    for e in expenses:
        result.append({
            "id": e.id,
            "amount": float(e.amount),
            "category": e.category,
            "description": e.description,
            "expense_date": str(e.expense_date),
            "image_path": e.image_path,
            "source": e.source
        })

    db.close()

    return result

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
        Look at this receipt.

        Return ONLY valid JSON.

        {
            "amount": "",
            "category": "",
            "date": "",
            "description": ""
        }

        Categories allowed:

        Food
        Travel
        Shopping
        Utilities
        Health
        Entertainment
        Other

        If date is missing use today's date.
        """

        print(image)

        # Generate AI response
        response = model.generate_content([prompt, image])

        text = response.text
        print(text)

        # Remove markdown formatting if present
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)
        text = text.strip()

        # Convert AI response to JSON
        data = json.loads(text)

        # Create DB session
        db = SessionLocal()

        from datetime import datetime

        expense = Expense(
            amount=float(data.get("amount", 0)),
            category=data.get("category", "Other"),
            description=data.get("description", ""),
            expense_date=datetime.strptime(
                data.get("date"),
                "%Y-%m-%d"
            ).date(),
            image_path=file_path,
            source="receipt_upload"
        )

        db.add(expense)
        db.commit()
        db.refresh(expense)

        db.close()

        return {
            "message": "Expense saved successfully",
            "expense": data
        }

    except Exception as e:
        return {
            "error": str(e)
        }



