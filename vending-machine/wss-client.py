from os import getenv
from dotenv import load_dotenv
import asyncio
import socketio
import jwt

# from stepper import Stepper

load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/vending-machine")
jwt_algorithm = getenv("JWT_ALGORITHM", default="HS256")
secret_key = getenv("TOKEN_SECRET_KEY_VENDING_MACHINE", default="")


# stepper = Stepper(pinos=[17, 18, 22, 23])
sio = socketio.AsyncClient()


@sio.event(namespace=namespace)
async def connect():
    """
    Conexão ao servidor estabelecida
    """
    print("Conexão estabelecida")
    message = {"stateUpdate": {"state": "idle", "operation": 0}}
    await sio.emit(message, namespace=namespace)


@sio.event(namespace=namespace)
async def onStateMFA(req):
    message = {"stateUpdate": {"state": "mfa", "operation": req["operation"]}}
    await sio.emit(message, namespace=namespace)


@sio.event(namespace=namespace)
async def onStateReleasing(req):
    message = {"stateUpdate": {"state": "releasing", "operation": req["operation"]}}
    await sio.emit(message, namespace=namespace)
    # stepper.girar_angulo(360, sentido_horario=True, velocidade=0.0080, modo="passo_completo")
    message = {"stateUpdate": {"state": "idle", "operation": req["operation"]}}
    await sio.emit(message, namespace=namespace)


@sio.event(namespace=namespace)
async def disconnect():
    """
    Conexão ao servidor encerrada
    """
    print("Conexão encerrada")


async def main():
    message = {"machine": "vending-machine", "id": 0}
    token = jwt.encode(message, secret_key, algorithm=jwt_algorithm)
    await sio.connect(
        url,
        socketio_path=socketio_path,
        namespaces=namespace,
        auth={"token": token},
    )
    await sio.wait()


if __name__ == "__main__":
    asyncio.run(main())
