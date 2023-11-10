import os

from app.project import bp

from flask import jsonify, request
from flask_login import current_user, login_required
from app import db
from app.models import (Project, Report, Marketplace, Marketplace_field, Project_report, Marketplace_report,
                        YandexOAuth, User_project, InvitationLink, EmailSenderSettings, User_rights)
from app.utils.wb.wb_stats import WBStatsClient as wb_stat
from sqlalchemy import or_, func
from app.utils.functions import response_message
import json
from .gen_personal_link import generate_link
from .send_mail import SendMail


@bp.route('/add_project', methods=['POST'])
@login_required
async def add_project():
    api_keys = request.json.get('api_keys') if request.json.get('api_keys') is not None else {}
    """
    :param: json name : str
    :param: json marketplace_id : int
    :param: json api_keys : dict {
                    "token_name" : "token"
                }
    """

    name = request.json.get('name')
    if not name:
        return response_message('There is no `name` field in request', 400)

    marketplace_id = request.json.get('marketplace_id')
    if not marketplace_id:
        return response_message('There is no `marketplace_id` field in request', 400)

    if len(api_keys) > 0:
        sql = db.select(func.count(Project.keys))
        keys_filter = []
        for k_name, key in api_keys.items():
            k = key.strip()
            if len(k) > 0:
                keys_filter.append(Project.keys[k_name].astext == key)

        if len(keys_filter) == 0:
            return response_message('Keys in api_keys is empty', 400)

        sql = sql.filter(or_(*keys_filter))

        if db.session.execute(sql).scalar_one() > 0:
            return response_message('wb account with this api_keys already exist', 409)

    project = Project(name=name, company_id=1,
                      marketplace_id=marketplace_id, keys=api_keys)

    db.session.add(project)
    db.session.commit()

    role = User_rights.query.filter_by(role='admin').first()

    user_project = User_project(user_id=current_user.id, project_id=project.id, role_id=role.id)
    db.session.add(user_project)
    db.session.commit()

    mp_report = db.session.execute(db.select(Marketplace_report).filter(Marketplace_report.marketplace_id == marketplace_id)).all()
    if mp_report is not None:
        for report in mp_report:
            report = report.Marketplace_report
            db.session.add(Project_report(name=report.name, project_id=project.id, type=report.type, favorite=report.favorite, show=report.show))

    db.session.commit()

    return response_message('Project connected successfully', 200)


@bp.route('/<project_id>/update_project', methods=['POST'])
@login_required
async def update_project(project_id):
    api_keys = request.json.get('api_keys')
    """
    :param: json name : str
    :param: json api_keys : dict {
                    "token_name" : "token"
                }
    """

    if Project.query.filter(Project.id == project_id).first() is None:
        return response_message('There are no projects with this id!', 404)

    if not api_keys:
        return response_message('There are no api_keys key in request!', 400)

    sql = db.select(func.count(Project.keys)).join(User_project).filter(User_project.user_id == current_user.id, Project.id != project_id)
    keys_filter = []
    for k_name, key in api_keys.items():
        keys_filter.append(Project.keys[k_name].astext == key)

    if len(keys_filter) < 0:
        return response_message('There are no keys in api_keys', 400)

    sql = sql.filter(or_(*keys_filter))

    if db.session.execute(sql).scalar_one() > 0:
        return response_message('another wb account with this api_keys already exist', 409)

    sql = db.update(Project).where(Project.id == project_id).values(name=request.json.get('name'), keys=request.json.get('api_keys'))
    db.session.execute(sql)
    db.session.commit()

    return response_message('wb account updated successfully', 200)



@bp.route('/get_projects', methods=['GET'])
@login_required
async def get_projects():
    result = {}

    projects = db.session.query(Project).join(User_project).filter(User_project.user_id == current_user.id).all()

    for project in projects:
        print(project.marketplace.name)
        if project.marketplace.name not in result.keys():
            result[project.marketplace.name] = {
                'id': project.marketplace_id,
                'projects': []
            }
        result[project.marketplace.name]['projects'].append({
            'id': project.id,
            'name': project.name,
            'keys': project.keys
        })

    return jsonify(result)


