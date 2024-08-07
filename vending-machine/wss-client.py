from os import getenv
from dotenv import load_dotenv
import asyncio
import socketio
import jwt

from stepper import Stepper

load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/vending-machine")
jwt_algorithm = getenv("JWT_ALGORITHM", default="HS256")
secret_key = getenv("TOKEN_SECRET_KEY_VENDING_MACHINE", default="")


motores = []
motores.append(Stepper(pinos=[26, 6, 13, 5]))  # motor 1
motores.append(Stepper(pinos=[21, 20, 16, 12]))  # motor 2
motores.append(Stepper(pinos=[1, 8, 7, 25]))  # motor 3
sio = socketio.Client(logger=False, engineio_logger=True)


@sio.event(namespace=namespace)
def connect():
    """
    Conexão ao servidor estabelecida
    """
    messageType = "stateUpdate"
    messageContent = {"state": "idle", "operation": 0}
    sio.emit(messageType, messageContent, namespace=namespace)


@sio.event(namespace=namespace)
def stateMFA(data):
    """
    Recebe a solicitação para autenticação em duas etapas
    """
    try:
        username, code, operation = data.values()
    except Exception as e:
        print(f"Erro: {e}")
        return

    print("Olá, %s! Seu código de autenticação é %s." % (username, code))

    messageType = "stateUpdate"
    messageContent = {"state": "mfa", "operation": operation}
    sio.emit(messageType, messageContent, namespace=namespace)


@sio.event(namespace=namespace)
def stateReleasing(data):
    """
    Recebe a solicitação para liberar o produto
    """
    try:
        product, operation = data.values()
        product = int(product)
    except Exception as e:
        print(f"Erro: {e}")
        return

    messageType = "stateUpdate"
    messageContent = {"state": "releasing", "operation": operation}
    sio.emit(messageType, messageContent, namespace=namespace)

    try:
        motores[product].girar_angulo(
            360, sentido_horario=True, tempo=0.008, modo="passo_completo"
        )
        pass
    finally:
        motores[product].desligar()
        pass

    messageType = "stateUpdate"
    messageContent = {"state": "idle", "operation": operation}
    sio.emit(messageType, messageContent, namespace=namespace)


@sio.event(namespace=namespace)
def disconnect():
    """
    Conexão ao servidor encerrada
    """
    pass


def main():
    """
    Função principal
    """
    message = {"machine": "vending-machine", "id": 0}
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
