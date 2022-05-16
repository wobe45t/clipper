FROM python:3.9.9-slim-bullseye

WORKDIR /usr/src

COPY . . 

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["main.py"]
ENTRYPOINT ["python3"]
