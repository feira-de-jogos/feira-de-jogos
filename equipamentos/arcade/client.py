from os import getenv
from dotenv import load_dotenv
import socketio
from datetime import datetime, timezone, timedelta
import jwt
import asyncio

from evdev import UInput, ecodes as e
from time import sleep


load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/arcade")
secret_key = getenv("TOKEN_SECRET_KEY_ARCADE", default="")
id = getenv("ARCADE_ID", default="0")


sio = socketio.AsyncClient(logger=False, engineio_logger=True)
ui = UInput(name="Banco Central")

connected = False


@sio.event(namespace="/arcade")
async def connect():
    """
    Conexão ao servidor estabelecida
    """
    global connected
    connected = True


@sio.event(namespace="/arcade")
async def coinInsert(data):
    """
    Recebe a solicitação para inserção de moeda
    """
    try:
        arcade, coins, operation = data.values()
        arcade = str(arcade)
    except:
        return

    if arcade == id:
        for _ in range(coins):
            # Inserir moeda
            ui.write(e.EV_KEY, e.KEY_J, 1)
            ui.syn()
            await asyncio.sleep(0.250)
            ui.write(e.EV_KEY, e.KEY_J, 0)
            ui.syn()
            
            # Apertar Start
            ui.write(e.EV_KEY, e.KEY_K, 1)
            ui.syn()
            await asyncio.sleep(0.250)
            ui.write(e.EV_KEY, e.KEY_K, 0)
            ui.syn()

        messageType = "coinInserted"
        messageContent = {"arcade": arcade, "operation": operation}
        await sio.emit(messageType, messageContent, namespace=namespace)


@sio.event(namespace="/arcade")
async def disconnect():
    """
    Conexão ao servidor encerrada
    """
    global connected
    connected = False


async def ping_task(message):
    """
    Loop assíncrono responsável por enviar pings
    """
    while True:
        if connected:
            await sio.emit("ping", message, namespace=namespace)
        else:
            print("Aguardando conexão ao namespace...")
        await asyncio.sleep(1)


async def main():
    """
    Função principal
    """
    message = {"machine": "arcade", "id": id}
    exp = datetime.now(timezone.utc) + timedelta(days=365)
    token = jwt.encode(message, secret_key, headers={"exp": exp.timestamp()})

    await sio.connect(
        url,
        socketio_path=socketio_path,
        namespaces=[namespace],
        auth={"token": token},
    )

    asyncio.create_task(ping_task(message))
    await sio.wait()


if __name__ == "__main__":
    asyncio.run(main())
