import requests

r = requests.get('http://localhost:9000/get_all_courses')
print(r.json())