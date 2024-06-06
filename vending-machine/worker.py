import time
import os

STATE_FILE = 'machineState.txt'


def initialize_state_file():
    if not os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'w') as f:
            f.write('w')
        print(f"Created {STATE_FILE} with initial state 'w'")


def get_ejection_state():
    with open(STATE_FILE, 'r') as f:
        return f.read(1)  # Lê apenas o primeiro caractere


def set_ejection_state(state):
    with open(STATE_FILE, 'w') as f:
        f.write(state)
    print(f"Set ejection state to: {state}")
    

def get_product():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            # Lê apenas o segundo caractere
            content = f.read(2)
            if len(content) >= 2:
                return content[1]
            else:
                # Retorna um erro se não houver caracteres suficientes no arquivo
                raise ValueError("Arquivo não contém caracteres suficientes")
    else:
        # Retorna um erro se o arquivo não existir
        raise FileNotFoundError("Arquivo não encontrado")


initialize_state_file()


def eject_product(product_id):
    print(f"Ejetando produto com o ID: {product_id}")
    time.sleep(60.0)
    set_ejection_state('s')
    updated_state = get_ejection_state()
    print("Produto ejetado com sucesso!")


def update():
    while True:
        ejectionState = get_ejection_state()
        if ejectionState == 'w':
            print('Esperando...')
        elif ejectionState == 'p':
            print('Processando...')
            productId = get_product()
            eject_product(productId)

        time.sleep(2.0)  # Espera 1 segundo entre as interações


# Chamando a função update para iniciar o loop
update()
