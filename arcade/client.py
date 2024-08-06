from json import load
from os import getenv
from dotenv import load_dotenv
import asyncio
import socketio
import jwt


load_dotenv()
url = getenv("URL", default="wss://feira-de-jogos.dev.br")
socketio_path = getenv("SOCKETIO_PATH", default="/api/v2/machine")
namespace = getenv("NAMESPACE", default="/arcade")
jwt_algorithm = getenv("JWT_ALGORITHM", default="HS256")
secret_key = getenv("TOKEN_SECRET_KEY_ARCADE", default="")


sio = socketio.AsyncClient(logger=False, engineio_logger=True)


@sio.event(namespace="/arcade")
async def connect():
    """
    Conexão ao servidor estabelecida
    """
    pass


@sio.event(namespace="/arcade")
async def coinInsert(data):
    """
    Recebe a solicitação para inserção de moeda
    """
    try:
        arcade, coins, operation = data.values()
    except Exception as e:
        print(f"Erro: {e}")
        return

    # Inserir moedas na máquina via teclado virtual (tecla 'J')

    messageType = "coinInserted"
    messageContent = {"arcade": arcade, "operation": operation}
    await sio.emit(messageType, messageContent, namespace=namespace)


@sio.event
async def disconnect():
    """
    Conexão ao servidor encerrada
    """
    pass


async def main():
    """
    Função principal
    """
    message = {"machine": "arcade", "id": 0}
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
