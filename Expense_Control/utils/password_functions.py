import bcrypt

def generate_password(password):
  hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
  return hashed_password

def check_password(password, hashed_password):
  if bcrypt.checkpw(password.encode('utf-8'), hashed_password):
    return True
  else:
    return False
