import json
import requests
import hashlib
import time
import random
import zipfile
app_id = "AK20210729JOMDQZ"
app_key = "953d3386cb3d7e2125e00a1d949cfa7f"
openapi_host = "http://wps-server.logiocean.com/open"
def _sig(content_md5, url, date):
    sha1 = hashlib.sha1(app_key.lower().encode('utf-8'))
    sha1.update(content_md5.encode('utf-8'))
    sha1.update(url.encode('utf-8'))
    sha1.update("application/json".encode('utf-8'))
    sha1.update(date.encode('utf-8'))

    return "WPS-3:%s:%s" % (app_id, sha1.hexdigest())

def request(method, host, uri, body=None, cookie=None, headers=None):
    requests.packages.urllib3.disable_warnings()

    if method == "PUT" or method == "POST" or method == "DELETE":
        body = json.dumps(body, separators=(',', ':'))

    if method == "PUT" or method == "POST" or method == "DELETE":
        content_md5 = hashlib.md5(body.encode('utf-8')).hexdigest()
    else:
        content_md5 = hashlib.md5("".encode('utf-8')).hexdigest()

    # date = time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime())
    date = "Wed, 01 Sep 2021 02:19:55 GMT"
    print('md5: %s' % content_md5)

    header = {"Content-type": "application/json"}
    header['X-Auth'] = _sig(content_md5, uri, date)
    print('xauth: %s' % header['X-Auth'])
    header['Date'] = date
    header['Content-Md5'] = content_md5
    if headers != None:
        header = {}
        for key, value in headers.items():
            header[key] = value

    url = "%s%s" % (host, uri)
    print("url:", url)
    print("body:", body)
    print("header:", header)
    r = requests.request(method, url, data=body,
                         headers=header, cookies=cookie, verify=False)

    # print("[response]: status=[%d],URL=[%s],data=[%s]" % (r.status_code, url, r.text))

    return r.status_code, r.text, r.headers.get("User_Token")

def get_company_token():
    url = "/auth/v1/app/inscope/token?app_id=%s&scope=%s" % (app_id, "file_format_control,file_edit,file_preview")
    status, rsp, token = request("GET", openapi_host, url, None, None, None)
    rsp = json.loads(rsp)
    # app_token = rsp.get("token").get("app_token")
    app_token = rsp["token"]["app_token"]
    print("app token:", app_token)

    # url_login = "/saas/v1/auth/login"
    # body_login = {
    #     "email": "liminglong@logiocean.com",
    #     "password": "123456",
    # }
    # login_status, login_rsp, user_token = request("POST", "http://localhost:8080", url_login, body_login)
    # print(user_token)

    task_id = random.randint(0,100000)
    print(task_id)
    url1 = "/cps/v2/office/convert"
    doc_url = "http://gubaike-test.frontnode.net/api/library/v1/file/download?target_type=FILE_TYPE_TEMPLATE&target_id=Fq3k9R6pE&version_id=25"
    body1 = {
        "app_token": app_token,
        "task_id": task_id,
        "doc_filename": "123.docx",
        "doc_url": doc_url,
        "target_file_format": "HTML",
        "scene_id": "1"
    }
    # cookie = {
    #     "logi_session_id_value": "%s" % user_token
    # }
    status1, rsp1, token = request("POST", openapi_host, url1, body1, None, None)
    print(rsp1)

    task_id = "f079762a7c4b35ff3cecbb15b5cf8997c90cd9ea"
    url2 = "/cps/v1/task/query"
    body2 = {
        "app_token": app_token,
        "task_id": task_id,
    }
    status2, rsp2, token = request("POST", openapi_host, url2, body2, None, None)
    print('111111111111')
    print(rsp2)
    # download = json.loads(rsp2)
    # download_id = download.get("download_id")
    # print(download_id)
    download_id = "ac70b00253114bd69953adf7748dd37e"

    url4 = "/cps/v1/download/file/%s?app_token=%s" % (download_id, app_token)
    status4, rsp4, token = request("GET", openapi_host, url4, None, None, None)
    print(rsp4.encode("utf8"))
    # zf = zipfile.ZipFile("123.zip", "w", zipfile.ZIP_DEFLATED).writestr("123", rsp4)
    # print(rsp4)
    # print(status4)
    # # print(rsp4.decode("utf8"))
    # with open("123", "wb") as binary_file:
    #     binary_file.write(bytes(rsp4.encode()))

    # url3 = "/weboffice/v2/url?app_token=%s&scene_id=1&file_id=4_75&type=w&_w_dbg_user=minglong&_w_tokentype=1&_w_file_type=4&_w_file_id=75" % app_token
    # status3, rsp3 = request("GET", openapi_host, url3, None, None, None)

