from passlib.context import CryptContext
from app.database.collection import user_collection

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(plain_password):
    return pwd_context.hash(plain_password)

def get_user(coll, username: str, doc_return: bool=False):
    query = coll.find({'username': username})

    if query.count() > 0:
        if doc_return:
            return query.next()
        return query.next()
    
    return None

def authenticate_user(coll, username: str, password: str):
    user = get_user(coll, username)

    if user is None:
        return False
    
    if not verify_password(password, user['password']):
        return False
    
    return user
