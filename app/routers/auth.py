from fastapi import APIRouter 
from app.schemas.user import UserLogin,UserSignup
from app.services.auth import signup,verify_login

router = APIRouter()

@router.post("/signup")
def user_singup(body:UserSignup):
    signup(body.username,body.password)
    return {"message":"Singup Successful"}

@router.post("/login")
def user_login(body:UserLogin):
    if not verify_login(body.username,body.password):
        return {"message":"Invalid Credentials"}
    return {"message":"Login Successful"}

