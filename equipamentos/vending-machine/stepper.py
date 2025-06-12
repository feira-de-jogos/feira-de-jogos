import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)


class Stepper:
    def __init__(self, pinos, passos_por_volta=400):
        self.pinos = pinos
        self.passos_por_volta = passos_por_volta

    def girar_passos(
        self, num_passos, sentido_horario=True, tempo=0.008, modo="passo_completo"
    ):
        sequencia = {
            "passo_completo": [0x03, 0x06, 0x0C, 0x09],
            "meio_passo": [0x09, 0x01, 0x03, 0x02, 0x06, 0x04, 0x0C, 0x08],
        }

        # Define a direção (horário ou anti-horário)
        if not sentido_horario:
            sequencia[modo].reverse()

        # Gira o motor
        try:
            for _ in range(num_passos):
                for valor in sequencia[modo]:
                    for i in range(4):
                        GPIO.output(self.pinos[i], (valor >> i) & 0x01)
                    time.sleep(0.007)
        except Exception as e:
            print(f"Erro durante a rotação do motor: {e}")

    def girar_angulo(self, graus, sentido_horario=True, tempo=0.008, modo="meio_passo"):
        # Calcula o número de passos com base no ângulo
        num_passos = int(abs(graus) * self.passos_por_volta / 360)
        self.girar_passos(num_passos, sentido_horario, tempo, modo)

    def desligar(self):
        """Desliga o motor e limpa os pinos GPIO."""
        GPIO.cleanup()
