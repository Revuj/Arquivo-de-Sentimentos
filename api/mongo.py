from pymongo import MongoClient
mongo_address = 'mongodb://ArquivoSentimentos:ArquivoSentimentos@cluster0-shard-00-00.xjlhf.mongodb.net:27017,cluster0-shard-00-01.xjlhf.mongodb.net:27017,cluster0-shard-00-02.xjlhf.mongodb.net:27017/ArquivoSentimentos?ssl=true&replicaSet=atlas-13w6jb-shard-0&authSource=admin&retryWrites=true&w=majority'
mongo_client = MongoClient(mongo_address)
