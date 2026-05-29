from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Receipt(Base):

    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String)
    date = Column(String)
    time = Column(String)
    total_amount = Column(String)
    tax = Column(String)

    items = relationship("ReceiptItem", back_populates="receipt")


class ReceiptItem(Base):

    __tablename__ = "receipt_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(String)

    receipt_id = Column(Integer, ForeignKey("receipts.id"))

    receipt = relationship("Receipt", back_populates="items")