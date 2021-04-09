import time
from flask import Flask, request
import analysis

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/analyse/<entity>', methods=['POST', 'GET'])
def analyse(entity):
    # sources = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}
    sources = {'Público': 'www.publico.pt'}
    
    results = { 'Correio da Manhã' : [5, 3 , 4, 1, 0, 1, 2, 3, 4, 5, 5, 3 , 4, 1, 0, 1, 2, 3, 4, 5, 4, 5] , 
                'Jornal de Notícias' : [3, 3 , 0, 0, 4, 3, 5, 1, 4, 3, 3, 3 , 3, 5, 3, 2, 1, 1, 0, 3, 4, 5] }
    
    for source, url in sources.items():
        analysis_by_year = analysis.analysis(entity, url)
        results[source] = analysis_by_year

    return results

