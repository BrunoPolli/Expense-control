from .db import *
from sqlalchemy import Integer, String, DECIMAL, DATETIME, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from datetime import datetime
from flask_login import UserMixin, login_manager

class Role(enum.Enum):
  ADMIN = 'admin'
  USER = 'user'

class User(db.Model, UserMixin):
  id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
  name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
  password: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
  role: Mapped[str] = mapped_column(Enum(Role), nullable=False)
  transactions: Mapped[list['Transaction']] = relationship(back_populates="user")
  expenses: Mapped[list['Expense']] = relationship(back_populates="user")

