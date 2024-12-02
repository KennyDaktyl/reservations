FROM python:3.12-slim

WORKDIR /app

COPY . /app
COPY migrations /app/migrations

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install python-dotenv

COPY .env .env

ENV FLASK_APP=app.run:create_app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

EXPOSE 5005

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5010", "app.run:app", "--chdir", "/app"]