@bp.route('/<project_id>', methods=['GET'])
@login_required
async def get_project(project_id):
    """

    :param project_id:
    :return: json
    """
    result = {}

    project = db.session.query(Project).join(User_project).filter(User_project.user_id == current_user.id, Project.id == project_id).first()

    if project is None:
        return jsonify({
            'error': 'There is no project with id '+project_id
        })

    settings = {

    }
    if project.marketplace.name == 'avito':
        sql = db.select(YandexOAuth.email, YandexOAuth.folder).where(YandexOAuth.project_id == project.id)
        ysettings = db.session.execute(sql).first()
        if ysettings is not None:
            settings['yemail'] = ysettings.email
            settings['yfolder'] = ysettings.folder

    return jsonify({
        'id': project.id,
        'name': project.name,
        'keys': project.keys,
        'marketplace': project.marketplace.name,
        'settings': settings
    })


@bp.route('/get_project_form_data', methods=['GET'])
@login_required
async def get_project_form_data():
    result = {}

    fields = db.session.query(Marketplace_field).all()

    for field in fields:
        if field.marketplace.name not in result.keys():
            result[field.marketplace.name] = {
                'id': field.marketplace_id,
                # 'name': field.marketplace.name,
                'full_name': field.marketplace.full_name,
                'fields': []
            }
        result[field.marketplace.name]['fields'].append({
            'name': field.name,
            'placeholder': field.placeholder
        })

    return jsonify(result)


# Todo: Сделать метод запроса GET

@bp.route('/<project_id>/get_reports', methods=['GET'])
@login_required
async def get_reports(project_id):
    user_project = User_project.query.filter_by(project_id=project_id, user_id=current_user.id).first()
    role_id = user_project.role_id
    role = User_rights.query.filter_by(id=role_id).first()
    # TODO: Поправить запросы.
    subquery1 = db.select(Project.marketplace_id).join(User_project).filter(User_project.user_id == current_user.id, Project.id == project_id).subquery()
    subquery2 = db.select(Marketplace.name).filter(Marketplace.id == subquery1).subquery()
    select = db.select(Project_report.id, Project_report.name, Project_report.favorite.label('favorite'),
                       Project_report.show.label('show'), Project.name.label('project_name'), subquery2) \
        .join(Project, Project_report.project_id == Project.id) \
        .filter(User_project.user_id == current_user.id, Project.id == project_id)
    reports = db.session.execute(select).all()

    result = []
    for report in reports:
        if role.role == 'manager' and (report[1] == 'Отчет о продажах по реализации' or report[1] == 'Продажи'):
            continue
        result.append({
            'id': report[0],
            'report_name': report[1],
            'favorite': report[2],
            'show': report[3],
            'project_name': report[4],
            'marketplace_name': report[5],
        })

    return jsonify(result)


@bp.route('/<project_id>/add_favorite_report/<report_id>', methods=['GET'])
@login_required
def add_favorite_report(project_id, report_id):
    project = Project.query.filter(Project.user_id == current_user.id, Project.id == project_id).first()
    if project is None:
        return response_message('There are no project with this project_id.', 409)

    report = Project_report.query.filter(Project_report.project_id == project_id, Project_report.id == report_id).first()
    if report is None:
        return response_message('There are no report with this report_id.', 409)

    if report.favorite == 1:
        return response_message('Report already favorite.', 400)

    report.add_favorite()

    return response_message('Report added to favorite successfully', 200)

@bp.route('/<project_id>/remove_favorite_report/<report_id>', methods=['GET'])
@login_required
def remove_favorite_report(project_id, report_id):
    project = Project.query.join(User_project).filter(User_project.user_id == current_user.id, Project.id == project_id).first()
    if project is None:
        return response_message('There are no project with this project_id.', 409)

    report = Project_report.query.filter(Project_report.project_id == project_id, Project_report.id == report_id).first()
    if report is None:
        return response_message('There are no report with this report_id.', 409)

    if report.favorite == 0:
        return response_message('Report still not favorite.', 400)

    report.remove_favorite()

    return response_message('Report removed from favorite successfully', 200)

