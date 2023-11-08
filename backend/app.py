from models import User, Role, db
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
#jwt = JWTManager(app)

db.init_app(app)

api = Api(app)


@app.route('/registration', methods=['POST'])
@cross_origin()
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

        return {'success': True, 'access_token': access_token}, 200
    except IntegrityError:
        db.session.rollback()
        return {'success': False}, 400


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True, help='Email is required')
    parser.add_argument('password', type=str, required=True, help='Password is required')
    args = parser.parse_args()

    password = args['password']
    email = args['email']

    user = User.query.filter_by(email=email, password=password).first()
    if user:
        access_token = create_access_token(identity=email)
        return {'access_token': access_token, 'role_id': user.role_id}
    return {'message': 'Invalid credentials'}, 401


@app.route('/')
def hello_world():
    return 'Moe Flask приложение в контейнере Docker.'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9000)
