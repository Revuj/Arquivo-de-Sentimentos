web: GOOGLE_APPLICATION_CREDENTIALS="/app/google-credentials.json" gunicorn --chdir ./api app:app
worker: GOOGLE_APPLICATION_CREDENTIALS="/app/google-credentials.json" celery -A app.celery worker