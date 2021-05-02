from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request
from mongo import mongo_client
import analysis
import os


app = Flask(__name__)

sources_urls = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}

@app.route('/analyse', methods=['POST', 'GET'])
def analyse():
    '''
    db = mongo_client.ArquivoSentimentos
    db.ArquivoSentimentos.update_many({}, {'$unset': {'link_previews':1}})
    '''
    entity = request.args.get('entity')
    source = request.args.get('source')

    analysis_by_year, magnitude_by_year = analysis.analysis(entity, source)
    return { 'sentiment': { source : analysis_by_year }, 'magnitude': { source : magnitude_by_year } }



@app.route('/previews')
def previews():

    entity = request.args.get('entity')
    source = request.args.get('source')
    return {'previews': analysis.get_link_previews(entity, source)}


if __name__ == '__main__':
    app.run(threaded=True)
