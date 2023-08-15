import firebase_admin
from firebase_admin import auth

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBasicCredentials, HTTPBearer
from google.cloud import error_reporting

from db.audience import get_audience_overlap


app = FastAPI()
security = HTTPBearer()
default_app = firebase_admin.initialize_app()
err_client = error_reporting.Client()


def check_bearer_token(credentials: HTTPBasicCredentials=Depends(security)):
    token = credentials.credentials
    try:
        auth.verify_id_token(token)
    except Exception as ex:
        raise HTTPException(status_code=403, detail='Bearer token is invalid')


@app.get('/')
def read_root():
    return {'Hello': 'World'}


@app.get('/reports/audience-overlap/{audience_id}', dependencies=[Depends(check_bearer_token)])
def audience_overlap(audience_id: str):
    try:
        return get_audience_overlap(audience_id)
    except:
        err_client.report_exception()
