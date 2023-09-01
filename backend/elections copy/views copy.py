import json
from django.shortcuts import render

# from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

# Create your views here.
from django.http.response import JsonResponse
from rest_framework.decorators import api_view

import hashlib
import os
import base64
import random
import string
import datetime

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.serializers import serialize
from django.views.static import serve
from django.http import FileResponse
from django.db import connection
from datetime import date

from rest_framework.response import Response


from .serializers import *
from .models import *

SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16


@api_view(['POST'])
def upLoadImage(request):
    if request.method == 'POST':
        image = request.FILES.get('image')
        print("req",request.FILES)
        print("image",image)
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(20))
        print("1 "*10)
        if image:
            print("2 "*10)
            print(settings.MEDIA_ROOT)
            with open(os.path.join(settings.MEDIA_ROOT, result_str + image.name), 'wb+') as destination:
                print('3 ' *10)
                for chunk in image.chunks():
                    print("4 "*10)
                    destination.write(chunk)
                    print("url",result_str + image.name)
            return JsonResponse({'success': True, 'url': result_str + image.name})
    return JsonResponse({'success': False})


@api_view(['GET'])
def getallUser(request):
    users = TbUsers.objects.all()
    serializer = userSerializer(users, many=True)
    return JsonResponse({"data":serializer.data,"code":200},safe=False)



@api_view(['GET'])
def getImage(request):
    queryprms = request.GET
    img = request.GET.get('imagePath','')
    print("abcd ",img)
    print("____",queryprms)
   
    print('='*10)
 

    
    path = queryprms.get('images', img)
    if path == '':
        print('NUL'*10)
    else:
        print('not NULL'*10)
        print("11",path)
    if type(img) == str:
        image_path = os.path.join(settings.MEDIA_ROOT, path)
    else:
        image_path = os.path.join(settings.MEDIA_ROOT, 'path')


    print('image path : ', image_path)
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(open(image_path, "rb").read())
    return JsonResponse({'data': encoded_string.decode("utf-8")})


@api_view(['GET'])
def getMenu(request):
    menus = TbMenu.objects.all()
    menus_serializer = menuSerializer(menus, many=True)
    return JsonResponse({"data": menus_serializer.data}, safe=False)


@api_view(['POST'])
def addMenu(request):
    data = json.loads(request.body)
    data_data = TbMenu(name=data["name"], url=data["url"],
                       parentid=data["parentId"], del_flag=0)
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)


@api_view(['PUT'])
def updateMenu(request):
    data = json.loads(request.body)
    menu_id = data.get("id")
    if not menu_id:
        return JsonResponse({"error": "Menu ID not provided."}, status=400)
    try:
        menu = TbMenu.objects.get(id=menu_id)
    except TbMenu.DoesNotExist:
        return JsonResponse({"error": "Menu not found."}, status=404)
    menu.name = data.get("name", menu.name)
    menu.parentid = data.get("parentId", menu.parentid)
    menu.url = data.get("url", menu.url)
    # menu.parent = data.get("parent", menu.parent)
    menu.save()
    return JsonResponse({"code": 200}, safe=False)

@api_view(['GET'])
def delMenu(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    TbMenu.objects.filter(id=id).delete()
    menus = TbMenu.objects.all()
    menus_serializer = menuSerializer(menus, many=True)
    return JsonResponse({"data": menus_serializer.data}, safe=False)


# @api_view(['GET'])
# def getElection(request):
#     queryprms = request.GET
#     print('error1')
#     limit = int(queryprms.get('limit', 5))
#     print('error2')
#     keyword = queryprms.get('keyword', "root")
#     print('error3')
#     pagenum = int(queryprms.get('pagenum', 1))
#     print('error4')
#     filter = queryprms.get('filter', "id")
#     print('error5')
#     sorter = queryprms.get('sorter', "asc")
#     print('error6')
#     election_data = TbElections.objects.raw(
#         f'''select * from tb_elections where title like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     print('error7')
#     election_serializer = electionSerializer(election_data, many=True)
#     election_count = TbElections.objects.raw(
#         '''select id, count(*) as count from tb_elections where del_flag = 0 and title like "{keyword}"''')
#     print('error8')
#     return JsonResponse({"data": election_serializer.data, "count": election_count[0].count, "code": 200}, safe=True)

@api_view(['GET'])
def getElection(request):
    queryprms = request.GET
    limit = int(queryprms.get('limit', 5))
    keyword = queryprms.get('keyword', "root")
    pagenum = int(queryprms.get('pagenum', 1))
    filter = queryprms.get('filter', "id")
    sorter = queryprms.get('sorter', "asc")

    election_data = TbElections.objects.raw(
        f'''SELECT * FROM tb_elections WHERE title LIKE '{keyword}' ORDER BY {filter} {sorter} LIMIT {limit} OFFSET {limit * (pagenum - 1)}''')

    election_serializer = electionSerializer(election_data, many=True)

    election_count = TbElections.objects.raw(
        f'''SELECT id, count(*) AS count FROM tb_elections WHERE del_flag = 0 AND title LIKE '{keyword}' GROUP BY id''')

    count = election_count[0].count if election_count else 0

    return JsonResponse({"data": election_serializer.data, "count": count, "code": 200}, safe=True)



@api_view(['GET'])
def getAllElection(request):
    data_data = TbElections.objects.all()
    data_serializer = electionSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


@api_view(['GET'])
def getPrev5Election(request):
    data_data = TbElections.objects.filter(del_flag=0, date__lt=date.today()).order_by('-date')[:5]
    data_serializer = electionSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


@api_view(['GET'])
def getUpElection(request):
    today = datetime.date.today()  # Get current date
    print(today)
    data_data = TbElections.objects.filter(del_flag=0, create_date__date__lt=today)
    data_serializer = electionSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


# @api_view(['POST'])
# def getIdUser(request):
#     data = json.loads(request.body)
#     data_data = TbUsers.objects.raw(f'''select id from tb_users where fname = "
#                                     {data["fname"]}" and lname = "{data["lname"]}" and cid = "{data["cid"]}" and username = "{data["username"]}"
#                                     ''')
#     return JsonResponse({"data": data_data[0].id, "code": 200}, safe=False)
@api_view(['POST'])
def getIdUser(request):
    data = json.loads(request.body)
    fname = data["fname"]
    lname = data["lname"]
    cid = data["cid"]
    username = data["username"]

    query = f'''
        SELECT id FROM tb_users
        WHERE fname = '{fname}'
        AND lname = '{lname}'
        AND cid = '{cid}'
        AND username = '{username}'
    '''

    data_data = TbUsers.objects.raw(query)

    return JsonResponse({"data": data_data[0].id, "code": 200}, safe=False)



# @api_view(['GET'])
# def getUserElection(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     data_data = TbUsers.objects.raw(
#         f'''select * from tb_users where del_flag = 0 and election_option = {id}''')
#     print('no data'*20)
#     data_serializer = userSerializer(data_data, many=True)
#     return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)
@api_view(['GET'])
def getUserElection(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_data = TbUsers.objects.raw(
        f'''SELECT * FROM tb_users WHERE del_flag = 0 AND election_option = '{id}' ''')
    data_serializer = userSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)



@api_view(['GET'])
def getCandidateElection(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_data = TbUsers.objects.raw(
        f'''SELECT * FROM tb_users WHERE del_flag = 0 AND rank = 2 AND election_option = '{id}' ''')
    data_serializer = userSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)



# @api_view(['GET'])
# def getCandidateElection(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     data_data = TbUsers.objects.raw(
#         'select * from tb_users where del_flag = 0 and rank = 2 and election_option = ' + "id")
#     data_serializer = userSerializer(data_data, many=True)
#     return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


@api_view(['GET'])
def getElectionId(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_data = TbElections.objects.raw(
        f'''select * from tb_elections where id ={id}''')
    data_serializer = electionSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data[0], "code": 200}, safe=False)


