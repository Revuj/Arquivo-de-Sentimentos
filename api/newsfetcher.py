# newspaper lybrary: https://newspaper.readthedocs.io/en/latest/
from newspaper import Article
import requests

years = [
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ]

def parse_article(url):
  article = Article(url, language='pt')
  article.download()
  article.parse()
  # Parsing is dependent of the source annotation
  # print("Article Authors: {}".format(article.authors))
  # print("Article Date: {}".format(article.publish_date))
  # print("Article Content: {}".format(article.text))
  return article.text

def get_articles_urls(entity, source):
  urls_by_year = {}

  for year in years:
    parameters = {
      "q": entity,
      "siteSearch": source,
      "maxItems": 2000,
      "from": year+"0101000000",
      "to": year+"123100000"
    }

    req = requests.get("https://arquivo.pt/textsearch", params=parameters)
    urls = []

    if req.status_code == 200:
      response_json = req.json()
      response_items = response_json['response_items']
      for item in response_items:
        urls.append(item['linkToOriginalFile'])

    urls_by_year[year] = urls

  print(urls_by_year)
  return urls_by_year

def get_articles_content(urls_by_year):
  content_by_year = {}

  for year in years:
    year_content = ""
    urls = urls_by_year[year]
    for url in urls:
      year_content += parse_article(url)

    content_by_year[year] = year_content
      
  return content_by_year

