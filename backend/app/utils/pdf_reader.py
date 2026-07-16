import fitz


class PDFReader:

    @staticmethod
    def extract_text(file) -> str:

        pdf = fitz.open(stream=file.read(), filetype="pdf")

        text = ""

        for page in pdf:
            text += page.get_text()

        pdf.close()

        return text.strip()