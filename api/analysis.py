import sys
import requests
from google.cloud import language_v1
# API Basics: https://cloud.google.com/natural-language/docs/basics
from google.cloud import language_v1
import newsfetcher
from bs4 import BeautifulSoup

from mongo import mongo_client, mongo_address
from bson.objectid import ObjectId


sources_urls = {'Correio da Manhã': 'www.cmjornal.pt', 'Jornal de Notícias': 'www.jn.pt', 'Público': 'www.publico.pt'}


def analyze_entities(text_content):
    """
    Analyzing Entities in a String

    Args:
      text_content The text content to analyze
    """

    client = language_v1.LanguageServiceClient()

    # Available types: PLAIN_TEXT, HTML
    type_ = language_v1.Document.Type.PLAIN_TEXT

    # Optional. If not specified, the language is automatically detected.
    # For list of supported languages:
    # https://cloud.google.com/natural-language/docs/languages
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = language_v1.EncodingType.UTF8

    response = client.analyze_entities(request = {'document': document, 'encoding_type': encoding_type})

    # Loop through entitites returned from the API
    for entity in response.entities:
        print(u"Representative name for the entity: {}".format(entity.name))

        # Get entity type, e.g. PERSON, LOCATION, ADDRESS, NUMBER, et al
        print(u"Entity type: {}".format(language_v1.Entity.Type(entity.type_).name))

        # Get the salience score associated with the entity in the [0, 1.0] range
        print(u"Salience score: {}".format(entity.salience))

        # Loop over the metadata associated with entity. For many known entities,
        # the metadata is a Wikipedia URL (wikipedia_url) and Knowledge Graph MID (mid).
        # Some entity types may have additional metadata, e.g. ADDRESS entities
        # may have metadata for the address street_name, postal_code, et al.
        for metadata_name, metadata_value in entity.metadata.items():
            print(u"{}: {}".format(metadata_name, metadata_value))

        # Loop over the mentions of this entity in the input document.
        # The API currently supports proper noun mentions.
        for mention in entity.mentions:
            print(u"Mention text: {}".format(mention.text.content))

            # Get the mention type, e.g. PROPER for proper noun
            print(
                u"Mention type: {}".format(language_v1.EntityMention.Type(mention.type_).name)
            )

    # Get the language of the text, which will be the same as
    # the language specified in the request or, if not specified,
    # the automatically-detected language.
    print(u"Language of the text: {}".format(response.language))


def analyze_sentiment(text_content):
    """
    Analyzing Sentiment in a String

    Args:
      text_content The text content to analyze
    """

    client = language_v1.LanguageServiceClient()

    # Available types: PLAIN_TEXT, HTML
    type_ = language_v1.Document.Type.PLAIN_TEXT

    # Optional. If not specified, the language is automatically detected.
    # For list of supported languages:
    # https://cloud.google.com/natural-language/docs/languages
    language = "pt"
    document = {"content": text_content, "type_": type_, "language": language}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = language_v1.EncodingType.UTF8

    response = client.analyze_sentiment(request = {'document': document, 'encoding_type': encoding_type})
    # Get overall sentiment of the input document
    # print(u"Document sentiment score: {}".format(response.document_sentiment.score))
    # print(
    #     u"Document sentiment magnitude: {}".format(
    #         response.document_sentiment.magnitude
    #     )
    # )
    # Get sentiment for all sentences in the document
    # for sentence in response.sentences:
        # print(u"Sentence text: {}".format(sentence.text.content))
        # print(u"Sentence sentiment score: {}".format(sentence.sentiment.score))
        # print(u"Sentence sentiment magnitude: {}".format(sentence.sentiment.magnitude))

    # Get the language of the text, which will be the same as
    # the language specified in the request or, if not specified,
    # the automatically-detected language.
    # print(u"Language of the text: {}".format(response.language))
    return response.document_sentiment.score, response.document_sentiment.magnitude


def fetch_link_preview(link):
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
    return {'title':link_title['content'], 'description':link_description['content'], 'site_name':link_site_name['content'], 'image':link_image['content'], 'link':link}
  except KeyError:
    return


def create_link_previews(doc, db):
  previews = filter(lambda x: x is not None, map(fetch_link_preview, doc['news']))
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

