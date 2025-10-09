class User:
    def __init__(self,username:str,password:str):
        self.username = username
        self.password = password

class Session:
    def __init__(self,session_id:str,username:str):
        self.session_id = session_id
        self.username = username
