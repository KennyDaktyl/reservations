FROM python:3.12-slim

WORKDIR /app

COPY . /app
COPY migrations /app/migrations

RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=app.run:create_app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

EXPOSE 5100

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5100", "app.run:app", "--chdir", "/app"]

