from flask import Flask, request, jsonify
from time import sleep

app = Flask(__name__)
busy = False

@app.route('/engine', methods=['POST'])
def engine():
    global busy
    if busy:
        return "Service Unavailable", 503
    
    data = request.get_json()
    try:
        if data['product'] == '1': 
            busy = True
            # Ativa o motor 1
            sleep(10)
            busy = False
            return "", 200
    except:
        pass
    
    return "Bad Request", 400

if __name__ == '__main__':
    app.run()
