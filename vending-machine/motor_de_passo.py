import RPi.GPIO as GPIO
import time

class MotorDePasso:
    def __init__(self, pinos, passos_por_volta=360):
        """
        Inicializa o motor de passo bipolar.

        Args:
            pinos (list): Lista de pinos GPIO conectados aos fios do motor (A+, A-, B+, B-).
            passos_por_volta (int, optional): Número de passos para uma volta completa (padrão: 360).
        """
        self.pinos = pinos
        self.passos_por_volta = passos_por_volta

        # Configuração dos pinos GPIO
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pinos, GPIO.OUT)

    def girar_passos(self, num_passos, sentido_horario=True, velocidade=1, modo="passo_completo"):
        """
        Gira o motor de passo um número específico de passos.

        Args:
            num_passos (int): Número de passos a serem dados.
            sentido_horario (bool): True para girar no sentido horário, False para anti-horário.
            velocidade (float, optional): Velocidade de rotação (0 a 1, padrão: 1).
            modo (str, optional): Modo de passo (padrão: "passo_completo").
                Opções: "passo_completo", "meio_passo", "micro_passo".
        """
        sequencia = {
            "passo_completo": [0x09, 0x01, 0x03, 0x02],
            "meio_passo": [0x09, 0x08, 0x0c, 0x04, 0x06, 0x02, 0x03, 0x01],
            "micro_passo": [0x09, 0x0a, 0x02, 0x06, 0x04, 0x05, 0x01, 0x09,
                            0x09, 0x0a, 0x02, 0x06, 0x04, 0x05, 0x01, 0x09]
        }

        if modo not in sequencia:
            raise ValueError("Modo de passo inválido. Escolha entre 'passo_completo', 'meio_passo' ou 'micro_passo'.")

        # Define a direção (horário ou anti-horário)
        if not sentido_horario:
            sequencia[modo].reverse()

        # Gira o motor
        try:
            for _ in range(num_passos):
                for valor in sequencia[modo]:
                    for i in range(4):
                        GPIO.output(self.pinos[i], (valor >> i) & 0x01)
                    time.sleep(velocidade)
        except Exception as e:
            print(f"Erro durante a rotação do motor: {e}")

    def girar_angulo(self, graus, sentido_horario=True, velocidade=1, modo="passo_completo"):
        """
        Gira o motor de passo para um ângulo específico.

        Args:
            graus (float): Ângulo de rotação em graus.
            sentido_horario (bool): True para girar no sentido horário, False para anti-horário.
            velocidade (float, optional): Velocidade de rotação (0 a 1, padrão: 1).
            modo (str, optional): Modo de passo (padrão: "passo_completo").
                Opções: "passo_completo", "meio_passo", "micro_passo".
        """
        # Calcula o número de passos com base no ângulo
        num_passos = int(abs(graus) * self.passos_por_volta / 360)
        self.girar_passos(num_passos, sentido_horario, velocidade, modo)

    def desligar(self):
        """Desliga o motor e limpa os pinos GPIO."""
        GPIO.cleanup()

# Exemplo de uso:
if __name__ == "__main__":
    # Crie uma instância do motor de passo (ajuste os pinos conforme necessário)
    pinos_motor = [17, 18, 22, 23]
    motor = MotorDePasso(pinos=pinos_motor)

    try:
        # Gire 90 graus no sentido horário com velocidade padrão (modo meio passo)
        motor.girar_angulo(graus=90, sentido_horario=True, modo="meio_passo")

        # Dê 200 passos no sentido anti-horário com velocidade reduzida (modo micro passo)
        motor.girar_passos(num_passos=200, sentido_horario=False, velocidade=0.01, modo="micro_passo")

    finally:
        # Desligue o motor e limpe os pinos GPIO
        motor.desligar()