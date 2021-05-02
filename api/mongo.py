import os
from pymongo import MongoClient
mongo_address = os.environ['MONGO_ADDRESS']
mongo_client = MongoClient(mongo_address)
