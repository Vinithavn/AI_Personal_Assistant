from fastapi import APIRouter, HTTPException
from app.schemas.user import UserLogin, UserSignup
from app.services.auth import signup, verify_login

router = APIRouter()

@router.post("/signup")
def user_signup(body: UserSignup):
    try:
        signup(body.username, body.password)
        return {"message": "Signup Successful"}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Signup failed")

@router.post("/login")
def user_login(body: UserLogin):
    if not verify_login(body.username, body.password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    return {"message": "Login Successful"}