@api_view(['GET'])
def getUserId(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_data = TbUsers.objects.raw(f'''select * from tb_users where id = {id}''')
    data_serializer = userSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data[0], "code": 200}, safe=False)


# @api_view(['GET'])
# def getCountCandidate(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     data_count = TbUsers.objects.raw(f'''select id, count(*) as count from tb_users where del_flag = 0 and election_option = {id} and rank = (select id from tb_user_rank where name = 'candidate')''')
#     data_total = TbUsers.objects.raw(
#         f'''select id, count(*) as count from tb_users where del_flag = 0 and rank = (select id from tb_user_rank where name = 'candidate')''')
#     return JsonResponse({"data": {'count': data_count[0].count, 'total': data_total[0].count}, "code": 200}, safe=False)
@api_view(['GET'])
def getCountCandidate(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)

    subquery = f"(SELECT id FROM tb_user_rank WHERE name = 'candidate' LIMIT 1)"

    data_count = TbUsers.objects.raw(f'''
        SELECT id, count(*) AS count
        FROM tb_users
        WHERE del_flag = 0
            AND election_option = '{id}'
            AND rank = {subquery}
        GROUP BY id
    ''')

    data_total = TbUsers.objects.raw(f'''
        SELECT id, count(*) AS count
        FROM tb_users
        WHERE del_flag = 0
            AND rank = {subquery}
        GROUP BY id
    ''')

    count = data_count[0].count if data_count else 0
    total = data_total[0].count if data_total else 0

    return JsonResponse({"data": {'count': count, 'total': total}, "code": 200}, safe=False)




@api_view(['GET'])
def getUserTeamCount(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)

    cursor = connection.cursor()
    cursor.execute(f'''
        SELECT id, a.rank, b.name, a.count
        FROM (
            SELECT u.rank, COUNT(*) AS count
            FROM (
                SELECT teamuser_id
                FROM tb_team_members
                WHERE candidate_id = {id} AND del_flag = 0
            ) AS t
            JOIN (
                SELECT *
                FROM tb_users
                WHERE del_flag = 0
            ) AS u ON t.teamuser_id = u.id
            GROUP BY u.rank
        ) AS a
        JOIN (
            SELECT *
            FROM tb_user_rank
            WHERE del_flag = 0
        ) AS b ON a.rank = b.id
    ''', None)

    objs = cursor.fetchall()
    json_data = []
    for obj in objs:
        json_data.append({
            "id": obj[0],
            "rank": obj[1],
            "name": obj[2],
            "count": obj[3]
        })

    return JsonResponse({"data": json_data, "code": 200}, safe=False)



from django.db import connection

@api_view(['GET'])
def getSupervisorTeamCount(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)

    query = f'''
        SELECT id, a.rank, b.name, a.count
        FROM (
            SELECT u.rank, COUNT(*) AS count
            FROM (
                SELECT candidate_id
                FROM tb_team_members
                WHERE teamuser_id = {id} AND del_flag = 0
            ) AS t
            JOIN (
                SELECT *
                FROM tb_users
                WHERE del_flag = 0
            ) AS u
            ON t.candidate_id = u.id
            GROUP BY u.rank
        ) AS a
        JOIN (
            SELECT *
            FROM tb_user_rank
            WHERE del_flag = 0
        ) AS b
        ON a.rank = b.id
    '''

    cursor = connection.cursor()
    cursor.execute(query)
    objs = cursor.fetchall()

    json_data = []
    for obj in objs:
        json_data.append({
            "id": obj[0],
            "rank": obj[1],
            "name": obj[2],
            "count": obj[3]
        })

    return JsonResponse({"data": json_data, "code": 200}, safe=False)



# @api_view(['GET'])
# def getGuaranteesCount(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     eid = queryprms.get('eid', 1)
#     data_guarantees = TbGuarantees.objects.raw(
#         f'''select id, count(*) as count from tb_guarantees where del_flag = 0 and user_id = {id} and election_id = {id}''')
#     data_guarantees_all = TbGuarantees.objects.raw(
#         f'''select id, count(*) as count from tb_guarantees where del_flag = 0 and election_id = {id}''')
#     return JsonResponse({"data": {'all': data_guarantees_all[0].count, 'my': data_guarantees[0].count}, "code": 200}, safe=False)
@api_view(['GET'])
def getGuaranteesCount(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    eid = queryprms.get('eid', 1)
    
    data_guarantees = TbGuarantees.objects.raw(
        f'''
        SELECT id, COUNT(*) AS count
        FROM tb_guarantees
        WHERE del_flag = 0
            AND user_id = {id}
            AND election_id = {eid}
        GROUP BY id
        '''
    )
    
    data_guarantees_all = TbGuarantees.objects.raw(
        f'''
        SELECT id, COUNT(*) AS count
        FROM tb_guarantees
        WHERE del_flag = 0
            AND election_id = {eid}
        GROUP BY id
        '''
    )
    
    count_all = data_guarantees_all[0].count if data_guarantees_all else 0
    count_my = data_guarantees[0].count if data_guarantees else 0
    
    return JsonResponse({"data": {'all': count_all, 'my': count_my}, "code": 200}, safe=False)


# @api_view(['GET'])
# def getElectionCount(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     data_users = TbUsers.objects.raw(
#         f'''select id, count(*) as count from tb_users where del_flag = 0 and election_option ={id}''')
#     data_guarantees = TbGuarantees.objects.raw(
#         f'''select id, count(*) as count from tb_guarantees where del_flag = 0 and election_id ={id}''')
#     data_others = TbUsers.objects.raw(
#         f'''select id, count(*) as count from tb_users where del_flag = 0 and election_option != {id}''')
#     return JsonResponse({"data": {'users': data_users[0].count, 'guarantees': data_guarantees[0].count, 'others': data_others[0].count}, "code": 200}, safe=False)
from django.db import connection

@api_view(['GET'])
def getElectionCount(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    
    with connection.cursor() as cursor:
        cursor.execute('''
            SELECT
                (SELECT COUNT(*) FROM tb_users WHERE del_flag = 0 AND election_option = %s) AS users_count,
                (SELECT COUNT(*) FROM tb_guarantees WHERE del_flag = 0 AND election_id = %s) AS guarantees_count,
                (SELECT COUNT(*) FROM tb_users WHERE del_flag = 0 AND election_option != %s) AS others_count
        ''', [str(id), str(id), str(id)])
        
        row = cursor.fetchone()
        users_count = row[0]
        guarantees_count = row[1]
        others_count = row[2]

    return JsonResponse({"data": {'users': users_count, 'guarantees': guarantees_count, 'others': others_count}, "code": 200}, safe=False)




# @api_view(['GET'])
# def getElectionCandidate(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     data_data = TbUsers.objects.raw(f'''select * from tb_users where del_flag = 0 and election_option = {id} and rank = (select id from tb_user_rank where name = 'candidate')''')
#     data_serializer = userSerializer(data_data, many=True)
#     return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)
@api_view(['GET'])
def getElectionCandidate(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)

    data_data = TbUsers.objects.raw(f'''
        SELECT *
        FROM tb_users
        WHERE del_flag = 0
            AND election_option = '{id}'
            AND rank = (SELECT id FROM tb_user_rank WHERE name = 'candidate' LIMIT 1)
    ''')

    data_serializer = userSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)



@api_view(['GET'])
def getElectionCandidateId(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_data = TbUsers.objects.raw(f'''select * from tb_users where id = {id}''')
    data_serializer = userSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data[0], "code": 200}, safe=False)


