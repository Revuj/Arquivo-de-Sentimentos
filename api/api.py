import time
from flask import Flask, request
import analysis

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

sources_urls = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}

@app.route('/analyse', methods=['POST', 'GET'])
def analyse():
    entity = request.args.get('entity')
    source = request.args.get('source')
    
    # results = { 'Correio da Manhã' : [5, 3 , 4, 1, 0, 1, 2, 3, 4, 5, 5, 3 , 4, 1, 0, 1, 2, 3, 4, 5, 4, 5] , 
    #             'Jornal de Notícias' : [3, 3 , 0, 0, 4, 3, 5, 1, 4, 3, 3, 3 , 3, 5, 3, 2, 1, 1, 0, 3, 4, 5] }
    
    analysis_by_year = analysis.analysis(entity, sources_urls[source])

    return { source: analysis_by_year }

