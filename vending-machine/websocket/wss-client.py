from os import getenv
from dotenv import load_dotenv
import asyncio
import socketio

load_dotenv()
secret_key = getenv('SECRET_KEY')

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print('connection established')

@sio.event
async def my_message(data):
    print('message received with ', data)
    await sio.emit('my response', {'response': 'my response'})

@sio.event
async def disconnect():
    print('disconnected from server')

async def main():
    await sio.connect('wss://feira-de-jogos.dev.br/sssvending-machine', socketio_path='/api/v2/machine')
    await sio.emit('state', 'ready')
    await sio.wait()

if __name__ == '__main__':
    asyncio.run(main())
