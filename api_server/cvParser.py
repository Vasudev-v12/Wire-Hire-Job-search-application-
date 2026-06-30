from pypdf import PdfReader
import json
from google import genai
from google.genai.types import GenerateContentConfig
from api_server.envConfig import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)


def extract_pdf_text(path: str):
    reader = PdfReader(path)

    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return text


def get_resume_data(path: str):
    resume_text = extract_pdf_text(path)

    prompt = f"""
Extract the following information from the resume.

Return ONLY valid JSON.

{{
    "first_name": "",
    "last_name": "",
    "phone": "",
    "location": "",
    "headline": "",
    "summary": "",
    "current_role": "",
    "experience": "",

    "skills": [],

    "education": [
        {{
            "institution": "",
            "degree": "",
            "field_of_study": "",
            "start_year": "",
            "end_year": ""
        }}
    ],

    "experience_details": [
        {{
            "company_name": "",
            "position": "",
            "description": "",
            "start_date": "",
            "end_date": ""
        }}
    ],

    "github": "",
    "linkedin": "",
    "portfolio": ""
}}

Resume:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    text = response.text.strip()
    if text.startswith("```json"):
        text = text.removeprefix("```json").removesuffix("```").strip()
    data = json.loads(text)

    return data