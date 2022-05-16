#!/bin/python3
import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import boto3

app = FastAPI()



s3 = boto3.client('s3',
        endpoint_url='http://192.168.0.7:7000',
        aws_access_key_id='minio',
        aws_secret_access_key='minio123',
        region_name='my-region')

@app.get('/api')
def main():
    url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': 'clipper-app',
                'Key': 'lighters_up.mp3'
            }
        )
    return RedirectResponse(url)
    

if __name__ == '__main__':
    uvicorn.run("main:app", host='0.0.0.0', port=5000)
