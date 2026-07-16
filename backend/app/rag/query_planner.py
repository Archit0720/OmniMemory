import json

from app.ai.groq_client import client


class QueryPlanner:

    @staticmethod
    def parse(question: str):

        prompt = f"""
You are an AI Query Planner for OmniMemory.

Your job is ONLY to extract filters.

Return ONLY valid JSON.

Allowed memory types:

Receipt
Invoice
Document
Image
PDF
Conversation
Note
Meeting
Email
Unknown

Intent examples:

purchase
memory_lookup
person_lookup
product_lookup
location_lookup
general_search

If a field is not present, return:

[]

or

""

Never invent values.

Return exactly:

{{
    "intent": "",
    "memory_type": "",
    "products": [],
    "people": [],
    "organizations": [],
    "locations": [],
    "dates": [],
    "upload_date": ""
}}

Question:

{question}
"""

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            temperature=0,

            response_format={
                "type": "json_object"
            },

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        parsed = json.loads(
            response.choices[0].message.content
        )

        print("\n========== QUERY PLAN ==========")
        print(
            json.dumps(
                parsed,
                indent=4
            )
        )
        print("===============================\n")

        return parsed