from fastapi import FastAPI


app = FastAPI()


@app.get("/", tags=['test'])
async def index():
    return {
        "Real": "Python"
        }
