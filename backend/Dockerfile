FROM python:3.11.7-slim as base


WORKDIR /app

COPY requirements.txt .
RUN python -m pip install -r requirements.txt --no-cache-dir

COPY . .

CMD ["python", "main.py"]
