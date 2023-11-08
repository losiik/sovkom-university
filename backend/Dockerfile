FROM python:3.8-bullseye

WORKDIR /app
COPY . .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install -r requirements.txt

CMD ["python", "-u", "app.py"]