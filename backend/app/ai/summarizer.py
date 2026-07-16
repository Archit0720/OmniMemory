from app.ai.groq_client import client


class Summarizer:

    @staticmethod
    def summarize(text: str):

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content":
                    "You summarize documents professionally."
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.2,
            max_tokens=250
        )

        return completion.choices[0].message.content