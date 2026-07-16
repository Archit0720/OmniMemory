from datetime import datetime, timedelta


class DateResolver:

    @staticmethod
    def resolve(upload_date: str):

        if not upload_date:
            return None

        today = datetime.now().date()

        value = upload_date.lower().strip()

        if value == "today":
            return today.isoformat()

        if value == "yesterday":
            return (today - timedelta(days=1)).isoformat()

        if value == "tomorrow":
            return (today + timedelta(days=1)).isoformat()

        # Examples:
        # "14 july"
        # "14 jul"
        # "1 feb"

        formats = [
            "%d %B",
            "%d %b"
        ]

        for fmt in formats:

            try:

                dt = datetime.strptime(value, fmt)

                dt = dt.replace(year=today.year)

                return dt.date().isoformat()

            except ValueError:
                pass

        return upload_date