from abc import ABC, abstractmethod


class BaseProcessor(ABC):

    @abstractmethod
    def extract_text(self, file_path: str):
        pass

    @abstractmethod
    def process(self, file_path: str):
        pass