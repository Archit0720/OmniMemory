import json

from app.ai.groq_client import client


class QueryPlanner:

    @staticmethod
    def plan(question: str):

        prompt = f"""
You are a query planner for a memory retrieval system.

Extract structured search filters.

Return ONLY valid JSON.

Format:

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
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = json.loads(
            response.choices[0].message.content
        )

        print("\n========== QUERY PLAN ==========")
        print(json.dumps(result, indent=4))
        print("================================\n")

        return result