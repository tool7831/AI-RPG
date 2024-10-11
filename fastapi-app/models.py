from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base
import json


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    
    user_data = relationship("UserData", back_populates="user", uselist=False)  # One-to-one relationship
    
class UserData(Base):
    __tablename__ = 'user_data'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    _json_data = Column('json_data', Text, nullable=True)  # Store the JSON data as TEXT
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to the User table
    user = relationship("User", back_populates="user_data")

    # Property to get/set JSON data
    @property
    def json_data(self):
        return json.loads(self._json_data) if self._json_data else {}

    @json_data.setter
    def json_data(self, value):
        self._json_data = json.dumps(value)