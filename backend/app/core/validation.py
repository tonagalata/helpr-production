import re

# A collection of validation functions used through the app
def check_unique(coll, data, field, results=False):
    query = coll.fetchByExample({field: data}, batchSize=20, count=True)

    if query.count == 0:
        return {"unique": True}
    
    if results:
        return {"unique": False, "query_results": [x.getStore() for x in query]}
    
    return False

def set_key_number(coll, key_value):
    query = coll.fetchByExample({'_key': key_value}, batchSize=20, count=True)

    if query.count == 0:
        return key_value
    
    key_search = re.search(r"\d+$", key_value)
    try:
        next_val = int(key_search.group()) + 1
        key_value = key_value[:key_search.start()] + str(next_val)
    except AttributeError:
        key_value = key_value + '1'
    
    return set_key_number(coll, key_value)
