from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    id_school_class: Mapped[int] = mapped_column(ForeignKey('school_classes.id'), nullable=True)
    role: Mapped[str] = mapped_column(String(255), default='USER')
    email: Mapped[str] = mapped_column(String(255))
    password: Mapped[str] = mapped_column(String(255))

    order: Mapped["Order"] = relationship("Order", back_populates="user")
    school_class: Mapped["SchoolClass"] = relationship("SchoolClass", back_populates="user")

class SchoolClass(Base):
    __tablename__ = 'school_classes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="school_class")