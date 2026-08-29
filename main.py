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
        elif number <= 70:
            return{
                "result": "三塁打！！",
                "type": "triple"
            }   
        elif number <= 90:
            return{
                "result": "二塁打！！",
                "type": "double"
            }
        else:
            return{
                "result": "ヒット！！",
                "type": "single"
            }

    elif timing == "good":
        number = random.randint(1, 100)

        if number <= 10:
            return{
                "result": "ホームラン！！",
                "type": "home_run"
            }
        elif number <= 20:
            return{
                "result": "三塁打！！",
                "type": "triple"
            }   
        elif number <= 40:
            return{
                "result": "二塁打！！",
                "type": "double"
            }
        else:
            return{
                "result": "ヒット！！",
                "type": "single"
            }

    elif timing == "bad":
        number = random.randint(1, 100)

        if number <= 5:
            return{
                "result": "ホームラン！！",
                "type": "home_run"
            }
        elif number <= 10:
            return{
                "result": "三塁打！！",
                "type": "triple"
            }   
        elif number <= 20:
            return{
                "result": "二塁打！！",
                "type": "double"
            }
        else:
            return{
                "result": "ストライク",
                "type": "strike"
            }

port = int(
    os.environ.get("PORT", 8000)
)

server = HTTPServer(
    ("0.0.0.0", port),
    GameHandler
)

print(f"野球ゲームを起動しました！　ポート：{port}"
)

server.server_forever()