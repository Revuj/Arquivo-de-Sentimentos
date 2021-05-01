import time
from flask import Flask, request
from create_celery import make_celery
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config.update(CELERY_BROKER_URL=os.environ['REDIS_URL'])
celery = make_celery(app)
import analysis
from tasks import do_in_background

from mongo import mongo_client

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

sources_urls = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}

@app.route('/analyse', methods=['POST', 'GET'])
def analyse():
    entity = request.args.get('entity')
    source = request.args.get('source')

    analysis_by_year, magnitude_by_year = analysis.analysis(entity, source)
    return { 'sentiment': { source : analysis_by_year }, 'magnitude': { source : magnitude_by_year } }



@app.route('/previews')
def previews():

    entity = request.args.get('entity')
    db = mongo_client.ArquivoSentimentos
    res = db.ArquivoSentimentos.find({'name':entity})

    previews = []
    for document in res:

        if 'link_previews' not in document:
            continue
        previews.extend(document['link_previews'])
    return {'previews': previews}


if __name__ == '__main__':
    app.run(threaded=True)
