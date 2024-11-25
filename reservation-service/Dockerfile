FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install python-dotenv

COPY .env .env

ENV FLASK_APP=run.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development
ENV PYTHONPATH=/app

EXPOSE 5010

CMD ["sh", "-c", "flask db upgrade && python run.py --host=0.0.0.0 --port=5010"]