@bp.route('/<project_id>/get_favorite_reports', methods=['GET'])
@login_required
def get_favorite_reports(project_id):
    # Project.user_id == current_user.id ?????
    favorite = Project_report.query.filter(Project_report.project_id == project_id, Project_report.favorite == 1).all()
    if favorite is None:
        return response_message('There are no project with this project_id.', 409)

    return jsonify(favorite), 200


@bp.route('/<project_id>/get_report/<report_id>', methods=['POST'])
@login_required
async def get_report(project_id, report_id):
    """

    :param project_id:
    :param report_id:
    :param json params:{
                    date_from: str : 2020-09-09
                    date_to: str : 2020-09-09
                }:
    :param report_id:
    :return json (report from mp) :
    """
    # project_report = Project.query.filter(Project.id == project_id).join(Project_report).filter(Project_report.id == report_id).all()
    sql = db.select(Project.keys, Project_report, Marketplace)\
        .join(Project_report, Project.id == Project_report.project_id)\
        .join(Marketplace, Marketplace.id == Project.marketplace_id) \
        .join(User_project, User_project.user_id == current_user.id) \
        .where(User_project.user_id == current_user.id)\
        .where(Project.id == project_id)\
        .where(Project_report.id == report_id)
    project_report = db.session.execute(sql).first()
    if project_report is None:
        return response_message('There are no project with this project_id.', 409)

    mps = {
        'WB': wb_stat
    }

    report_type = project_report.Project_report.type.split('_')
    report_type = (report_type[0]+report_type[1]) if len(report_type) > 1 else report_type[0]

    headers_json = load_json_api()
    headers_json = headers_json['components']['schemas'][report_type+'Item']['properties']

    params = request.json

    mp = mps[project_report.Marketplace.name.upper()](project_report.keys['stat_token'])
    report = await mp.__getattribute__(project_report.Project_report.type.lower())(**params)

    if 'error' in report:
        return response_message(report['error'], 400)

    cols_names = []
    for k in report[0].keys():
        cols_names.append({
            'field': k,
            'headerName': headers_json[k]['description'].split('.')[0]
        })

    return jsonify({
        'column_names': cols_names,
        'data': report
    })

def load_json_api():
    with open(r'/app/wb_openapi.json', 'r') as f:
        return json.loads(f.read())


@bp.route('/<project_id>/create_link', methods=['POST'])
#@login_required
async def create_link(project_id):
    data = request.get_json()
    email = data.get('email')
    role = data.get('role')
    print(email, role)
    project_info = User_project.query.filter_by(project_id=project_id).first()
    if not project_info:
        return response_message('Invalid project ID or project does not belong to the user', 400)

    link_hash = generate_link(user_id=project_info.user_id, project_id=project_info.project_id)

    role_data = User_rights.query.filter_by(role=role).first()
    if not role_data:
        return response_message('This role does not exist', 400)

    link = f'http://localhost/api/project/connect_project/?invitation={link_hash}'
    invitation_link = InvitationLink(link=link_hash,
                                     is_used=False,
                                     user_id=project_info.user_id,
                                     project_id=project_info.project_id,
                                     role_id=role_data.id)
    db.session.add(invitation_link)
    db.session.commit()

    email_info = EmailSenderSettings.query.all()[0]
    email_sender = SendMail(host=email_info.host,
                         port=email_info.port,
                         email_address_from=email_info.email,
                         email_password=email_info.password,
                         email_address_to=email,
                         message=f"Вас пригласили в проект, перейдите для этого по ссылке {link}",
                         subject="Приглашение в EcomVue")

    return response_message(email_sender.send_email(), 200)


@bp.route('/connect_project/', methods=['GET'])
@login_required
async def add_from_link():
    invitation = request.args.get('invitation')
    invitation_link = InvitationLink.query.filter_by(link=invitation).first()

    if not invitation_link:
        return response_message('Link is invalid', 400)

    if invitation_link.is_used:
        return response_message('Link has already been used', 400)

    if not current_user:
        return response_message('User is not logged in', 401)

    invitation_link.is_used = True
    db.session.commit()
    related_project_user = User_project(user_id=current_user.id,
                                        project_id=invitation_link.project_id,
                                        role_id=invitation_link.role_id)
    db.session.add(related_project_user)
    db.session.commit()
    return response_message('Project added to user', 200)
