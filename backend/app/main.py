from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.api.user import router as user_routes
from app.api.project import router as project_routes
from app.auth.jwt_handler import Token, create_access_token
from app.auth.pass_validation import authenticate_user
from app.database.collection import user_collection
from fastapi.middleware.cors import CORSMiddleware
from app.api.funding import router as funding_routes
from app.api.org import router as org_routes

from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ 
        "http://localhost:3000", 
        "http://172.16.231.98:3000",
        "https://projects.greenknightdata.net",
        "http://projects.greenknightdata.net:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes)
app.include_router(project_routes)
app.include_router(org_routes)
app.include_router(funding_routes)

@app.post("/token", response_model=Token, tags=['Auth'])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(user_collection, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/", tags=['test'])
async def index():
    return {
        "Real": "Python"
        }
