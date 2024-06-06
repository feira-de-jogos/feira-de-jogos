from flask import Flask, request, jsonify
import os

app = Flask(__name__)
productsList = ['1', '2', '3']
STATE_FILE = 'machineState.txt'


def initialize_state_file():
    if not os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'w') as f:
            f.write('w')
        print(f"Created {STATE_FILE} with initial state 'w'")


def get_ejection_state():
    with open(STATE_FILE, 'r') as f:
        return f.read(1)  # Lê apenas o primeiro caractere


def set_ejection_state(state):
    with open(STATE_FILE, 'w') as f:
        f.write(state)
    print(f"Set ejection state to: {state}")


initialize_state_file()


@app.route('/engine', methods=['POST'])
def engine():
    data = request.get_json()
    print(f"Request data: {data}")

    if not data:
        return jsonify({'message': 'Service Unavailable'}), 503

    if 'productId' not in data or data['productId'] not in productsList:
        return jsonify({'message': 'Unauthorized'}), 401

    product_id = data['productId']
    ejectionState = get_ejection_state()
    print(f"Ejection state before processing: {ejectionState}")

    if ejectionState == 'w':
        print('Setting state to Processing and starting task')
        set_ejection_state('p' + product_id)
        return jsonify({'message': 'Product processing started'}), 202
    elif ejectionState == 'p':
        print('Product is currently being processed')
        return jsonify({'message': 'Product is currently being processed'}), 202
    elif ejectionState == 's':
        print('Setting state to Waiting and returning success')
        set_ejection_state('w')
        return jsonify({'message': 'Product processed successfully'}), 200
    else:
        return jsonify({'message': 'Unknown state'}), 500


if __name__ == '__main__':
    print(f"Initial ejection state: {get_ejection_state()}")
    app.run(debug=True)
