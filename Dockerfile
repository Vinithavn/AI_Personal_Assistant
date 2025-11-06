FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
# If your DB (e.g., mydb.sqlite) or config files should be in the image:
# COPY mydb.sqlite . 

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
