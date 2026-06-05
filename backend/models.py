from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime
from sqlalchemy.sql import func

from database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric, nullable=False)
    category = Column(String)
    description = Column(String)
    expense_date = Column(Date)
    image_path = Column(String)
    source = Column(String)
    created_at = Column(DateTime, server_default=func.now())