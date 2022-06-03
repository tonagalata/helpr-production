# A collection of validation functions used through the app
def check_unique(coll, data, field, results=False):
    query = coll.fetchByExample({field: data}, batchSize=20, count=True)

    if query.count == 0:
        return {"unique": True}
    
    if results:
        return {"unique": False, "query_results": [x.getStore() for x in query]}
    
    return False
