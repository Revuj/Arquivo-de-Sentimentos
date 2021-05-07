from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin
from mongo import mongo_client
from process import check_active_process, store_active_process, delete_active_process
import analysis
import os


app = Flask(__name__, static_url_path='', static_folder='../frontend/build')
cors = CORS(app)

sources_urls = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}

@app.route('/db_check')
@cross_origin()
def db_check():
    entity = request.args.get('entity')
    source = request.args.get('source')
    return {'check': check_active_process(entity, source)}

@app.route('/db_insert')
@cross_origin()
def db_insert():
    entity = request.args.get('entity')
    source = request.args.get('source')
    return {'insert': store_active_process(entity, source)}

@app.route('/db_delete')
@cross_origin()
def db_delete():
    entity = request.args.get('entity')
    source = request.args.get('source')
    return {'delete': delete_active_process(entity, source)}

@app.route('/cache', methods=['GET'])
@cross_origin()
def cache():
    return { 'names': analysis.get_cached_names()}

@app.route('/results')
@cross_origin()
def results():
    entity = request.args.get('entity')
    source = request.args.get('source')
    return analysis.get_analysis_results(entity, source)

@app.route('/analyse', methods=['POST', 'GET'])
@cross_origin()
def analyse():
    entity = request.args.get('entity')
    source = request.args.get('source')
    analysis_by_year, magnitude_by_year = analysis.analysis(entity, source)
    return { 'sentiment': { source : analysis_by_year }, 'magnitude': { source : magnitude_by_year } }

@app.route('/previews')
@cross_origin()
def previews():
    entity = request.args.get('entity')
    source = request.args.get('source')
    return {'previews': analysis.get_link_previews(entity, source)}

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)
