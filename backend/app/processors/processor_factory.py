from app.processors.text_processor import TextProcessor


class ProcessorFactory:

    @staticmethod
    def get_processor(file_type: str):

        if file_type == "txt":
            return TextProcessor()

        raise ValueError("Unsupported file type")