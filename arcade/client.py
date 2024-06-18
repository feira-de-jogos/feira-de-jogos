import asyncio
import socketio

sio = socketio.AsyncClient()


@sio.event
async def connect():
    print("connection established")
    await sio.emit("state", "idle")


@sio.on("state")
async def state(data):
    print("message received with ", data)


@sio.event
async def disconnect():
    print("disconnected from server")


async def main():
    await sio.connect("http://localhost:8080", transports=["websocket"])
    await sio.wait()


if __name__ == "__main__":
    asyncio.run(main())
