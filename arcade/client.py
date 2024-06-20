import asyncio
import socketio

sio = socketio.AsyncClient()


@sio.event(namespace="/arcade")
async def connect():
    print("connection established")
    await sio.emit("state", "idle", namespace="/arcade")


@sio.event(namespace="/arcade")
async def state(data):
    print("message received with ", data)


@sio.event
async def disconnect():
    print("disconnected from server")


async def main():
    await sio.connect("https://feira-de-jogos.dev.br", socketio_path="/api/v2/machine/", namespaces=["/arcade"], transports=['websocket'])
    await sio.wait()


if __name__ == "__main__":
    asyncio.run(main())
