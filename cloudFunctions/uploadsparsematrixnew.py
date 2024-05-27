import functions_framework
import os,time
from dotenv import load_dotenv
import json
import pandas as pd
from io import BytesIO
from drie_redis import DoubleTrie
from utils import RedisClient
import redis
from flask import jsonify

load_dotenv()
@functions_framework.http
def handle(request):
    """HTTP Cloud Function that processes CSV data and returns a JSON response.

    Args:
        request (flask.Request): The request object.

    Returns:
        A JSON serialized list containing the processed data.
    """

    # Get the CSV data from the request body
    csv_file = request.files.get('file')
    if not csv_file:
        return add_cors_headers(jsonify({'message': 'Missing required file "data" in the request.'})), 400

    # Read the CSV data into a pandas DataFrame
    try:
        df = pd.read_csv(BytesIO(csv_file.read()), header=0)
    except Exception as e:
        return add_cors_headers(jsonify({'message': f'Error reading CSV data: {e}'})), 400

    # Validate column names
    if 'company' not in df.columns or 'pincode' not in df.columns:
        return add_cors_headers(jsonify({'message': 'CSV data requires columns "key" and "value".'})), 400

    company_pincode_list=[]
    for i in range(len(df)):
      company_pincode_list.append((str(df.loc[i,"company"]),str(df.loc[i,"pincode"])))

    try:
        redis_client=RedisClient(host="10.196.16.3", port="6379", db=0, decode_responses=True)
        redis_client.flushDB()
        trieId=1
        dt=DoubleTrie(redis_client)
        t1=time.time()
        dt.load_from_file_fast(company_pincode_list,trieId,"initFile")
        t2=time.time()
        print(f"done loading in {t2-t1} seconds!")

        return add_cors_headers(jsonify({'message': f'done loading in {t2-t1} seconds!'})), 200
    except Exception as error:
        print(f'Error loading drie into redis: {error}')
        return add_cors_headers(jsonify({'message': f'Error loading drie into redis: {error}'})), 500


def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response
