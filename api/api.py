import time
from flask import Flask, request
import analysis

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

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



if __name__ == '__main__':
    app.run(threaded=True)