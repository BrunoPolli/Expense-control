from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

from .user import User, Role
from .transaction import Transaction
from .expense import Expense, ExpenseCategory, MonthRef