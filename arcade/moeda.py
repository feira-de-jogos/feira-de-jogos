from evdev import UInput, ecodes as e
from time import sleep

ui = UInput(name='Banco Central')

for i in range(4):
    print(i)
    ui.write(e.EV_KEY, e.KEY_J, 1)  # Press the key
    ui.syn() # press 'j'
    sleep(0.250)
    ui.write(e.EV_KEY, e.KEY_J, 0)  # Release the key
    ui.syn() # release 'j'
    sleep(2)

print('closing game')
ui.write(e.EV_KEY, e.KEY_J, 2)  # Hold the key
ui.write(e.EV_KEY, e.KEY_K, 1)  # Press the key
ui.syn() # hold 'j' and press 'k'
ui.close()
