import json
import datetime
import logging

from arango import ArangoClient
from arango.exceptions import ServerConnectionError

import os

arango_url = os.environ.get("ARANGO_URL", "127.0.0.1")
arango_port = os.environ.get("ARANGO_PORT", "8529")
arango_user = os.environ.get("ARANGO_USER", 'root')
arango_pass = os.environ.get("ARANGO_ROOT_PASSWORD", '')

url = f"http://{arango_url}:{arango_port}"



def defaultconverter(o):
    if isinstance(o, (datetime.datetime, datetime.date)):
        return o.__str__()

def makeJson(d):
    return json.dumps(d, default=defaultconverter)

def make_connection(url=url, username=arango_user, password=arango_pass):
    """
    Make a connection to ArangoDB.
    """

    try:
        client = ArangoClient(
            hosts=url,
            serializer=makeJson
        )

        sys_db = client.db("_system", username=username, password=password)
        if not sys_db.has_database("projectHub"):
            sys_db.create_database("projectHub")

        db = client.db("projectHub", username=username, password=password)
    
    except Exception as e:
        logging.error("ArangoDB connection cannot be established.")
        logging.error(f"{e}")
        raise ServerConnectionError(
            f"Host: {url}, User: {username}, PASS: {password}, {e}"
        )

    return client, db

