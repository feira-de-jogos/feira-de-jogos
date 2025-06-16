// Wi-Fi
const char *ssid = "em";
const char *password = "estacao-meteorologica";

// MQTT
const char *mqtt_server = "feira-de-jogos.dev.br";
const int mqtt_port = 1883;
const char *mqtt_client_id = "EMv0";
const char *topico = "em/v0";

// Pinagem
int LED = 2;             // LED embutido
int sensor_MQ2 = 36;     // gás inflamável
int sensor_MQ5 = 39;     // GLP e gás natural
int sensor_MQ7 = 34;     // monóxido de carbono (CO)
int sensor_DHT11 = 35;   // umidade e temperatura
int sensor_DS18B20 = 32; // temperatura
int sensor_LM35 = 33;    // temperatura

// Dados dos sensores
char MQ2G[8] = "0000.00";
char MQ5G[8] = "0000.00";
char MQ7G[8] = "0000.00";
char D18T[8] = "0000.00";
char BMPT[8] = "0000.00";
char BMPP[8] = "0000.00";
char BMPA[8] = "0000.00";
char DHTU[8] = "0000.00";
char DHTT[8] = "0000.00";
char L35T[8] = "0000.00";
