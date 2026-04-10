from machine import Pin
from time import sleep

led = Pin(2, Pin.OUT)
led.value(0)
sleep(1)
led.value(1)

print('esperando calibração')
sleep(300)
print('calibração geral concluida')

led.value(0)

