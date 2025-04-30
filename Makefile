SHELL := /bin/bash
FIRMWARE = ESP32_GENERIC-20250415-v1.25.0.bin
DEV = /dev/ttyUSB0

all: clean install flash repl

clean:
	rm -rf venv/
	rm -f ESP*bin

install:
	sudo apt install python3-venv minicom
	python3 -m venv venv
	source venv/bin/activate
	pip install --upgrade pip
	pip install esptool adafruit-ampy
	wget https://micropython.org/resources/firmware/${FIRMWARE}

flash: 
	esptool.py erase_flash
	esptool.py --baud 460800 write_flash 0x1000 ${FIRMWARE}

repl:
	minicom -b 115200 -D ${DEV} -c on

write:
	ampy --port ${DEV} put boot.py
	ampy --port ${DEV} put main.py
