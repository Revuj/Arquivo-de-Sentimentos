# newspaper lybrary: https://newspaper.readthedocs.io/en/latest/
from newspaper import Article

def parse_article(url):
  article = Article(url, language='pt')
  article.download()
  article.parse()
  # Parsing is dependent of the source annotation
  print("Article Authors: {}".format(article.authors))
  print("Article Date: {}".format(article.publish_date))
  print("Article Content: {}".format(article.text))

example_url = 'https://www.cmjornal.pt/politica/detalhe/andre-ventura-avisa-psd-que-chega-nao-sera-o-cds-do-seculo-xxi'
parse_article(example_url)




