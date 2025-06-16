SHELL := /bin/bash
FIRMWARE = ESP32_GENERIC-20250415-v1.25.0.bin
DEV = /dev/ttyUSB0

all: clean install flash write-libs repl
write: write-app repl

clean:
	rm -rf venv/
	rm -f ESP*bin

install:
	sudo apt -y install python3-venv minicom
	python3 -m venv venv
	venv/bin/pip install --upgrade pip
	venv/bin/pip install esptool adafruit-ampy
	wget https://micropython.org/resources/firmware/${FIRMWARE}

flash: 
	venv/bin/esptool.py erase_flash
	venv/bin/esptool.py --baud 460800 write_flash 0x1000 ${FIRMWARE}

write-libs:
	venv/bin/ampy --port ${DEV} put .env
	venv/bin/ampy --port ${DEV} put dotenv.py
	venv/bin/ampy --port ${DEV} put install_libs.py boot.py

write-app:
	venv/bin/ampy --port ${DEV} put .env
	venv/bin/ampy --port ${DEV} put dotenv.py
	venv/bin/ampy --port ${DEV} put ntp.py
	venv/bin/ampy --port ${DEV} put boot.py
	venv/bin/ampy --port ${DEV} put main.py

repl:
	minicom -b 115200 -D ${DEV} -c on
