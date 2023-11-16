import os
from dotenv import load_dotenv
load_dotenv()

DB_POSTGRES_DBNAME = os.getenv("DB_POSTGRES_DBNAME")
DB_POSTGRES_USERNAME = os.getenv("DB_POSTGRES_USERNAME")
DB_POSTGRES_PASSWORD = os.getenv("DB_POSTGRES_PASSWORD")
DB_POSTGRES_HOST = os.getenv("DB_POSTGRES_HOST")
DB_POSTGRES_PORT = os.getenv("DB_POSTGRES_PORT")

from models import (User, Role, db, Course, OrderCourse, StudentCourses, Test, UserTests,
                    EducationalMaterials, StudentsEducationalMaterials, HomeWork, StudentsHomeWork,
                    TutorsCourses, Group, TutorsGroup)
from flask import Flask, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{DB_POSTGRES_USERNAME}:{DB_POSTGRES_PASSWORD}@{DB_POSTGRES_HOST}:{DB_POSTGRES_PORT}/{DB_POSTGRES_DBNAME}"
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
jwt = JWTManager(app)

db.init_app(app)


@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()

    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')
    email = data.get('email')
    phone_number = data.get('phone_number')

    role = Role.query.filter_by(role='абитуриент').first()

    try:
        user = User(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            role_id=role.id
        )
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=email)

        return {
                'success': True,
                'access_token': access_token,
                'first_name': first_name,
                'role_id': role.id
            }, 200

    except IntegrityError:
        db.session.rollback()
        return {'success': False}, 400


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    password = data.get('password')
    email = data.get('email')

    user = User.query.filter_by(email=email, password=password).first()
    if user:
        access_token = create_access_token(identity=email)

        return {
                'access_token': access_token,
                'role_id': user.role_id,
                'first_name': user.first_name
            }, 200
    return {'message': 'Invalid credentials'}, 401


@app.route('/get_all_courses', methods=['GET'])
def get_all_courses():
    courses = Course.query.all()

    response = []

    for course in courses:
        response.append({"id": course.id, "name": course.name, "description": course.description})

    return {"courses": response}, 200


@app.route('/order_course', methods=['POST'])
@jwt_required()
def order_course():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    data = request.get_json()
    print(type(data))

    user_id = user.id
    name = data['name']
    course_name = data['course_name']
    director = data['director']
    name_of_the_division = data['name_of_the_division']
    position = data['position']
    work_experience = data['work_experience']
    personal_achievements = data['personal_achievements']
    motivation_letter = data['motivation_letter']
    state = data["state"]

    try:
        course = OrderCourse(
            user_id=user_id,
            name=name,
            course_name=course_name,
            director=director,
            name_of_the_division=name_of_the_division,
            position=position,
            work_experience=work_experience,
            personal_achievements=personal_achievements,
            motivation_letter=motivation_letter,
            state=state
        )
        db.session.add(course)
        db.session.commit()

        return {'success': True}, 200
    except IntegrityError:
        db.session.rollback()
        return {'success': False}, 400


@app.route('/my_orders', methods=['GET'])
@jwt_required()
def get_my_order_courses():
    response = []

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    orders = OrderCourse.query.filter_by(user_id=user.id).all()

    for order in orders:
        response.append(
            {
                "id": order.id,
                "name": order.course_name,
                "state": order.state
            }
        )

    return {"orders": response}, 200


@app.route('/student_courses', methods=['GET'])
@jwt_required()
def student_courses():
    response = []

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    courses = Course.query.join(StudentCourses).filter(StudentCourses.user_id == user.id).all()

    for course in courses:
        response.append(
            {
                "id": course.id,
                "name": course.name,
                "slug": course.slug
            }
        )

    return {'student_courses': response}, 200


@app.route('/header', methods=['GET'])
@jwt_required()
def get_header_info():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    return (
        {
            "user_name": user.first_name,
            "role_id": user.role_id
        }
    ), 200


@app.route('/course_info', methods=['POST'])
@jwt_required()
def get_course_info():
    response = {}
    data = request.get_json()
    course_id = data["course_id"]
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    tests = Test.query.join(UserTests).filter(UserTests.user_id == user.id, Test.course_id == course_id).all()

    response["tests"] = []
    for test in tests:
        response["tests"].append(
            {
                "id": test.id,
                "test_name": test.name,
                "slug": test.slug
            }
        )

    ed_materials = (EducationalMaterials.query.join(StudentsEducationalMaterials)
                             .filter(StudentsEducationalMaterials.user_id == user.id,
                                     EducationalMaterials.course_id == course_id).all())
    response["educational_materials"] = []

    for ed_material in ed_materials:
        response["educational_materials"].append(
            {
                "id": ed_material.id,
                "educational_materials_name": ed_material.name,
                "slug": ed_material.slug
            }
        )

    home_works = HomeWork.query.join(StudentsHomeWork).filter(StudentsHomeWork.user_id == user.id,
                                     HomeWork.course_id == course_id).all()
    response["home_works"] = []

    for home_work in home_works:
        response["home_works"].append(
            {
                "id": home_work.id,
                "home_works_name": home_work.name,
                "slug": home_work.slug
            }
        )

    return response, 200


@app.route('/whore_tutor_info', methods=['GET'])
@jwt_required()
def tutor_info():
    response = {}

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    tutor_courses = Course.query.join(TutorsCourses).filter(TutorsCourses.tutor_id == user.id).all()
    response["tutor_courses"] = []

    for tutor_course in tutor_courses:
        response["tutor_courses"].append(
            {
                "id": tutor_course.id,
                "name": tutor_course.name,
                "description": tutor_course.description,
                "slug": tutor_course.slug
            }
        )

    tutor_groups = Group.query.join(TutorsGroup).filter(TutorsGroup.tutor_id == user.id).all()
    response["tutor_groups"] = []

    for tutor_group in tutor_groups:
        response["tutor_groups"].append(
            {
                "id": tutor_group.id,
                "name": tutor_group.name
            }
        )

    return response, 200


@app.route('/whore_mentor_info', methods=['GET'])
@jwt_required()
def mentor_info():
    response = {}

    all_orders = db.session.query(OrderCourse, User).join(User, User.id == OrderCourse.user_id)

    response['orders'] = []

    for order, user in all_orders:
        response['orders'].append(
            {
                'state': order.state,
                'full_name': user.first_name,
                'id': order.id
            }
        )

    all_courses = Course.query.all()

    response['courses'] = []

    for course in all_courses:
        response['courses'].append(
            {
                'name': course.name,
                'id': course.id
            }
        )

    all_groups = Group.query.all()

    response['groups'] = []

    for group in all_groups:
        response['groups'].append(
            {
                'name': group.name,
                'id': group.id
            }
        )

    return response, 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9000)
