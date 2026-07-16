from app.processors.base_processor import BaseProcessor


class TextProcessor(BaseProcessor):

    def extract_text(self, file_path: str):

        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    def process(self, file_path: str):

        text = self.extract_text(file_path)

        return {
            "text": text
        }