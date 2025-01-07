from flask import Flask, jsonify, request
from flask.cli import with_appcontext
import click, os
from dotenv import load_dotenv
from .models.db import *
from .utils.password_functions import generate_password as gen_pw
from .utils.password_functions import check_password as check_pw
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from flask_jwt_extended import create_access_token, set_access_cookies, unset_access_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_csrf_token, get_jwt
from flask_migrate import Migrate

from datetime import datetime
from sqlalchemy import func, and_, desc, extract

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

db.init_app(app)
migrate = Migrate(app, db)

CORS(app, origins='http://localhost:3000', supports_credentials=True)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
  return User.query.filter_by(id=user_id).first()


#--------------------Routes---------------------
@app.get('/')
@login_required
@jwt_required(locations=['cookies'])
def hello():
  return jsonify(
    msg = "Hello"
  ), 200

@app.post('/login')
def login():
  try:
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
  
  except Exception as err:
    return jsonify(
      msg = f'Error: {err}'
    ), 400
    
  user = db.one_or_404(db.select(User).filter_by(name=username))

  if user:
    if check_pw(password, user.password):
      login_user(user)
      
      response = jsonify(
        {"msg" : "User logged in"}
      )

      access_token = create_access_token(identity=username)
      set_access_cookies(response, access_token)
      # response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite='None')

      # response.set_cookie("csrf_access_token", access_token, httponly=True, secure=False, samesite='None')
      return response
  
    return jsonify(
      msg = "Incorrect password"
    ), 400

@app.get('/logout')
@login_required
@jwt_required()
def logout():
  logout_user()
  
  response = jsonify(
    msg = "User logged out"
  )
  unset_jwt_cookies(response)
  unset_access_cookies(response)

  return response, 200

@app.get('/isauth')
@jwt_required()
def is_auth():
  cur_user = get_jwt_identity()
  if cur_user:
    return jsonify(
      msg = "user logged in"
    ), 200
  return jsonify(
    msg = "user not logged"
  ), 400

@app.get('/count')
@login_required
@jwt_required()
def count():
  now = datetime.now()

  start_date = datetime(now.year, now.month, 1)
  end_date = datetime(now.year, now.month, 15)
  try:
    total_transaction = db.session.query(func.sum(Transaction.value)).filter(Transaction.on_date.between(start_date, end_date)).scalar()
    total_expense = db.session.query(func.sum(Expense.value)).filter(Expense.on_date.between(start_date, end_date)).scalar()

    remaining = total_transaction - total_expense

    return jsonify(
      data = {
        'total_transaction': total_transaction,
        'total_expense': total_expense,
        'remaining': remaining
      }
    ), 200 
   
  except Exception as err:
    print(err)

@app.get('/total')
def total():

  try:
    year_ref = request.args.get('year_ref')
    month_ref = request.args.get('month_ref')
  
  except Exception as err:
    return jsonify(
      msg=f'Error: {err}'
    ), 400    

  total = db.session.query(extract('year', Expense.on_date).label('YEAR'), Expense.month_ref.label('MONTH'), func.sum(Expense.value).label('TOTAL')).filter(extract('year', Expense.on_date == year_ref), Expense.month_ref == MonthRef(int(month_ref))).all()

  if all(t == (None, None, None) for t in total):
    return jsonify(
      month = MonthRef(int(month_ref)).name,
      year = year_ref,
      total = 0.0
    ), 200

  # total_list = db.session.query(extract('month', Expense.on_date).label('month'), extract('year', Expense.on_date).label('year'), func.sum(Expense.value).label('total')).group_by(extract('month', Expense.on_date), extract('year', Expense.on_date)).all()

  # for i in total_list:
  #   print(i)
  return jsonify(
  #   data = [
  #     {
  #       'month': total.month,
  #       'year': total.year,
  #       'total': float(total.total)
  #     }
  #     for total in total_list
  #   ]
  # ), 200
    
        year = total[0].YEAR,
        month = total[0].MONTH.name,
        total = float(total[0].TOTAL)
      
  ), 200

@app.post('/new-transaction')
@login_required
@jwt_required(locations=['cookies'])
def new_transaction():
  try:
    data = request.get_json()
    value = data.get('value')
    month_ref = data.get('month_ref')
  
  except Exception as err:
    return jsonify(
      msg=f'Error: {err}'
    ), 400

  try:
    transaction = Transaction(
      value = value,
      month_ref = month_ref,
      user_id = current_user.id
      ) 
    db.session.add(transaction)
    db.session.commit()
  
    return jsonify(
      msg=f'Success: transaction created'
    ), 200
  
  except Exception as err:
    return jsonify(
      msg=f'Error: {err}'
    ), 400

