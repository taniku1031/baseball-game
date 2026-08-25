from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import random
import os

class GameHandler(SimpleHTTPRequestHandler):
    def do_POST (self):
        if self.path == '/hit':

            try:
                #送られてきたデータの取得
                content_length = int(
                self.headers['Content-Length']
                )

                body = self.rfile.read(content_length)

                #JSONをPythonのデータに変換
                data = json.loads(
                    body.decode('utf-8')
                )

                timing = data['timing']

                result = decide_result(timing)

                response = json .dumps(
                    result,
                    ensure_ascii=False
                )

                self.send_response(200)
                self.send_header(
                    "Content-Type",
                     "application/json; charset=utf-8"
                     )

                self.end_headers()

                self.wfile.write(
                    response.encode('utf-8')
                )

            except Exception as error:

                print("エラー：",error)

                self.send_response(500)

                self.end_headers()

        else:
            self.send_response(404)

#打撃結果を決める
def decide_result(timing):

    if timing == "perfect":
        number = random.randint(1, 100)

        if number <= 50:
            return{
                "result": "ホームラン！！",
                "type": "home_run"
            }