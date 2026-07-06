import os
import json
import anthropic

from dotenv import load_dotenv
load_dotenv()

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def extract_profile_fields(ocr_text: str):
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content":
                    f"""
                    Extract the following fields from this OCR text of a LinkedIn profile screenshot. Note that the person may have worked at multiple companies, and that they may have had multiple roles at their companies.
                    
                    Rules:
                    - Return ONLY a JSON array, even if there is only one experience entry -- always wrap it in [ ]
                    - Return ONLY a JSON array, where each element is an object with EXACTLY these keys: {{"title": "", "company": "", "dates": "", "location": "", "description": ""}}
                    - Do not add any other keys
                    - Do not wrap the JSON in markdown code fences or any other text
                    - If a field isn't found, use an empty string ""
                    - If no experience entries are found at all, return an empty array []
                    
                    OCR text:
                    {ocr_text}
                    """
            }
        ],
    )
    
    raw = response.content[0].text.strip()
    
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.rsplit("```", 1)[0]
    
    raw = raw.strip()
    # print(raw)
    return json.loads(raw)

def generate_cold_message(experiences: list[dict], user_message: str) -> str:
    all_experiences = []
    for exp in experiences:
        line = f"- {exp.get('title', '')} at {exp.get('company', '')} ({exp.get('dates')}), {exp.get('location', '')}: {exp.get('description', '')}"
        all_experiences.append(line)
    
    all_experiences = "\n".join(all_experiences) if all_experiences else "No experience data found."
    
    prompt = f"""
    You are helping someone write a short, personalized cold outreach message on LinkedIn.

    Here is the person's work experience history, extracted from their profile:
    {all_experiences}
    
    Here is what the sender wants to communicate or ask for:
    "{user_message}"
    
    Write a short, natural-sounding cold outreach message (3-5 sentences max, 150 characters max) that:
    - References something specific and relevant from their experience (most recent role is usually most relevant, but use judgment)
    - Clearly conveys the sender's intent from their input above
    - Sounds like a real person wrote it, not a template
    - Does not use overly formal or "salesy" language
    - Does not include a formal greeting like "Dear" or a sign-off/signature
    
    Return ONLY the message text, nothing else.
    """
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    
    return response.content[0].text.strip()