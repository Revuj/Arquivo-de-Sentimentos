import time
from flask import Flask, request
import analysis


app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/analyse', methods=['POST', 'GET'])
def analyse():
    entity = request.json.get('entity')
    result = analysis.analysis(entity)
    # return {'score': result['score'], 'magnitude': result['magnitude']}
    return { 'urls': result }

