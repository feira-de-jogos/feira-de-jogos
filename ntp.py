import dotenv
from time import gmtime
import socket
import struct
from machine import RTC


dotenv.load_env()

def time():
    NTP_QUERY = bytearray(48)
    NTP_QUERY[0] = 0x1B
    addr = socket.getaddrinfo(dotenv.NTP_POOL, 123)[0][-1]
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.settimeout(int(dotenv.NTP_TIMEOUT))
        s.sendto(NTP_QUERY, addr)
        msg = s.recv(48)
    finally:
        s.close()
    val = struct.unpack("!I", msg[40:44])[0]

    MIN_NTP_TIMESTAMP = 3913056000
    if val < MIN_NTP_TIMESTAMP:
        val += 0x100000000

    EPOCH_YEAR = gmtime(0)[0]
    if EPOCH_YEAR == 2000:
        NTP_DELTA = 3155673600
    elif EPOCH_YEAR == 1970:
        NTP_DELTA = 2208988800
    else:
        raise Exception("Unsupported epoch: {}".format(EPOCH_YEAR))

    return val - NTP_DELTA

def settime():
    t = time()
    tm = gmtime(t)
    RTC().datetime((tm[0], tm[1], tm[2], tm[6] + 1, tm[3], tm[4], tm[5], 0))
