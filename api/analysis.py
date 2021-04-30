import sys
import requests
from google.cloud import language_v1
# API Basics: https://cloud.google.com/natural-language/docs/basics
from google.cloud import language_v1
import newsfetcher

from pymongo import MongoClient

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

def analysis(entity, source):

  client = MongoClient('mongodb://ArquivoSentimentos:ArquivoSentimentos@cluster0-shard-00-00.xjlhf.mongodb.net:27017,cluster0-shard-00-01.xjlhf.mongodb.net:27017,cluster0-shard-00-02.xjlhf.mongodb.net:27017/ArquivoSentimentos?ssl=true&replicaSet=atlas-13w6jb-shard-0&authSource=admin&retryWrites=true&w=majority')
  db = client.ArquivoSentimentos

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
    db.ArquivoSentimentos.insert_one(element)

    return [score_by_year, magnitude_by_year]

