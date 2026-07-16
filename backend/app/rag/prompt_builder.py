from datetime import datetime


class PromptBuilder:

    @staticmethod
    def build(question: str, contexts: list):

        today = datetime.now().strftime("%Y-%m-%d")

        sections = []

        for i, ctx in enumerate(contexts):

            entities = ctx.get("entities", [])

            section = f"""
==========================
Memory {i + 1}

Title:
{ctx.get("title", "")}

Summary:
{ctx.get("summary", "")}

Memory Type:
{ctx.get("memory_type", "")}

Upload Date:
{ctx.get("created_at", "")}

Dates Mentioned Inside Memory:
{", ".join(ctx.get("dates", []))}

Products:
{", ".join(ctx.get("products", []))}

People:
{", ".join(ctx.get("people", []))}

Organizations:
{", ".join(ctx.get("organizations", []))}

Locations:
{", ".join(ctx.get("locations", []))}

Topics:
{", ".join(ctx.get("topics", []))}

Keywords:
{", ".join(ctx.get("keywords", []))}

Entities:
{entities}

Relevant Text:
{ctx.get("text", "")}
"""

            sections.append(section)

        context_text = "\n".join(sections)

        prompt = f"""
You are OmniMemory AI.

Today's date is:

{today}

The user asks questions about their stored memories.

IMPORTANT:

There are TWO kinds of dates.

1. Upload Date
This is when the memory was stored.

2. Dates Mentioned Inside Memory
These are dates written inside the document.

Examples:

If the user asks:

"What did I upload today?"

→ Match Upload Date.

If the user asks:

"What did I buy on 2018-02-01?"

→ Match Dates Mentioned Inside Memory.

If the user asks:

"What receipt did I upload today?"

→ Use Upload Date.

If the user asks:

"What happened on 2018-02-01?"

→ Use Dates Mentioned Inside Memory.

You may combine multiple memories.

Never invent facts.

If the answer isn't found, reply exactly:

"I couldn't find this information in your memories."

====================================

{context_text}

====================================

Question:

{question}

Answer:
"""

        return prompt