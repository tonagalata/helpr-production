from pyArango.connection import Connection
from pyArango.theExceptions import ConnectionError
import logging

import os

arango_url = os.environ.get("ARANGO_URL", "127.0.0.1")
arango_port = os.environ.get("ARANGO_PORT", "8529")
arango_user = os.environ.get("ARANGO_USER", 'root')
arango_pass = os.environ.get("ARANGO_ROOT_PASSWORD", '')

url = f"http://{arango_url}:{arango_port}"


def make_connection(url=url, username=arango_user, password=arango_pass):
    """
    Make a connection to ArangoDB.
    """

    try:
        conn = Connection(
            arangoURL=url,
            username=username,
            password=password
        )
    except ConnectionError as e:
        logging.error("ArangoDB connection cannot be established.")
        logging.error(f"{e}")
        raise ConnectionError(f"User: {username}, PASS: {password}, {e}")

    return conn
