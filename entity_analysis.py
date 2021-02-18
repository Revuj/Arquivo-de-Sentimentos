from google.cloud import language_v1

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

example_text = 'André Ventura entregou em janeiro, ao Tribunal Constitucional, cerca de oito mil assinaturas, com a intenção de formalizar o movimento "Chega" como partido político. Parte dessas assinaturas foram invalidadas por pertencerem a menores e a elementos de forças policiais, pelo que, para já, o Chega ainda não pode candidatar-se a eleições. De forma a, ainda assim, poder candidatar-se às europeias, André Ventura propôs-se encabeçar a coligação de centro-direita, que adotaria o nome "Coligação Chega", e que incluiria o Partido Popular Monárquico (PPM), o Partido Cidadania e Democracia Cristã (PCDC) e membros do movimento Democracia 21. Depois de ter sido dado como certo que Ventura seria cabeça de lista da coligação às eleições europeias, o PPM decidiu em Conselho Nacional que não aceita acolhê-lo nas suas listas de candidatos, e que rejeita uma coligação com qualquer movimento ou partido que o acolha, considerando-o " racista e populista ". Dada a sucessão de percalços no percurso de André Ventura, Ricardo Araújo Pereira lamenta que, de todos os comentadores de desporto da CMTV, tenha sido André Ventura a tentar encabeçar um projeto político: "Acho que quer Octávio Machado, quer Paulo Futre, têm um pensamento político mais coerente e mais profundo". O humorista ilustra o seu ponto, questionando o slogan de um dos cartazes de André Ventura, que diz: "100 deputados chega e sobra!" - "Ora, nesse caso, pode cortar mais ainda! Passam a 50! É um populista que nem sequer sabe ser populista!", conclui.'
analyze_entities(example_text)