# @api_view(['GET'])
# def delElection(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     print("error1")
#     election = TbElections.objects.raw(
#         f'''select * from tb_elections where id = {id}''')[0]
#     election.del_flag = 1
#     election.save()
#     print("=============================================================",id)
#     print(f"keyword= {keyword}, filter = {filter}, sorter = {sorter}")
#     election_data = TbElections.objects.raw(
#         f'''select * from tb_elections where title like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     election_serializer = electionSerializer(election_data, many=True)
#     election_count = TbElections.objects.raw(
#         f'''select id, count(*) as count from tb_elections where del_flag = 0 and title like "{keyword}" ''')
#     return JsonResponse({"data": election_serializer.data, "count": election_count[0].count, "code": 200}, safe=False)
@api_view(['GET'])
def delElection(request):   
    queryprms = request.GET
    id = queryprms.get('id', 1)
    limit = int(queryprms.get('limit', 5))
    keyword = queryprms.get('keyword', "")
    pagenum = int(queryprms.get('pagenum', 1))
    filter = queryprms.get('filter', "id")
    sorter = queryprms.get('sorter', "asc")

    print("error1")

    with connection.cursor() as cursor:
        cursor.execute(f'''DELETE FROM tb_elections WHERE id = {id}''')

    print("=============================================================", id)
    print(f"keyword = {keyword}, filter = {filter}, sorter = {sorter}")

    election_data = TbElections.objects.raw(f'''
        SELECT * FROM tb_elections WHERE title LIKE '{keyword}'
        ORDER BY {filter} {sorter}
        LIMIT {limit} OFFSET {limit * (pagenum - 1)}
    ''')
    election_serializer = electionSerializer(election_data, many=True)

    # election_count = TbElections.objects.raw(f'''
    #     SELECT id, count(*) AS count FROM tb_elections
    #     WHERE del_flag = 0 AND title LIKE '%{keyword}%'
    # ''')

    election_count = TbElections.objects.raw(f'''
        SELECT id, count(*) AS count FROM tb_elections
        WHERE del_flag = 0 AND title LIKE '%{keyword}%'
        GROUP BY id
    ''')

    count = election_count[0].count if election_count else 0  # Check if election_count has any rows

    return JsonResponse({"data": election_serializer.data, "count": count, "code": 200}, safe=False)



@api_view(['POST'])
def addElection(request):
    data = json.loads(request.body)
    election = TbElections(image=data["image"], title=data["title"], description=data["description"], status=data["status"],
                           date=data["date"], committees=data["committees"], type=data["type"], moderators=data["moderators"], del_flag=0)
    election.save()
    return JsonResponse({"data": "", "count": 0, "code": 200}, safe=False)


# @ api_view(['POST'])
# def updateElection(request):
#     data = json.loads(request.body)
#     election = TbElections.objects.raw(
#         'select * from tb_elections where id = ' + str(data['id']))[0]
#     election.image = data['image']
#     election.title = data['title']
#     election.description = data['description']
#     election.status = data['status']
#     election.date = data['date']
#     election.committees = data['committees']
#     election.type = data['type']
#     election.moderators = data['moderators']
#     election.save()
#     return JsonResponse({"data": "", "count": 0, "code": 200}, safe=False)


@api_view(['POST'])
def updateElection(request):
    data = json.loads(request.body)
    election_id = data['id']

    try:
        election = TbElections.objects.get(id=election_id)
    except TbElections.DoesNotExist:
        return JsonResponse({"error": "Election not found", "code": 404})

    election.image = data['image']
    election.title = data['title']
    election.description = data['description']
    election.status = data['status']
    election.date = data['date']
    election.committees = data['committees']
    election.type = data['type']
    election.moderators = data['moderators']

    election.save()

    return JsonResponse({"data": "", "count": 0, "code": 200}, safe=False)



