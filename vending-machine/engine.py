from flask import Flask, request, jsonify
from time import sleep
import threading

app = Flask(__name__)
busy = False


def background_command():
    sleep(10)
    print("Product processed successfully")
    return


@app.route("/engine", methods=["POST"])
def engine():
    global busy
    if busy:
        return "Service Unavailable", 503

    data = request.get_json()
    try:
        if data["product"] == "1":
            busy = True
            threading.Thread(target=background_command).start()
            print("Product processing started")
            busy = False
            return "", 200
    except:
        pass

    return "Bad Request", 400


if __name__ == "__main__":
    app.run()
