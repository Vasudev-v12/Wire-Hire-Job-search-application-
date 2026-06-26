from pypdf import PdfReader
import json
from google import genai
from envConfig import GEMINI_API_KEY
from api_server.db import UserProfile

client = genai.Client(
    api_key=GEMINI_API_KEY
)

def extract_pdf_text(path: str):
    reader = PdfReader(path)

    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"

    return text
def get_keywords(path: str):
    prompt = f"""
    Extract resume information and return ONLY JSON.

    Schema:

    {{
    "first_name":"",
    "last_name":"",
    "phone":"",
    "location":"",
    "summary":"",

    "skills":[
        "Python",
        "FastAPI"
    ],

    "education":[
        {{
        "institution":"",
        "degree":"",
        "field_of_study":"",
        "start_year":"",
        "end_year":""
        }}
    ],

    "experience":[
        {{
        "company_name":"",
        "position":"",
        "description":"",
        "start_date":"",
        "end_date":""
        }}
    ]
    }}

    Resume:

    {extract_pdf_text(path)}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    data = json.loads(response.text)

    profile = UserProfile(
        user_id=user.id,
        first_name=data["first_name"],
        last_name=data["last_name"],
        phone=data["phone"],
        location=data["location"],
        summary=data["summary"]
    )

    db.add(profile)