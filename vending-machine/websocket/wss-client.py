from os import getenv
from dotenv import load_dotenv
import asyncio
import socketio
import jwt

load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/vending-machine")
jwt_algorithm = getenv("JWT_ALGORITHM", default="HS256")
secret_key = getenv("TOKEN_SECRET_KEY_VENDING_MACHINE", default="")

sio = socketio.AsyncClient()


@sio.event
async def connect():
    print("connection established")


@sio.event
async def onState(data):
    print("message received with ", data)
    await sio.emit("my response", {"response": "my response"})


@sio.event
async def disconnect():
    print("disconnected from server")


async def main():
    token = jwt.encode(
        {"machine": "vending-machine", "id": 0}, secret_key, algorithm=jwt_algorithm
    )
    await sio.connect(
        url,
        socketio_path=socketio_path,
        namespaces=namespace,
        auth={"token": token},
    )
    await sio.emit("state", "ready", namespace=namespace)
    await sio.wait()


if __name__ == "__main__":
    asyncio.run(main())
