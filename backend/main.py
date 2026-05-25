from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PIL import Image
import os
import json
import re

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API Key
genai.configure(
    api_key="AIzaSyDyYDrITZnGGqPy4uQyz-i0JICAfqn8zr4"
)

# Gemini model
model = genai.GenerativeModel("gemini-flash-latest")

# Upload folder
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):

    try:

        # Save uploaded file
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Open image
        image = Image.open(file_path)

        # Prompt
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

        Example format:

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

        # Gemini response
        response = model.generate_content(
            [prompt, image]
        )

        text = response.text

        # Clean markdown if Gemini returns ```json
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)

        # Convert string to JSON
        data = json.loads(text)

        return data

    except Exception as e:

        return {
            "error": str(e)
        }