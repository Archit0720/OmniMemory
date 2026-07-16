import json
from app.ai.groq_client import client


class DocumentIntelligenceService:

    @staticmethod
    def analyze(text: str):

        prompt = f"""
You are an intelligent document understanding AI.

Analyze the document carefully.

Return ONLY valid JSON.

Return exactly this schema:

{{
    "title": "",
    "summary": "",
    "memory_type": "",

    "keywords": [],
    "topics": [],

    "language": "",
    "sentiment": "",

    "people": [],
    "organizations": [],
    "locations": [],
    "dates": [],
    "products": [],

    "entities": [
        {{
            "type": "",
            "value": ""
        }}
    ]
}}

Rules:

- memory_type should be one of:
  Receipt
  Invoice
  Resume
  Meeting Notes
  Lecture Notes
  Medical
  Email
  Chat
  Book
  Research Paper
  Personal Note
  Image
  Screenshot
  Other

- Extract ALL important people.

- Extract ALL organizations.

- Extract ALL locations.

- Extract ALL dates.

- Extract ALL products.

- Entities should contain important facts.

Example:

[
    {{
        "type":"PRODUCT",
        "value":"T-Shirt"
    }},
    {{
        "type":"DATE",
        "value":"2018-02-01"
    }}
]

Return ONLY JSON.

Document:

{text}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = json.loads(response.choices[0].message.content)

        print("\n========== DOCUMENT ANALYSIS ==========")
        print(json.dumps(result, indent=4))
        print("=======================================\n")

        return result