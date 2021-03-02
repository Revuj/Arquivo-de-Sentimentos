import time
from flask import Flask, request
import analysis


app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/analyse', methods=['POST', 'GET'])
def analyse():
    url = request.json.get('url')
    result = analysis.analysis(url)
    return {'score': result['score'], 'magnitude': result['magnitude']}