# @api_view(['GET'])
# def getPermission(request):
#     queryprms = request.GET
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     data_data = TbPermission.objects.raw(
#         f'''select * from tb_permission where del_flag = 0 and name like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     data_serializer = permissionSerializer(data_data, many=True)
#     data_count = TbPermission.objects.raw(
#         f'''select id, count(*) as count from tb_permission where del_flag = 0 and name like "{keyword}"''')
#     data_menu = TbPermissionMenu.objects.all()
#     data_menu_serializer = permissionMenuSerializer(data_menu, many=True)
#     return JsonResponse({"data": data_serializer.data, "menu": data_menu_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

from django.db.models import Q


@api_view(['GET'])
def getPermission(request):
    queryprms = request.GET
    limit = int(queryprms.get('limit', 5))
    keyword = queryprms.get('keyword', "")
    pagenum = int(queryprms.get('pagenum', 1))
    filter_param = queryprms.get('filter', "id")
    sorter_param = queryprms.get('sorter', "asc")

    field_mapping = {
        "id": "id",
        "name": "name",
        "create_date": "create_date",
        "update_date": "update_date",
    }

    filter_field = field_mapping.get(filter_param, "id")
    sorter_field = field_mapping.get(sorter_param, "asc")

    data_data = TbPermission.objects.filter(
        Q(del_flag=0) & Q(name__icontains=keyword)
    ).order_by(f"{filter_field} {sorter_field}")[limit * (pagenum - 1):limit * pagenum]

    data_serializer = permissionSerializer(data_data, many=True)

    data_count = TbPermission.objects.filter(
        Q(del_flag=0) & Q(name__icontains=keyword)
    ).count()

    data_menu = TbPermissionMenu.objects.all()
    data_menu_serializer = permissionMenuSerializer(data_menu, many=True)

    return JsonResponse({
        "data": data_serializer.data,
        "menu": data_menu_serializer.data,
        "count": data_count,
        "code": 200
    }, safe=False)








@api_view(['GET'])
def getAllPermission(request):
    data_data = TbPermission.objects.all()
    data_serializer = permissionSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


@api_view(['POST'])
def addPermission(request):
    try:
        data = json.loads(request.body)
        name = data.get("name")
        description = data.get("description")
        # menu = data.get("menu")
        if name and description: # and menu remove
            # Create TbPermission instance
            permission = TbPermission(name=name, description=description, del_flag=0)
            permission.save()
            # Get the created permission
            permission = TbPermission.objects.get(name=name, description=description)
            data_serializer = permissionSerializer(permission, many=True)
            # Create TbPermissionMenu instances
            # permission_menus = [
            #     TbPermissionMenu(permissionid=permission.id, menuid=item['menuId'], value=item['value'], label=item['label'])
            #     for item in menu
            # 
            # TbPermissionMenu.objects.bulk_create(permission_menus)
            return JsonResponse({"data": "data_serializer", "count": 0, "code": 200})
        return JsonResponse({"error": "Invalid data provided."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# @ api_view(['POST'])
# def updatePermission(request):
#     data = json.loads(request.body)
#     # data_data = TbPermission.objects.raw(
#     #     f'''select * from tb_permission where id = {data['id']} ''')
    
#     data_data = TbPermission.objects.filter(id = f"{data['id']}")
#     print("DATA_DATA : ",data_data)

#     data_data.name = data['name']
#     data_data.description = data['description']
#     data_data.save()
#     TbPermissionMenu.objects.filter(permissionid=data['id']).delete()
#     for x in data["menu"]:
#         data_row = TbPermissionMenu(
#             permissionid=data['id'], menuid=x['menuId'], value=x['value'], label=x['label'])
#         data_row.save()
#     return JsonResponse({"data": "", "count": 0, "code": 200}, safe=False)


@api_view(['POST'])
def updatePermission(request):
    data = json.loads(request.body)
    
    try:
        permission = TbPermission.objects.get(id=data['id'])
        
        permission.name = data['name']
        permission.description = data['description']
        permission.save()
        
        TbPermissionMenu.objects.filter(permissionid=data['id']).delete()
        
        for x in data["menu"]:
            permission_menu = TbPermissionMenu(
                permissionid=data['id'],
                menuid=x['menuId'],
                value=x['value'],
                label=x['label']
            )
            permission_menu.save()
        
        return JsonResponse({"data": "", "count": 0, "code": 200}, safe=False)
    
    except TbPermission.DoesNotExist:
        return JsonResponse({"error": "Permission not found."}, status=404)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



# @api_view(['GET'])
# def delPermission(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     TbPermission.objects.filter(id=id).delete()
#     TbPermissionMenu.objects.filter(permissionid=id).delete()
#     data_data = TbPermission.objects.raw(
#         f'''select * from tb_permission where del_flag = 0 and name like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     data_serializer = permissionSerializer(data_data, many=True)
#     data_count = TbPermission.objects.raw(
#         f'''select id, count(*) as count from tb_permission WHERE del_flag = 0 and name like "{keyword}"''')
#     data_menu = TbPermissionMenu.objects.all()
#     data_menu_serializer = permissionMenuSerializer(data_menu, many=True)
#     return JsonResponse({"data": data_serializer.data, "menu": data_menu_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def delPermission(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    limit = int(queryprms.get('limit', 5))
    keyword = queryprms.get('keyword', "")
    pagenum = int(queryprms.get('pagenum', 1))
    filter_param = queryprms.get('filter', "id")
    sorter_param = queryprms.get('sorter', "asc")

    TbPermission.objects.filter(id=id).delete()
    TbPermissionMenu.objects.filter(permissionid=id).delete()

    filter_field = {
        "id": "id",
        "name": "name",
        "create_date": "create_date",
        "update_date": "update_date",
    }.get(filter_param, "id")

    sorter_field = {
        "asc": "",
        "desc": "-"
    }.get(sorter_param, "")

    permission_data = TbPermission.objects.filter(
        del_flag=0, name__icontains=keyword
    ).order_by(f"{sorter_field}{filter_field}")[limit * (pagenum - 1):limit * pagenum]
    permission_count = TbPermission.objects.filter(
        del_flag=0, name__icontains=keyword
    ).count()
    permission_menu_data = TbPermissionMenu.objects.all()

    permission_serializer = permissionSerializer(permission_data, many=True)
    permission_menu_serializer = permissionMenuSerializer(permission_menu_data, many=True)

    return JsonResponse(
        {
            "data": permission_serializer.data,
            "menu": permission_menu_serializer.data,
            "count": permission_count,
            "code": 200
        },
        safe=False
    )


# @api_view(['GET'])
# def getRole(request):
#     queryprms = request.GET
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     data_data = TbUsersRole.objects.raw(
#         f'''select * from tb_users_role WHERE del_flag = 0 and name like "%{keyword}%" order_by  {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     data_serializer = roleSerializer(data_data, many=True)
#     data_count = TbUsersRole.objects.raw(
#         f'''select id, count(*) as count from tb_users_role WHERE del_flag = 0 and name like "{keyword}"''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)


# @api_view(['GET'])
# def getRole(request):
#     queryprms = request.GET
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     data_data = TbUsersRole.objects.raw(
#         f'''SELECT id, COUNT(*) AS count FROM tb_users_role WHERE del_flag = 0 AND name LIKE %s GROUP BY id ORDER BY {filter} {sorter} LIMIT %s OFFSET %s''',
#         [f"%{keyword}%", limit, limit * (pagenum - 1)])
#     data_serializer = roleSerializer(data_data, many=True)
#     data_count = TbUsersRole.objects.raw(
#         f'''select id, count(*) as count from tb_users_role WHERE del_flag = 0 and name like "{keyword}"''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def getRole(request):
    queryprms = request.GET
    limit = int(queryprms.get('limit', 5))
    keyword = queryprms.get('keyword', "")
    pagenum = int(queryprms.get('pagenum', 1))
    filter = queryprms.get('filter', "id")
    sorter = queryprms.get('sorter', "asc")
    
    data_data = TbUsersRole.objects.raw(
        f'''SELECT id, COUNT(*) AS count FROM tb_users_role WHERE del_flag = 0 AND name LIKE %s GROUP BY id ORDER BY {filter} {sorter} LIMIT %s OFFSET %s''',
        [f"%{keyword}%", limit, limit * (pagenum - 1)]
    )
    
    data_serializer = roleSerializer(data_data, many=True)
    
    data_count = TbUsersRole.objects.raw(
        f'''SELECT id, COUNT(*) AS count FROM tb_users_role WHERE del_flag = 0 AND name LIKE %s GROUP BY id''',
        [f"%{keyword}%"]
    )
    
    count = data_count[0].count if data_count else 0
    
    return JsonResponse({"data": data_serializer.data, "count": count, "code": 200}, safe=False)




@api_view(['POST'])
def addRole(request):
    data = json.loads(request.body)
    data_data = TbUsersRole(
        name=data["name"], permissionid=data["permissionid"], del_flag=0)
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)


# @ api_view(['POST'])
# def updateRole(request):
#     data = json.loads(request.body)
#     data_data = TbUsersRole.objects.raw(
#         f'''select * from tb_users_role where id = {data['id']}''')
#     data_data.name = data['name']
#     data_data.permissionid = data['permissionid']
#     data_data.save()
#     return JsonResponse({"code": 200}, safe=False)

from django.core.exceptions import ObjectDoesNotExist

@api_view(['POST'])
def updateRole(request):
    data = json.loads(request.body)
    try:
        role = TbUsersRole.objects.get(id=data['id'])
        role.name = data['name']
        role.permissionid = data['permissionid']
        role.save()
        return JsonResponse({"code": 200}, safe=False)
    except TbUsersRole.DoesNotExist:
        return JsonResponse({"error": "Role not found"}, status=404)



# @api_view(['GET'])
# def delRole(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     TbUsersRole.objects.filter(id=id).delete()
#     data_data = TbUsersRole.objects.raw(
#         f'''select * from tb_users_role where del_flag = 0 and name like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     data_serializer = roleSerializer(data_data, many=True)
#     data_count = TbUsersRole.objects.raw(
#         f'''select id, count(*) as count from tb_users_role where del_flag = 0 and name like "{keyword}" ''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def delRole(request):
    try:
        queryprms = request.GET
        id = queryprms.get('id', 1)
        limit = int(queryprms.get('limit', 5))
        keyword = queryprms.get('keyword', "")
        pagenum = int(queryprms.get('pagenum', 1))
        filter = queryprms.get('filter', "id")
        sorter = queryprms.get('sorter', "asc")
        TbUsersRole.objects.filter(id=id).delete()

        # Handle the case when keyword is empty
        if keyword:
            name_filter = f"name like '{keyword}'"
        else:
            name_filter = "1=1"  # Dummy condition to include all records

        data_data = TbUsersRole.objects.raw(
            f'''
            SELECT id, name FROM tb_users_role
            WHERE del_flag = 0 AND {name_filter}
            GROUP BY id, name
            ORDER BY {filter} {sorter}
            LIMIT {limit} OFFSET {limit * (pagenum - 1)}
            '''
        )
        data_serializer = roleSerializer(data_data, many=True)

        # Get the count using a modified raw query
        count_data = TbUsersRole.objects.raw(
            f'''
            SELECT 1 AS id, COUNT(*) AS count FROM tb_users_role
            WHERE del_flag = 0 AND {name_filter}
            '''
        )
        count = count_data[0].count if count_data else 0

        return JsonResponse({"data": data_serializer.data, "count": count, "code": 200}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


    # except Exception as e:
    #     return JsonResponse({"error": str(e)}, status=500)





# @api_view(['GET'])
# def getRank(request):
#     queryprms = request.GET
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     data_data = TbUserRank.objects.raw(
#         f'''select * from tb_user_rank where del_flag = 0 and name like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)} ''')
#     data_serializer = rankSerializer(data_data, many=True)
#     data_count = TbUserRank.objects.raw(
#         f'''select id, count(*) as count from tb_user_rank where del_flag = 0 and name like "{keyword}" ''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def getRank(request):
    try:
        query_params = request.GET
        limit = int(query_params.get('limit', 5))
        keyword = query_params.get('keyword', "")
        page_num = int(query_params.get('pagenum', 1))
        filter_field = query_params.get('filter', "id")
        sorter = query_params.get('sorter', "asc")

        offset = limit * (page_num - 1)

        filter_condition = "del_flag = 0"
        if keyword:
            filter_condition += f" AND name LIKE '%{keyword}%'"

        data_data = TbUserRank.objects.raw(
            f'''
            SELECT *
            FROM tb_user_rank
            WHERE {filter_condition}
            ORDER BY {filter_field} {sorter}
            LIMIT {limit} OFFSET {offset}
            '''
        )
        data_serializer = rankSerializer(data_data, many=True)

        count_condition = filter_condition
        count_data = TbUserRank.objects.raw(
            f'''
            SELECT id, COUNT(*) AS count
            FROM tb_user_rank
            WHERE {count_condition}
            GROUP BY id
            '''
        )
        count = count_data[0].count if count_data else 0

        return JsonResponse({"data": data_serializer.data, "count": count, "code": 200}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




@api_view(['POST'])
def addRank(request):
    data = json.loads(request.body)
    data_data = TbUserRank(
        name=data["name"], permissionid=data["permissionid"], parentid=data["parentid"], del_flag=0)
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)


@ api_view(['POST'])
def updateRank(request):
    data = json.loads(request.body)
    data_data = TbUserRank.objects.raw(
        f'''select * from tb_user_rank where id = {data['id']} ''')[0]
    data_data.name = data['name']
    data_data.permissionid = data['permissionid']
    data_data.parentid = data['parentid']
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)


# @api_view(['GET'])
# def delRank(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     TbUserRank.objects.filter(id=id).delete()
#     data_data = TbUserRank.objects.raw(
#         f'''select * from tb_user_rank where del_flag = 0 and name like "{keyword}" order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}''')
#     data_serializer = rankSerializer(data_data, many=True)
#     data_count = TbUserRank.objects.raw(
#         f'''select id, count(*) as count from tb_user_rank where del_flag = 0 and name like "{keyword}" ''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def delRank(request):
    query_params = request.GET
    id = query_params.get('id', 1)
    limit = int(query_params.get('limit', 5))
    keyword = query_params.get('keyword', "")
    page_num = int(query_params.get('pagenum', 1))
    filter = query_params.get('filter', "id")
    sorter = query_params.get('sorter', "asc")
    
    TbUserRank.objects.filter(id=id).delete()
    
    query = f'''
        SELECT * FROM tb_user_rank 
        WHERE del_flag = 0 AND name LIKE %s 
        ORDER BY {filter} {sorter} 
        LIMIT %s OFFSET %s
    '''
    data_data = TbUserRank.objects.raw(query, ['%' + keyword + '%', limit, limit * (page_num - 1)])
    
    count_query = f'''
        SELECT id, (SELECT COUNT(*) FROM tb_user_rank WHERE del_flag = 0 AND name LIKE %s) AS count
        FROM tb_user_rank 
        WHERE del_flag = 0 AND name LIKE %s
        GROUP BY id
    '''
    data_count = TbUserRank.objects.raw(count_query, ['%' + keyword + '%', '%' + keyword + '%'])
    
    data_serializer = rankSerializer(data_data, many=True)
    
    return JsonResponse({
        "data": data_serializer.data, 
        "count": data_count[0].count if data_count else 0, 
        "code": 200
    }, safe=False)






@api_view(['GET'])
def getAllRank(request):
    data_data = TbUserRank.objects.all()
    data_serializer = rankSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


@api_view(['GET'])
def getAllRole(request):
    data_data = TbUsersRole.objects.all()
    data_serializer = roleSerializer(data_data, many=True)
    return JsonResponse({"data": data_serializer.data, "code": 200}, safe=False)


# @api_view(['GET'])
# def getUser(request):
#     queryprms = request.GET
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     data_data = TbUsers.objects.raw(
#         f'''
#         select * from tb_users where del_flag = 0 and (fname like "{keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}") order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)}
#         ''')
#     data_serializer = (userSerializer(data_data, many=True))
#     data_count = TbUsers.objects.raw(f'''
#                                      select id, count(*) as count from tb_users where del_flag = 0 and (fname like "{keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}")
#                                      ''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def getUser(request):
    query_params = request.GET
    limit = int(query_params.get('limit', 5))
    keyword = query_params.get('keyword', "")
    pagenum = int(query_params.get('pagenum', 1))
    filter = query_params.get('filter', "id")
    sorter = query_params.get('sorter', "asc")
    
    query = '''
        SELECT * FROM tb_users 
        WHERE del_flag = 0 
    '''
    if keyword:
        query += f'''
            AND (fname LIKE '{keyword}' OR lname LIKE '{keyword}' OR cid LIKE '{keyword}' OR mobile LIKE '{keyword}')
        '''
    
    query += f'''
        ORDER BY {filter} {sorter} 
        LIMIT {limit} OFFSET {limit * (pagenum - 1)}
    '''
    data_data = TbUsers.objects.raw(query)
    data_serializer = userSerializer(data_data, many=True)
    
    count_query = '''
        SELECT id, COUNT(*) AS count 
        FROM tb_users 
        WHERE del_flag = 0
    '''
    if keyword:
        count_query += f'''
            AND (fname LIKE '{keyword}' OR lname LIKE '{keyword}' OR cid LIKE '{keyword}' OR mobile LIKE '{keyword}')
        '''
    count_query += ''' GROUP BY id''' 
    data_count = TbUsers.objects.raw(count_query)
    
    return JsonResponse({
        "data": data_serializer.data, 
        "count": data_count[0].count if data_count else 0, 
        "code": 200
    }, safe=False)





# @api_view(['POST'])
# def addUser(request):
#     data = json.loads(request.body)
#     password = hashlib.sha1(data["password"].encode('utf-8')).hexdigest()
#     # data_data = TbUsers(avatar=data["avatar"],fname=data["fname"],lname=data["lname"],role=data["role"],cid=data["cid"],mobile=data["mobile"],email=data["email"],username=data["username"],password=password,rank=data["rank"],election_option=data["election_option"], del_flag=0)
#     data_data = TbUsers(fname=data["fname"], lname=data["lname"], role=data["role"], cid=data["cid"], mobile=data["mobile"], email=data["email"],
#                         username=data["username"], password=password, rank=data["rank"], election_option=data["election_option"], del_flag=0)
#     data_data.save()
#     return JsonResponse({"code": 200}, safe=False)

@api_view(['POST'])
def addUser(request):
    data = json.loads(request.body)
    password = hashlib.sha1(data["password"].encode('utf-8')).hexdigest()
    
    user = TbUsers(
        fname=data["fname"],
        lname=data["lname"],
        role=data["role"],
        cid=data["cid"],
        mobile=data["mobile"],
        email=data["email"],
        username=data["username"],
        password=password,
        rank=data["rank"],
        election_option=data["election_option"],
        del_flag=0
    )
    user.save()
    
    return JsonResponse({"code": 200}, safe=False)



# @ api_view(['POST'])
# def updateUser(request):
#     data = json.loads(request.body)
#     data_data = TbUsers.objects.raw(
#         'select * from tb_users where id = ' + str(data['id']))[0]
#     data_data.fname = data['fname']
#     data_data.lname = data['lname']
#     # data_data.avatar = data['avatar']
#     data_data.role = data['role']
#     data_data.cid = data['cid']
#     data_data.mobile = data['mobile']
#     data_data.email = data['email']
#     data_data.username = data['username']
#     3
    
#     data_data.election_option = data['election_option']
#     data_data.rank = data['rank']
#     data_data.save()
#     return JsonResponse({"code": 200}, safe=False)
@api_view(['POST'])
def updateUser(request):
    data = json.loads(request.body)
    user_id = data['id']
    
    try:
        user = TbUsers.objects.get(id=user_id)
    except TbUsers.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    user.fname = data['fname']
    user.lname = data['lname']
    user.role = data['role']
    user.cid = data['cid']
    user.mobile = data['mobile']
    user.email = data['email']
    user.username = data['username']
    user.election_option = data['election_option']
    user.rank = data['rank']
    
    user.save()
    
    return JsonResponse({"code": 200}, safe=False)


@api_view(['DELETE'])
def delUser(request, id):
    try:
        user = TbUsers.objects.get(id=id)
        user.delete()
        return JsonResponse({"message": "User deleted successfully."}, status=204)
    except TbUsers.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)


# @api_view(['GET'])
# def delUser(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     data_del = TbUsers.objects.raw(
#         'select * from tb_users where id = ' + "id")[0]
#     data_del.del_flag = 1
#     data_del.save()
#     data_data = TbUsers.objects.raw(
#         f'''select * from tb_users where del_flag = 0 and (fname like "{keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}") order by {filter} {sorter} limit {limit} offset {limit * (pagenum - 1)} ''')
#     data_serializer = (userSerializer(data_data, many=True))
#     data_count = TbUsers.objects.raw(f'''select id, count(*) as count from tb_users where del_flag = 0 and (fname like "
#                                      {keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}") ''')
#     return JsonResponse({"data": data_serializer.data, "count": data_count[0].count, "code": 200}, safe=False)


# @api_view(['GET'])
# def getMyTeamId(request):
#     queryprms = request.GET
#     userid = queryprms.get('userid', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     cursor = connection.cursor()
#     offset = limit * (pagenum - 1)
#     print('* upper'*20)
#     print(f'''
#     select t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option from (select id, teamuser_id from tb_team_members where candidate_id = {userid} and del_flag = 0) as t join (select * from tb_users where del_flag = 0) as u on t.teamuser_id = u.id where (fname like  "{keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}") order by t.{filter} {sorter} limit {limit} offset {offset}
#     ''')
#     cursor.execute(f'''
#     select t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option from (select id, teamuser_id from tb_team_members where candidate_id = {userid} and del_flag = 0) as t join (select * from tb_users where del_flag = 0) as u on t.teamuser_id = u.id where (fname like  "{keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}") order by t.{filter} {sorter} limit {limit} offset {offset}
#                    ''')
#     print('*'*20)
#     print('*'*20)
#     objs = cursor.fetchall()
#     json_data = []
#     for obj in objs:
#         json_data.append({"id": obj[0], "avatar": obj[1], "fname": obj[2], "lname": obj[3], "role": obj[4], "cid": obj[5],
#                          "mobile": obj[6], "email": obj[7], "username": obj[8], "rank": obj[9], "election_option": obj[10]})
#     data_count = TbUsers.objects.raw(f'''
#     select id, count(*) as count from (select teamuser_id from tb_team_members where candidate_id = {userid}
#     and del_flag = 0) as t join (select * from tb_users where del_flag = 0) as u on t.teamuser_id = u.id where (fname like "{keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}")
#     ''')
#     return JsonResponse({"data": json_data, "count": data_count[0].count, "code": 200}, safe=False)


@api_view(['GET'])
def getMyTeamId(request):
    query_params = request.GET
    userid = query_params.get('userid', 1)
    limit = int(query_params.get('limit', 5))
    keyword = query_params.get('keyword', "")
    pagenum = int(query_params.get('pagenum', 1))
    filter = query_params.get('filter', "id")
    sorter = query_params.get('sorter', "asc")
    offset = limit * (pagenum - 1)
    keyword_condition = f"fname ILIKE '{keyword}' OR lname ILIKE '{keyword}' OR cid ILIKE '{keyword}' OR mobile ILIKE '{keyword}'"

    if not keyword:
        keyword_condition = "TRUE"  # Empty string case, always true condition

    cursor = connection.cursor()

    try:
        query = f'''
            SELECT t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option
            FROM (SELECT id, teamuser_id FROM tb_team_members WHERE candidate_id = {userid} AND del_flag = 0) AS t
            JOIN (SELECT * FROM tb_users WHERE del_flag = 0) AS u ON t.teamuser_id = u.id
            WHERE {keyword_condition}
            GROUP BY t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option
            ORDER BY t.{filter} {sorter}
            LIMIT {limit} OFFSET {offset}
        '''

        cursor.execute(query)
        objs = cursor.fetchall()
        json_data = []

        for obj in objs:
            json_data.append({
                "id": obj[0],
                "avatar": obj[1],
                "fname": obj[2],
                "lname": obj[3],
                "role": obj[4],
                "cid": obj[5],
                "mobile": obj[6],
                "email": obj[7],
                "username": obj[8],
                "rank": obj[9],
                "election_option": obj[10]
            })

        count_query = f'''
            SELECT id, COUNT(*) AS count
            FROM (SELECT teamuser_id FROM tb_team_members WHERE candidate_id = {userid} AND del_flag = 0) AS t
            JOIN (SELECT * FROM tb_users WHERE del_flag = 0) AS u ON t.teamuser_id = u.id
            WHERE {keyword_condition}
            GROUP BY u.id
        '''

        data_count = TbUsers.objects.raw(count_query)
        count = data_count[0].count if len(data_count) > 0 else 0

        return JsonResponse({"data": json_data, "count": count, "code": 200}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# @api_view(['GET'])
# def getMyCandidateId(request):
#     queryprms = request.GET
#     userid = queryprms.get('userid', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     cursor = connection.cursor()
#     offset = limit * (pagenum - 1)
#     print(f'''
#     select t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option from (select id, candidate_id from tb_team_members where teamuser_id = {userid} and del_flag = 0) as t join (select * from tb_users where del_flag = 0) as u on t.candidate_id = u.id where (fname like "
# {keyword}" or lname like "{keyword}" or cid like "{keyword}" or mobile like "{keyword}") order by {filter} {sorter} limit {limit} offset {offset}), None
#     ''')
    
#     cursor.execute(f'''
#     SELECT t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option
#     FROM (SELECT id, candidate_id FROM tb_team_members WHERE teamuser_id = {userid} AND del_flag = 0) AS t
#     JOIN (SELECT * FROM tb_users WHERE del_flag = 0) AS u ON t.candidate_id = u.id
#     WHERE fname LIKE '{keyword}' OR lname LIKE '{keyword}' OR cid LIKE '{keyword}' OR mobile LIKE '{keyword}'
#     ORDER BY t.{filter} {sorter} limit {limit} offset {offset}
#     ''')
#     objs = cursor.fetchall()
#     json_data = []
#     for obj in objs:
#         json_data.append({"id": obj[0], "avatar": obj[1], "fname": obj[2], "lname": obj[3], "role": obj[4], "cid": obj[5],
#                          "mobile": obj[6], "email": obj[7], "username": obj[8], "rank": obj[9], "election_option": obj[10]})
#     data_count = TbUsers.objects.raw('select id, count(*) as count from (select candidate_id from tb_team_members where teamuser_id = ' + str(userid) +
#                                      ' and del_flag = 0) as t join (select * from tb_users where del_flag = 0) as u on t.candidate_id = u.id where (fname like "' + keyword + '" or lname like "' + keyword + '" or cid like "' + keyword + '" or mobile like "' + keyword + '")')
#     return JsonResponse({"data": json_data, "count": data_count[0].count, "code": 200}, safe=False)



@api_view(['GET'])
def getMyCandidateId(request):

    try:

        queryprms = request.GET
        userid = int(queryprms.get('userid', 1))
        limit = int(queryprms.get('limit', 5))
        keyword = queryprms.get('keyword', "")
        pagenum = int(queryprms.get('pagenum', 1))
        filter = queryprms.get('filter', "id")
        sorter = queryprms.get('sorter', "asc")
        cursor = connection.cursor()
        offset = limit * (pagenum - 1)
        print('*' * 40)
        
        filter_column = f"t.{filter}"  # Construct the column name
        
        sql_query = f'''
        SELECT t.id, u.avatar, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option
        FROM (
            SELECT id, candidate_id
            FROM tb_team_members
            WHERE teamuser_id = %s AND del_flag = 0
        ) AS t
        JOIN (
            SELECT *
            FROM tb_users
            WHERE del_flag = 0
        ) AS u ON t.candidate_id = u.id
        WHERE fname::text LIKE %s OR lname::text LIKE %s OR cid::text LIKE %s OR mobile::text LIKE %s
        ORDER BY {filter_column} {sorter}
        LIMIT %s OFFSET %s;
        '''

        if not keyword:
            keyword = "%%"

        cursor.execute(sql_query, (userid, keyword, keyword, keyword, keyword, limit, offset))
        print('*' * 20)
        objs = cursor.fetchall()
        json_data = []
        print("=" * 20)
        for obj in objs:
            json_data.append({
                "id": obj[0], "avatar": obj[1], "fname": obj[2], "lname": obj[3], "role": obj[4], "cid": obj[5],
                "mobile": obj[6], "email": obj[7], "username": obj[8], "rank": obj[9], "election_option": obj[10]
            })

        data_count_query = '''
        SELECT COUNT(*) AS count
        FROM (
            SELECT candidate_id
            FROM tb_team_members
            WHERE teamuser_id = %s AND del_flag = 0
        ) AS t
        JOIN (
            SELECT *
            FROM tb_users
            WHERE del_flag = 0
        ) AS u ON t.candidate_id = u.id
        WHERE fname::text LIKE %s OR lname::text LIKE %s OR cid::text LIKE %s OR mobile::text LIKE %s;
        '''

        if not keyword:
            keyword = "%%"

        cursor.execute(data_count_query, (userid, keyword, keyword, keyword, keyword))
        data_count = cursor.fetchone()[0]

        return JsonResponse({"data": json_data, "count": data_count, "code": 200}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)





# @api_view(['GET'])
# def getMyGuanatorId(request):
#     queryprms = request.GET
#     id = queryprms.get('id', 1)
#     userid = queryprms.get('userid', 1)
#     limit = int(queryprms.get('limit', 5))
#     keyword = queryprms.get('keyword', "")
#     pagenum = int(queryprms.get('pagenum', 1))
#     filter = queryprms.get('filter', "id")
#     sorter = queryprms.get('sorter', "asc")
#     cursor = connection.cursor()
#     offset = limit * (pagenum - 1)
#     print('*'*40)

#     print(f'''
#     SELECT t.id, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option, t.guarantee, t.attended, t.status
#     FROM (SELECT id, user_id, guarantee, attended, status
#             FROM tb_guarantees
#             WHERE election_id = {id} AND guarantor_id = {userid} AND del_flag = 0) AS t
#     JOIN (SELECT *
#             FROM tb_users
#             WHERE del_flag = 0) AS u
#     ON t.user_id = u.id
#     WHERE (fname LIKE "{keyword}" OR lname LIKE "{keyword}" OR cid LIKE "{keyword}" OR mobile LIKE "{keyword}")
#     ORDER BY t.{filter} {sorter} LIMIT {limit} OFFSET {offset};

#     ''')
    
    


#     cursor.execute(f'''
#     SELECT t.id, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option, t.guarantee, t.attended, t.status
#     FROM (SELECT id, user_id, guarantee, attended, status
#             FROM tb_guarantees
#             WHERE election_id = {id} AND guarantor_id = {userid} AND del_flag = 0) AS t
#     JOIN (SELECT *
#             FROM tb_users
#             WHERE del_flag = 0) AS u
#     ON t.user_id = u.id
#     WHERE (fname LIKE "{keyword}" OR lname LIKE "{keyword}" OR cid LIKE "{keyword}" OR mobile LIKE "{keyword}")
#     ORDER BY t.{filter} {sorter} LIMIT {limit} OFFSET {offset};
#                    ''')
#     print('*'*20)
#     objs = cursor.fetchall()
#     json_data = []
#     print("="*20)
#     for obj in objs:
#         json_data.append({"id": obj[0], "avatar": obj[1], "fname": obj[2], "lname": obj[3], "role": obj[4], "cid": obj[5],
#                          "mobile": obj[6], "email": obj[7], "username": obj[8], "rank": obj[9], "election_option": obj[10], "guarantee": obj[11], "attended": obj[12], "status": obj[13]})
#     data_count = TbUsers.objects.raw(f'''
#     SELECT t.id, COUNT(*) AS count
#     FROM (SELECT id, user_id, guarantee, attended, status
#         FROM tb_guarantees
#         WHERE election_id = {id} AND guarantor_id = {userid} AND del_flag = 0) AS t
#     JOIN (SELECT *
#         FROM tb_users
#         WHERE del_flag = 0) AS u
#     ON t.user_id = u.id
#     WHERE fname LIKE '{keyword}' OR lname LIKE '{keyword}' OR cid LIKE '{keyword}' OR mobile LIKE '{keyword}';
#     ''')
#     return JsonResponse({"data": json_data, "count": data_count[0].count, "code": 200}, safe=False)

@api_view(['GET'])
def getMyGuanatorId(request):

    try:

        queryprms = request.GET
        id = queryprms.get('id', 1)
        userid = queryprms.get('userid', 1)
        limit = int(queryprms.get('limit', 5))
        keyword = queryprms.get('keyword', "")
        pagenum = int(queryprms.get('pagenum', 1))
        filter = queryprms.get('filter', "id")
        sorter = queryprms.get('sorter', "asc")
        cursor = connection.cursor()
        offset = limit * (pagenum - 1)
        print('*' * 40)
        sql_query = f'''
            SELECT t.id, u.fname, u.lname, u.role, u.cid, u.mobile, u.email, u.username, u.rank, u.election_option, t.guarantee, t.attended, t.status
            FROM (
                SELECT id, user_id, guarantee, attended, status
                FROM tb_guarantees
                WHERE election_id = {id} AND guarantor_id = {userid} AND del_flag = 0
            ) AS t
            JOIN (
                SELECT *
                FROM tb_users
                WHERE del_flag = 0
            ) AS u ON t.user_id = u.id
            WHERE (fname::text LIKE %s OR lname::text LIKE %s OR cid::text LIKE %s OR mobile::text LIKE %s)
            ORDER BY t.{filter} {sorter}
            LIMIT {limit} OFFSET {offset};
        '''

        if not keyword:
            keyword = "%%"
            sql_query = sql_query.replace("%s", "'%%'")

        cursor.execute(sql_query, [keyword] * 4)
        print('*' * 20)
        objs = cursor.fetchall()
        json_data = []
        print("=" * 20)
        for obj in objs:
            json_data.append({
                "id": obj[0], "avatar": obj[1], "fname": obj[2], "lname": obj[3], "role": obj[4], "cid": obj[5],
                "mobile": obj[6], "email": obj[7], "username": obj[8], "rank": obj[9], "election_option": obj[10],
                "guarantee": obj[11], "attended": obj[12], "status": obj[13]
            })

        data_count_query = f'''
            SELECT COUNT(*) AS count
            FROM (
                SELECT id, user_id, guarantee, attended, status
                FROM tb_guarantees
                WHERE election_id = {id} AND guarantor_id = {userid} AND del_flag = 0
            ) AS t
            JOIN (
                SELECT *
                FROM tb_users
                WHERE del_flag = 0
            ) AS u ON t.user_id = u.id
            WHERE fname::text LIKE %s OR lname::text LIKE %s OR cid::text LIKE %s OR mobile::text LIKE %s;
        '''
        if not keyword:
            data_count_query = data_count_query.replace("%s", "'%%'")

        cursor.execute(data_count_query, [keyword] * 4)
        data_count = cursor.fetchone()[0]

        
        return JsonResponse({"data": json_data, "count": data_count, "code": 200}, safe=False)


    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@api_view(['GET'])
def delMyGuanatorId(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_del = TbGuarantees.objects.raw(
        f''' select * from tb_guarantees where id = {id} ''')[0]
    data_del.del_flag = 1
    data_del.save()
    return JsonResponse({"code": 200}, safe=False)


@api_view(['GET'])
def delMyTeamId(request):
    queryprms = request.GET
    id = queryprms.get('id', 1)
    data_del = TbTeamMembers.objects.raw(
        f''' select * from tb_team_members where id = {id} ''')[0]
    data_del.del_flag = 1
    data_del.save()
    return JsonResponse({"code": 200}, safe=False)


@ api_view(['POST'])
def addMyTeamId(request):
    data = json.loads(request.body)
    data_data = TbTeamMembers(
        candidate_id=data["canid"], teamuser_id=data["teamid"], del_flag=0)
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)


@ api_view(['POST'])
def addMyCandidateId(request):
    data = json.loads(request.body)
    data_data = TbTeamMembers(
        candidate_id=data["canid"], teamuser_id=data["teamid"], del_flag=0)
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)


@ api_view(['POST'])
def addMyGuanatorId(request):
    data = json.loads(request.body)
    data_data = TbGuarantees(
        user_id=data["userid"], election_id=data["electionid"], guarantor_id=data["guarantorid"], guarantee=data["guarantee"], attended=data["attended"], status=data["status"], del_flag=0)
    data_data.save()
    return JsonResponse({"code": 200}, safe=False)
