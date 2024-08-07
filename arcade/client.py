from json import load
from os import getenv
from dotenv import load_dotenv
import socketio
import jwt
from evdev import UInput, ecodes as e
from time import sleep


load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/arcade")
jwt_algorithm = getenv("JWT_ALGORITHM", default="HS256")
secret_key = getenv("TOKEN_SECRET_KEY_ARCADE", default="")


sio = socketio.Client(logger=False, engineio_logger=True)
ui = UInput(name="Banco Central")


@sio.event(namespace="/arcade")
def connect():
    """
    Conexão ao servidor estabelecida
    """
    pass


@sio.event(namespace="/arcade")
def coinInsert(data):
    """
    Recebe a solicitação para inserção de moeda
    """
    coins: int
    try:
        arcade, coins, operation = data.values()
    except:
        return

    for _ in range(coins):
        ui.write(e.EV_KEY, e.KEY_J, 1)  # Pressiona a tecla J
        ui.syn() # Envia o comando
        sleep(0.250)
        ui.write(e.EV_KEY, e.KEY_J, 0)  # Solta a tecla J
        ui.syn() # Envia o comando

    messageType = "coinInserted"
    messageContent = {"arcade": arcade, "operation": operation}
    sio.emit(messageType, messageContent, namespace=namespace)


@sio.event
def disconnect():
    """
    Conexão ao servidor encerrada
    """
    pass


def main():
    """
    Função principal
    """
    message = {"machine": "arcade", "id": 0}
    token = jwt.encode(message, secret_key, algorithm=jwt_algorithm)
    sio.connect(
        url,
        socketio_path=socketio_path,
        namespaces=namespace,
        auth={"token": token},
    )
    sio.wait()


if __name__ == "__main__":
    main()
