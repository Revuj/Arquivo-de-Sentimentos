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

def get_articles_urls(entity, source):
  urlsByYear = {}

  # Unfortunately, the Arquivo API only returns a maximum of 2000 items per request
  # So in order to not risk lose too many items, we make a request for each year 
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

    urlsByYear[year] = urls

  return urlsByYear