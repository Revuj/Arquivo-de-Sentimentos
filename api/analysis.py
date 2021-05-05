import sys
import requests
from google.cloud import language_v1
# API Basics: https://cloud.google.com/natural-language/docs/basics
from google.cloud import language_v1
import newsfetcher
from bs4 import BeautifulSoup
from functools import partial

from mongo import mongo_client, mongo_address
from bson.objectid import ObjectId


sources_urls = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}



def analyze_sentiment(text_content):
    client = language_v1.LanguageServiceClient()
    type_ = language_v1.Document.Type.PLAIN_TEXT
    language = "pt"
    document = {"content": text_content, "type_": type_, "language": language}
    encoding_type = language_v1.EncodingType.UTF8

    response = client.analyze_sentiment(request = {'document': document, 'encoding_type': encoding_type})
    return response.document_sentiment.score, response.document_sentiment.magnitude


def fetch_link_preview(website, link):
  req = requests.get(link)
  if req.status_code != 200:
    return

  soup = BeautifulSoup(req.text, features='html.parser')

  link_title = soup.select_one('meta[property="og:title"]')
  link_description = soup.select_one('meta[property="og:description"]')
  link_site_name = soup.select_one('meta[property="og:site_name"]')
  link_image = soup.select_one('meta[property="og:image"]')

  if link_title is None or link_description is None or link_site_name is None or link_image is None:
    return

  try:
    return {'title':link_title['content'], 'description':link_description['content'], 'site_name':link_site_name['content'], 'image':link_image['content'], 'link':link, 'website':website}
  except KeyError:
    return


def create_link_previews(doc, db):
  fetch_bound = partial(fetch_link_preview, doc['website'])
  previews = filter(lambda x: x is not None, map(fetch_bound, doc['news']))
  previews = list(previews)
  db.ArquivoSentimentos.update({'_id': doc['_id']}, {'$set': {'link_previews': previews}})
  return previews

def get_link_previews(name, website):

  db = mongo_client.ArquivoSentimentos
  doc = db.ArquivoSentimentos.find_one({'website':website, 'name':name})
  if not doc:
    print(f'Unknown query {website} - {name}')
    return


  res = None
  if 'link_previews' not in doc:
    res = create_link_previews(doc, db)
  else:
    res = doc['link_previews']
  return res


def analysis(entity, source):

  db = mongo_client.ArquivoSentimentos

  query = {"name": entity, 'website': source }

  doc = db.ArquivoSentimentos.find_one(query)

  if doc:
    return [doc['sentiment'], doc['magnitude']]
  else:
    urls_by_year = newsfetcher.get_articles_urls(entity, sources_urls[source])
    content_by_year = newsfetcher.get_articles_content(urls_by_year)

    total_urls = []
    for year, urls in urls_by_year.items():
      total_urls.extend(urls)

    score_by_year = []
    magnitude_by_year = []
    for year, content in content_by_year.items():
      score, magnitude = analyze_sentiment(content)
      score_by_year.append(score)
      magnitude_by_year.append(magnitude)

    element = {
      'name': entity,
      'website': source,
      'sentiment': score_by_year , 
      'magnitude': magnitude_by_year , 
      'news': total_urls
    }
    inserted = db.ArquivoSentimentos.insert_one(element)

    return [score_by_year, magnitude_by_year]

def get_analysis_results(entity, source):

  db = mongo_client.ArquivoSentimentos

  query = {"name": entity, 'website': source }

  doc = db.ArquivoSentimentos.find_one(query)

  if doc:
    response = {
      'status': 'ON_CACHE',
      'content': { 
        'sentiment': { source : doc['sentiment'] }, 
        'magnitude': { source : doc['magnitude'] } 
      }
    }
    return response
  else:

    # TODO schedule analysis task with celery
    
    response = {
      'status': 'NOT_ON_CACHE',
      'content': ''
    }

  return response

def get_cached_names():
  db = mongo_client.ArquivoSentimentos

  query = {"name": { "$exists": True}}
  fields = { "name": 1, "_id": 0 }

  docs = db.ArquivoSentimentos.find(query, fields)

  cached_names = set()
  for doc in docs:
    cached_names.add(doc["name"])

  return list(cached_names)

