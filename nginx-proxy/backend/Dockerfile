FROM python:3.9.9-slim-bullseye

WORKDIR /usr/src

COPY . . 

EXPOSE 5000

RUN pip install -r app/requirements.txt

CMD ["./app/main.py"]
ENTRYPOINT ["python3"]
