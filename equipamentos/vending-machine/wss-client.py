from os import getenv
from dotenv import load_dotenv
import socketio
from datetime import datetime, timezone, timedelta
import jwt

import RPi.GPIO as GPIO
from stepper import Stepper

load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/vending-machine")
jwt_algorithm = getenv("JWT_ALGORITHM", default="HS256")
secret_key = getenv("TOKEN_SECRET_KEY_VENDING_MACHINE", default="")


pinos = dict()
pinos[1] = [26, 6, 13, 5]
pinos[2] = [21, 20, 16, 12]
pinos[3] = [1, 8, 7, 25]
motores = dict()
motores[1] = Stepper(pinos=pinos[1])
motores[2] = Stepper(pinos=pinos[2])
motores[3] = Stepper(pinos=pinos[3])
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
        GPIO.setup(pinos[product], GPIO.OUT)
        motores[product].girar_angulo(
            360, sentido_horario=True, tempo=0.008, modo="passo_completo"
        )
        for pino in pinos[product]:
            GPIO.output(pino, 0)
    except Exception as e:
        print(f"Erro: {e}")
    finally:
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
    exp = datetime.now(timezone.utc) + timedelta(days=365)
    token = jwt.encode(message, secret_key, headers={"exp": exp.timestamp()})
    sio.connect(
        url,
        socketio_path=socketio_path,
        namespaces=namespace,
        auth={"token": token},
    )
    sio.wait()


if __name__ == "__main__":
    main()
