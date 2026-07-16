from langchain_text_splitters import RecursiveCharacterTextSplitter


class Chunker:

    @staticmethod
    def split(text: str):

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
            separators=["\n\n", "\n", ".", " ", ""]
        )

        return splitter.split_text(text)