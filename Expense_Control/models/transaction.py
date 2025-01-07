from .db import *
from sqlalchemy import Integer, String, DECIMAL, DATETIME, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from datetime import datetime
from .months import MonthRef

class Transaction(db.Model):
  id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
  value: Mapped[float] = mapped_column(DECIMAL(10,2), nullable=False)
  on_date: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)
  month_ref: Mapped[int] = mapped_column(Enum(MonthRef), nullable=True)

  user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
  user: Mapped['User'] = relationship(back_populates="transactions")