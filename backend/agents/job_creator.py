import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("GROQ_API_KEY"))

def generate_job_description(data: dict) -> str:
    prompt = f"""
    Create a professional job description:
    - Job Title: {data['job_title']}
    - Company: {data['company_name']}
    - Location: {data.get('location')}
    - Experience Level: {data.get('experience_level')}
    - Skills: {', '.join(data['skills_required'])}
    - Industry: {data.get('industry')}
    - Type: {data.get('employment_type')}
    """
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
