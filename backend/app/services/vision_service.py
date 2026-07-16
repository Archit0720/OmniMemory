import base64

from app.ai.groq_client import client


class VisionService:

    @staticmethod
    def extract_text(image_bytes: bytes):

        image_base64 = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.2,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """
You are an AI assistant.

Look at this image carefully.

Extract EVERYTHING useful.

If there is text:
- OCR it exactly.

If it is a document:
- Preserve the meaning.

If it is a receipt:
- Extract items.

If it is a diagram:
- Explain it.

If it is a whiteboard:
- Convert it into readable notes.

Return ONLY plain text.
"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ]
        )

        return response.choices[0].message.content