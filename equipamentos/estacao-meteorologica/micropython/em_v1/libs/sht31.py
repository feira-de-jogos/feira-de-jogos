# Código retirado de: https://github.com/Akarapon1909/ETT-Smart-Farm-MicroPython/blob/main/ETSmartFarm/ETSmartFarm.py
import time

class SHT31:
    def __init__(self, i2c, addr=0x45):
        if i2c is None:
            raise ValueError('I2C object is required')
        self._i2c = i2c
        self._addr = addr

    def _send_command(self, command):
        self._i2c.writeto(self._addr, command)

    def _read_data(self, num_bytes):
        return self._i2c.readfrom(self._addr, num_bytes)

    def _read_raw_data(self):
        self._send_command(b'\x24\x00')
        time.sleep_ms(15)
        data = self._read_data(6)
        if len(data) != 6:
            raise RuntimeError("Failed to read data from SHT31 sensor")
        temp_raw = data[0] << 8 | data[1]
        hum_raw = data[3] << 8 | data[4]
        return temp_raw, hum_raw

    def read(self):
        """Returns temperature and humidity as a tuple"""
        try:
            temp = self.temperature()
            humi = self.humidity()
            return round(temp, 1), round(humi, 1)
        except Exception as e:
            print("[SHT31] Error:", e)
            return None, None

    def temperature(self):
        temp_raw, _ = self._read_raw_data()
        return -45 + (175 * (temp_raw / 65535.0))

    def humidity(self):
        _, hum_raw = self._read_raw_data()
        return 100 * (hum_raw / 65535.0)

