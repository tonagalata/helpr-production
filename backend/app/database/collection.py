from operator import index
from app.database.session import make_connection

import logging

client, db = make_connection()


# Establishing collections
def establish_or_get(collection_name, db=db, index_fields: list=None):
    if db.has_collection(collection_name):
        return db.collection(collection_name)
    
    coll = db.create_collection(collection_name)
    if index_fields is not None:
        if not isinstance(index_fields, (list, tuple)):
            raise TypeError(f"index_fields expected type(list) got {type(index_fields)}")
        
        coll.add_hash_index(fields=index_fields, unique=False)
    return coll
    

user_collection = establish_or_get("user", db, ["username"])
project_collection = establish_or_get("project", db, ["project_name"])
cohort_collection = establish_or_get("cohort", db)
university_collection = establish_or_get("university", db)

if db.has_graph("hub_graph"):
    hub_graph = db.graph("hub_graph")
else:
    hub_graph = db.create_graph("hub_graph")

# Edges: (User -> Cohort) && (User -> Project)
if not hub_graph.has_edge_definition("memberOf"):
    memberOf_edge = hub_graph.create_edge_definition(
        edge_collection="memberOf",
        from_vertex_collections=["user"],
        to_vertex_collections=['cohort', "project"]
    )
else:
    memberOf_edge = hub_graph.edge_collection("memberOf")

# Project -> Cohort Link
if not hub_graph.has_edge_definition("createdFor"):
    createdFor_edge = hub_graph.create_edge_definition(
        edge_collection="createdFor",
        from_vertex_collections=["project"],
        to_vertex_collections=['cohort']
    )
else:
    createdFor_edge = hub_graph.edge_collection("createdFor")

# Funding edges
if not hub_graph.has_edge_definition("isFunding"):
    isFunding_edge = hub_graph.create_edge_definition(
        edge_collection="isFunding",
        from_vertex_collections=["user"],
        to_vertex_collections=['project']
    )
else:
    isFunding_edge = hub_graph.edge_collection("isFunding")

# University sponsors
if not hub_graph.has_edge_definition("sponsoredBy"):
    sponsoredBy_edge = hub_graph.create_edge_definition(
        edge_collection="sponsoredBy",
        from_vertex_collections=["cohort"],
        to_vertex_collections=['university']
    )
else:
    sponsoredBy_edge = hub_graph.edge_collection("sponsoredBy")