@app.get('/transactions')
@login_required
@jwt_required()
def transactions():
  
  now = datetime.now()

  start_date = datetime(now.year, now.month, 1)
  end_date = datetime(now.year, now.month, 15)
  try:
    # transactions_list = db.session.query(Transaction).where(Transaction.on_date.between(start_date, end_date))
    transactions_list = db.session.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.on_date).all()
  except Exception as err:
    print(err)
  
  return jsonify(
    data = [
      {
        'id': transaction.id,
        'value': transaction.value,
        'on_date': transaction.on_date,
        'user_id': transaction.user_id
      }
      for transaction in transactions_list
    ]
  ), 200

@app.get('/transactions/<int:id>')
@login_required
@jwt_required()
def transactions_by_user(id):
  transactions_list = db.session.execute(db.select(Transaction).where(Transaction.user_id == id)).all()  
  return jsonify(
    data = [
      {
        'id': transaction[0].id,
        'value': transaction[0].value,
        'on_date': transaction[0].on_date,
        'user_id': transaction[0].user_id
      } 
    for transaction in transactions_list]
  ), 200

@app.post('/new-category')
@login_required
@jwt_required()
def new_category():
  try:
    data = request.get_json()
    name = data.get('name')
  
  except Exception as err:
    return jsonify(
      msg=f'Error: {err}'
    ), 400 

  try:
    category = ExpenseCategory(
      name = name
    )
    db.session.add(category)
    db.session.commit()

    return jsonify(
      msg = "Success: category created"
    ), 200
  
  except Exception as err:
    return jsonify(
      msg = f'Error: {err}'
    ), 400

@app.get('/categories')
@login_required
@jwt_required()
def categories():
  categories_list = db.session.execute(db.select(ExpenseCategory)).all()

  return jsonify(
    data = [
      {
        'id': category[0].id,
        'name': category[0].name
      }
      for category in categories_list
    ]
  ), 200
   
@app.post('/new-expense')
@login_required
@jwt_required()
def new_expense():
  try:
    data = request.get_json()
    description = data.get('description', None)
    value = data.get('value')
    category_id = data.get('category_id')
    month_ref = data.get('month_ref')
  
  except Exception as err:
    return jsonify(
      msg = f'Error: {err}'
    )
  try:  
    expense = Expense(
      description = description,
      value = value,
      expense_category_id = category_id,
      month_ref = MonthRef(int(month_ref)),
      user_id = current_user.id
    )
    db.session.add(expense)
    db.session.commit()

    return jsonify(
      msg = "Success: expense created"
    ), 200

  except Exception as err:
    return jsonify(
      msg = f'Error: {err}'
    )

@app.get('/expense')
@login_required
@jwt_required()
def expense():
  now = datetime.now()

  start_date = datetime(now.year, now.month, 1)
  end_date = datetime(now.year, now.month, 15)
  
  expense_list = db.session.query(Expense, ExpenseCategory, User).join(ExpenseCategory).join(User).order_by(desc(Expense.on_date)).all()

  return jsonify(
    data = [
      {
        'id': expense.id,
        'category': category.name,
        'name': user.name,
        'description': expense.description,
        'value': float(expense.value),
        'on_date': expense.on_date,
      }
      for expense, category, user in expense_list
    ]
  ), 200

@app.post('/test')
@jwt_required()
def test():
  return jsonify(
    jwt = get_jwt(),
    csrf = get_csrf_token()
  )

@app.get('/eee/<int:month>')
def eee(month):
  monthh = MonthRef(month)
  print("mont s>>> ", monthh)
  return jsonify(msg='ok'),200
# ------------------Commands-----------------------------
@app.cli.command("create-user", help="Create a new user")
@click.option('--name', type=str)
@click.option('--password', type=str)
def create_user(name, password):
  try:
    user = User(
      name = name,
      password = gen_pw(password),
      role = Role.ADMIN
    )
    db.session.add(user)
    db.session.commit()
  
    print("\033[32m[Success]\033[0m: Saved in database")
  except Exception as err:
    print(f'\033[31m[Error]\033[0m: {err}')
  
@app.cli.command("create-database", help="Create a database in the first time.")
@with_appcontext
def create_database():
    try:
      db.create_all()
      print("\033[32m[Success]\033[0m: Database created")
    except Exception as err:
      print(f'\033[31m[Error]\033[0m: {err}')
