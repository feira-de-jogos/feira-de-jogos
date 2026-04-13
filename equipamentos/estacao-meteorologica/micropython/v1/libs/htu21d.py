"""
A parte de inicialização I2C foi alterada.
O I2C será inicializado dentro do main.py e será carregado aqui.

A função '_issue_measurement' foi alterada.
"""


from machine import I2C, Pin
import time

class HTU21D(object):
    ADDRESS = 0x40
    ISSUE_TEMP_ADDRESS = 0xE3
    ISSUE_HU_ADDRESS = 0xE5

    def __init__(self, i2c
                 ):
        self.i2c = i2c


    def _crc_check(self, value):
        """CRC check data
        Notes:
            stolen from https://github.com/sparkfun/HTU21D_Breakout

        Args:
            value (bytearray): data to be checked for validity
        Returns:
            True if valid, False otherwise
        """
        remainder = ((value[0] << 8) + value[1]) << 8
        remainder |= value[2]
        divsor = 0x988000

        for i in range(0, 16):
            if remainder & 1 << (23 - i):
                remainder ^= divsor
            divsor >>= 1

        if remainder == 0:
            return True
        else:
            return False

    def _issue_measurement(self, write_address):
        # envia comando de medição
        self.i2c.writeto(self.ADDRESS, bytes([write_address]))
        time.sleep_ms(50)

        # recebe resposta (3 bytes)
        data = bytearray(3)
        self.i2c.readfrom_into(self.ADDRESS, data)

        if not self._crc_check(data):
            raise ValueError("CRC error")

        raw = (data[0] << 8) | data[1]
        raw &= 0xFFFC
        return raw

    @property
    def temperature(self):
        """Calculate temperature"""
        raw = self._issue_measurement(self.ISSUE_TEMP_ADDRESS)
        return -46.85 + (175.72 * raw / 65536)

    @property
    def humidity(self):
        """Calculate humidity"""
        raw =  self._issue_measurement(self.ISSUE_HU_ADDRESS)
        return -6 + (125.0 * raw / 65536)

    def test(self):
        print("estoy dentro")

