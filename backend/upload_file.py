import requests
import argparse
import boto3
import botocore

DIR_PATH = 'tracks'

def upload_file(files: list[str], id: int, name: str):
    reqUrl = f"http://localhost:5000/api/upload_files/{id}"

    post_files = []
    for file in files:
        post_files.append(('files', open(f'{DIR_PATH}/{file}', 'rb')))

    #post_files = [('files', open("/home/michu/code/clipper-app/backend/tracks/we_dem_boys.mp3", "rb")), ('files', open("/home/michu/code/clipper-app/backend/tracks/lighters_up.mp3", "rb"))]
    headersList={
        "Accept": "*/*",
    }

    payload={"name": name}

    response=requests.request(
        "POST", reqUrl, data=payload, files=post_files, headers=headersList)


    print(response.text)


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description="Upload file to the server")
    parser.add_argument('-f', '--files', nargs='+',
                        default=['lighters_up.mp3', 'we_dem_boys.mp3'])
    parser.add_argument('-i', '--id', action='store', type=int, required=True)
    parser.add_argument('-n', '--name', action='store', type=str)
    args=parser.parse_args()
    upload_file(args.files, args.id, args.name)
