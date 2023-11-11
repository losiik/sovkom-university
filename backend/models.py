import uuid

from flask import Flask
from sqlalchemy.dialects.postgresql import UUID
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sovkom.db' #"postgresql+psycopg2://postgres:admin123@localhost:5435/sovkom"
app.config['JWT_SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone_number = db.Column(db.String(100), nullable=True)
    role_id = db.Column(db.String, db.ForeignKey('role.id'), nullable=False)


class Role(db.Model):
    #id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id = db.Column(db.String, primary_key=True)
    role = db.Column(db.String, unique=True, nullable=False)


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=False)
    slug = db.Column(db.String, nullable=True)


class OrderCourse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String, nullable=False)
    director = db.Column(db.String, nullable=False)
    name_of_the_division = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    work_experience = db.Column(db.String, nullable=False)
    personal_achievements = db.Column(db.String, nullable=False)
    motivation_letter = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)


class StudentCourses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    role1 = Role(id='642b6836-51f6-4ace-8e1e-8ff7b47e5719', role='абитуриент')
    role2 = Role(id='78c2d488-d982-4e5b-a4ef-d105f67e6935', role='студент')
    role3 = Role(id='2b618d72-cd4e-4f90-81d2-293599e50e5e', role='куратор')
    role4 = Role(id='abfa64e6-78c7-40de-ab54-bb442554b117', role='преподаватель')
    db.session.add_all(
        [role1, role2, role3, role4])
    db.session.commit()
