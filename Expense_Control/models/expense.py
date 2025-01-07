from .db import *
from sqlalchemy import Integer, String, DECIMAL, DATETIME, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from datetime import datetime
from .months import MonthRef

class ExpenseCategory(db.Model):
  id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
  name: Mapped[str] = mapped_column(String(15), nullable=False)

  expenses: Mapped[list['Expense']] = relationship(back_populates='expense_category')
   
class Expense(db.Model):
  id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
  description: Mapped[str] = mapped_column(String(200), nullable=True)
  value: Mapped[float] = mapped_column(DECIMAL(10,20), nullable=False)
  on_date: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
  month_ref: Mapped[int] = mapped_column(Enum(MonthRef), nullable=True)

  user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
  user: Mapped['User'] = relationship(back_populates='expenses')

  expense_category_id: Mapped[int] = mapped_column(ForeignKey('expense_category.id'), nullable=False)
  expense_category: Mapped['ExpenseCategory'] = relationship(back_populates='expenses')
