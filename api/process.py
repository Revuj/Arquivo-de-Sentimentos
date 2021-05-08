from mongo import mongo_client, mongo_address

def check_active_process(entity, source):
  db = mongo_client.ArquivoSentimentos
  doc = db.Processes.find_one({'process_entity':entity, 'process_source':source})
  if doc:
    return True
  else:
    return False

def store_active_process(client, entity, source):
  db = client.ArquivoSentimentos
  element = {
    'process_entity': entity,
    'process_source': source,
  }
  successful = db.Processes.insert_one(element).acknowledged
  return successful

def delete_active_process(client, entity, source):
  db = client.ArquivoSentimentos
  query = {
    'process_entity': entity,
    'process_source': source,
  }
  successful = db.Processes.remove(query)['n'] > 0
  return successful