def query():
    url = "/auth/v1/app/inscope/token?app_id=%s&scope=%s" % (app_id, "file_format_control,file_edit,file_preview")
    status, rsp, token = request("GET", openapi_host, url, None, None, None)
    rsp = json.loads(rsp)
    app_token = rsp.get("token").get("app_token")
    print(app_token)
    # app_token = rsp["token"]["app_token"]
    # app_token = "d0fad842a5b26c35a66a7a000ea24643"
    task_id = "f079762a7c4b35ff3cecbb15b5cf8997c90cd9ea"
    url2 = "/cps/v1/task/query"
    body2 = {
        "app_token": app_token,
        "task_id": task_id,
    }
    status2, rsp2, token = request("POST", openapi_host, url2, body2, None, None)
    print('111111111111')
    print(rsp2)

def download():
    # url = "/auth/v1/app/inscope/token?app_id=%s&scope=%s" % (app_id, "file_format_control,file_edit,file_preview")
    # status, rsp, token = request("GET", openapi_host, url, None, None, None)
    # rsp = json.loads(rsp)
    # app_token = rsp.get("token").get("app_token")
    # app_token = rsp["token"]["app_token"]
    app_token = '744fddc7e249f71846850781abeb373f'
    print("app token:", app_token)
    download_id = "91e580fd5a99453193ba42510d05d27b"

    url4 = "/cps/v1/download/file/%s?app_token=%s" % (download_id, app_token)
    status4, rsp4, token = request("GET", openapi_host, url4, None, None, None)
    # print(rsp4)
    # print(rsp4.encode("utf8"))

def convert():
    # url = "/auth/v1/app/inscope/token?app_id=%s&scope=%s" % (app_id, "file_format_control,file_edit,file_preview")
    # status, rsp, token = request("GET", openapi_host, url, None, None, None)
    # rsp = json.loads(rsp)
    # app_token = rsp["token"]["app_token"]
    app_token = '1e163f10f6fb39569baf33c5690aa0eb'
    # print('apptoken: %s' % app_token)
    # task_id = random.randint(0,100000)
    task_id = 'test123'
    print(task_id)
    url1 = "/cps/v2/office/convert"
    doc_url = "http://gubaike-test.frontnode.net/api/library/v1/file/download?target_type=FILE_TYPE_TEMPLATE&target_id=Fq3k9R6pE&version_id=25"
    body1 = {
        "app_token": app_token,
        "task_id": task_id,
        "doc_filename": "123.docx",
        "doc_url": doc_url,
        "target_file_format": "HTML",
        "scene_id": "1"
    }
    print(body1)
    # cookie = {
    #     "logi_session_id_value": "%s" % user_token
    # }
    status1, rsp1, token = request("POST", openapi_host, url1, body1, None, None)
    print(rsp1)
    print(status1)

def apptoken():
    url = "/auth/v1/app/inscope/token?app_id=%s&scope=%s" % (app_id, "file_format_control,file_edit,file_preview")
    status, rsp, token = request("GET", openapi_host, url, None, None, None)
    rsp = json.loads(rsp)
    app_token = rsp["token"]["app_token"]
    print('apptoken: %s' % app_token)

if __name__ == '__main__':
    # apptoken()
    convert()
    # query()
    # download()
    # get_company_token()