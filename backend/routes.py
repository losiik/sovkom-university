from models import User, Role, db
from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from app import app

api = Api(app)


class UserRegistration(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')
        args = parser.parse_args()

        first_name = args['first_name']
        last_name = args['last_name']
        password = args['password']
        email = args['email']
        phone_number = args['phone_number']

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
            return {'success': True}, 200
        except IntegrityError:
            db.session.rollback()
            return {'success': False}, 400


class UserLogin(Resource):
    def post(self):
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


# class ProjectCreation(Resource):
#     @jwt_required()
#     def post(self):
#         parser = reqparse.RequestParser()
#         parser.add_argument('name', type=str, required=True, help='Project name is required')
#         args = parser.parse_args()
#         project_name = args['name']
#         current_user = get_jwt_identity()
#
#         user = User.query.filter_by(username=current_user).first()
#         if user:
#             project = Project(name=project_name)
#             db.session.add(project)
#             db.session.commit()
#             related_project_user = UsersProjects(user_id=user.id, project_id=project.id)
#             db.session.add(related_project_user)
#             db.session.commit()
#             return {'message': 'Project created successfully'}, 201
#
#
# class InvitationLinkCreation(Resource):
#     @jwt_required()
#     def post(self):
#         parser = reqparse.RequestParser()
#         parser.add_argument('project_id', type=int, required=True, help='Project ID is required')
#         args = parser.parse_args()
#         project_id = args['project_id']
#
#         current_user = get_jwt_identity()
#         user = User.query.filter_by(username=current_user).first()
#
#         if user:
#             project = Project.query.filter_by(id=project_id).first()
#             if not project:
#                 return {'message': 'Invalid project ID or project does not belong to the user'}, 400
#
#             link_hash = generate_link(user_id=user.id, project_id=project.id)
#             link = f'http://localhost:5000/add_project/?invetation={link_hash}'  # Генерация уникальной пригласительной ссылки
#             invitation_link = InvitationLink(link=link_hash, is_used=False, user_id=user.id, project_id=project.id)
#             db.session.add(invitation_link)
#             db.session.commit()
#             return {'invitation_link': link}
#
#
# class AddProjectFromLink(Resource):
#     @jwt_required()
#     def get(self):
#         invetation = request.args.get('invetation')
#         invitation_link = InvitationLink.query.filter_by(link=invetation).first()
#
#         if not invitation_link:
#             return {'message': 'Link is used or invalid'}, 400
#         current_user = get_jwt_identity()
#
#         if invitation_link.is_used:
#             return {'message': 'Link has already been used'}, 200
#
#         if not current_user:
#             return {'message': 'User is not logged in'}, 401
#
#         user = User.query.filter_by(username=current_user).first()
#         if not user:
#             return {'message': 'User does not exist'}, 404
#
#         invitation_link.is_used = True
#         db.session.commit()
#         related_project_user = UsersProjects(user_id=user.id, project_id=invitation_link.project_id)
#         db.session.add(related_project_user)
#         db.session.commit()
#         return {'message': 'Project added to user'}


api.add_resource(UserRegistration, '/registration')
api.add_resource(UserLogin, '/login')
# api.add_resource(ProjectCreation, '/create_project')
# api.add_resource(InvitationLinkCreation, '/create_link')
# api.add_resource(AddProjectFromLink, '/add_project/')
