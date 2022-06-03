from app.database.session import make_connection
from pyArango.database import Database
from pyArango.collection import Collection, CreationError, Edges, Field
from pyArango.connection import Connection
from pyArango.graph import Graph, EdgeDefinition

import logging

conn = make_connection()


# Helper function for making a database
def getDatabase(name: str, conn: Connection=conn) -> Database:
    """
    Creates and retrieves a database on the Arango connection.

    """

    try:
        db = conn[name]
    except KeyError:
        logging.info(f"Database '{name}' does not exist. Creating.")
        db = conn.createDatabase(name)
    
    return db


# Establishing the database
db = getDatabase('projectHub')


# Setting up classes for database collections
class User(Collection):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        "email": Field(),
        "first_name": Field(),
        "last_name": Field(),
    }


class Project(Collection):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        "project_name": Field(),
        "github_repo": Field(),
        "description": Field(),
        "short_desc": Field(),
        "stars": Field(),
        "funds": Field(),
        "date_created": Field()
    }


class Cohort(Collection):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        "cohort_id": Field(),
        "start_date": Field(),
        "end_date": Field(),
    }


class University(Collection):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        "university_name": Field(),
    }


# Establishing Edge Collections
class memberOf(Edges):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        'role': Field(),
        "last_modified": Field()
    }


class isFunding(Edges):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        'funding_amount': Field(),
        "valid_funds": Field(),
        "date_created": Field(),
        "last_modified": Field()
    }


class createdFor(Edges):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }


class sponsoredBy(Edges):
    _validation = {
        'on_save': False,
        'on_set': False,
        'allow_foreign_fields': True,
    }

    _fields = {
        'sponsor_name': Field(),
    }


# Creating the Graph
class ProjectHub(Graph):
    _edgeDefinitions = [
        EdgeDefinition(
            "memberOf",
            fromCollections=["User"],
            toCollections=['Cohort', "Project"]
        ),
        EdgeDefinition(
            "createdFor",
            fromCollections=["Project"],
            toCollections=['Cohort']
        ),
        EdgeDefinition(
            "isFunding",
            fromCollections=["User"],
            toCollections=["Project"]
        ),
        EdgeDefinition(
            "sponsoredBy",
            fromCollections=['Cohort'],
            toCollections=['University']
        )
    ]
    _orphanedCollections = []

# Establishing collections
def estabilsh_or_get(collection_name, db=db):
    if db.hasCollection(collection_name):
        return db[collection_name]
    
    return db.createCollection(collection_name)


user_collection = estabilsh_or_get("User", db)
project_collection = estabilsh_or_get("Project", db)
cohort_collection = estabilsh_or_get("Cohort", db)
uni_collection = estabilsh_or_get("University", db)

if db.hasGraph("ProjectHub"):
    hub_graph = db.graphs['ProjectHub']
else:
    hub_graph = db.createGraph("ProjectHub")
