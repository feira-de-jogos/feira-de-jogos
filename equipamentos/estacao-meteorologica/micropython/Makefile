COMMAND = ampy
PORT = /dev/ttyUSB0
BAUD = 115200
SOURCE = v0
FILES = $(shell ls $(SOURCE))
DEST = libs

ls:
	@echo "Listing files on the device:"
	@$(COMMAND) --port $(PORT) --baud $(BAUD) ls
	@$(COMMAND) --port $(PORT) --baud $(BAUD) ls libs

copy: libs main

libs:
	@echo "Removing existing libs/ directory on the device..."
	@$(COMMAND) --port $(PORT) --baud $(BAUD) rmdir libs

	@echo "Uploading files to libs/ directory on the device:"
	@$(COMMAND) --port $(PORT) --baud $(BAUD) mkdir libs
	
	@for file in $(FILES); do \
		echo "- Uploading $$file to libs/$$file..."; \
		$(COMMAND) --port $(PORT) --baud $(BAUD) put $(SOURCE)/libs/$$file $(DEST)/$$file; \
	done

main:
	@echo "Uploading main files to the device:"
	
	@echo "- Uploading boot.py...";
	@$(COMMAND) --port $(PORT) --baud $(BAUD) put $(SOURCE)/boot.py boot.py

	@echo "- Uploading main.py"
	#@$(COMMAND) --port $(PORT) --baud $(BAUD) put $(SOURCE)/main.py main.py
	
	@echo "- Uploading config.env"
	#@$(COMMAND) --port $(PORT) --baud $(BAUD) put $(SOURCE)/config.env config.env
	