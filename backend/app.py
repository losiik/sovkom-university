from models import User, Role, db, Course, OrderCourse
from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sovkom.db'
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

        return {'success': True, 'access_token': access_token, 'first_name': first_name}, 200
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
        return {'access_token': access_token, 'role_id': user.role_id, 'first_name': user.first_name}
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

    user_id = user.id
    name = data['name']
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
    except IntegrityError as ex:
        db.session.rollback()
        print(ex)
        return {'success': False, "EX": str(ex)}, 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9000)
