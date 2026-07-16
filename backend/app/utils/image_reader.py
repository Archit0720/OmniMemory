from PIL import Image
import pytesseract


# Change this if your installation path is different
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


class ImageReader:

    @staticmethod
    def extract_text(file):

        image = Image.open(file)

        text = pytesseract.image_to_string(image)

        return text.strip()