import sys

from article_scraper import parse_article
from sentiment_analysis import analyze_sentiment
from entity_analysis import analyze_entities

#url = https://www.cmjornal.pt/politica/detalhe/andre-ventura-avisa-psd-que-chega-nao-sera-o-cds-do-seculo-xxi
url = sys.argv[1]

article_content = parse_article(url)
analyze_entities(article_content)
analyze_sentiment(article_content)

