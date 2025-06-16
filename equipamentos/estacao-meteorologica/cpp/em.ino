#include <SD.h>                   // Leitura/Escrita Shield Cartao microSD | Pino 53 (MEGA) ou Pino 10 (UNO)
#include <SPI.h>                  // Comunicação SPI (SD)
#include <Ethernet.h>             // Shield Ethernet
#include <PubSubClient.h>         // Conexão MQTT


#define LM35 A0
#define MQ7 A1
#define MQ5 A2
#define MQ2 A3
#define LED 13
#define PinoSD 53

//VARIAVEIS PARA MQTT
/*#define SSID "feira"
#define PASSWORD "feiradejogos"*/
#define MQTT_SERVER "feira-de-jogos.dev.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "EMv0"

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0x01, 0x02};
IPAddress ip{192, 168, 0, 100};
EthernetClient espClient;
PubSubClient client(espClient);

// Variáveis Globais
unsigned long tempoAnterior = 0;
const long intervalo = 400;
int n = 0;
int cartao = 0;
int MQ2G = analogRead(MQ2);
int MQ5G = analogRead(MQ5);
int MQ7G = analogRead(MQ7);  
int N1 = 0;
int N2 = 0;
int N3 = 0;
float temperatura = 0;                    // Leitura do sensor pela função


void setup() {
  delay(500);
  pinMode(PinoSD, OUTPUT);
  pinMode(LED, OUTPUT);
  pinMode(MQ2,INPUT);
  pinMode(MQ5,INPUT);
  pinMode(MQ7,INPUT);
  pinMode(LM35,INPUT);
  
  Serial.begin(9600);
  Ethernet.begin(mac,ip);
  delay(500);

  Serial.println("Inicializando SD card...");
  if (!SD.begin(PinoSD)) {
    Serial.println("Falha ao inicializar SD card");
    while (1); // Bloqueia o código se a inicialização falhar
  }
  Serial.println("SD card inicializado com sucesso!");
  digitalWrite(LED,HIGH);
  if (SD.exists("EM.txt")) {
    SD.remove("EM.txt");
  }
  delay(500);
  client.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop() {
  MQ2G = analogRead(MQ2);
  MQ5G = analogRead(MQ5);
  MQ7G = analogRead(MQ7);  
  N1 = random(110, 305);  // random()-> sorteia numero entre (min) e (max-1)
  N2 = random(168, 389);
  N3 = random(90, 198);
  temperatura = analogRead(LM35);                    // Leitura do sensor pela função
  temperatura = temperatura * 5000 / (1024 * 10);  // Conversão de volts para graus celsius

  n++;
  String EM = "BD.txt";
  File arquivo = SD.open(EM, FILE_WRITE); // Abre para escrita
  if (arquivo) {
    arquivo.print(n);
    arquivo.print(",");
    arquivo.print(MQ2G);
    arquivo.print(",");
    arquivo.print(MQ5G);
    arquivo.print(",");
    arquivo.print(MQ7G);
    arquivo.print(",");
    arquivo.print(N1);
    arquivo.print(",");
    arquivo.print(N2);
    arquivo.print(",");
    arquivo.print(N3);
    arquivo.print(",");
    arquivo.print(temperatura);
    arquivo.close();
    Serial.println("\nDados gravados com sucesso em " + EM);
  }

  if (SD.exists("EM.txt")) {
    SD.remove("EM.txt");
  }
  EM = "EM.txt";
  arquivo = SD.open(EM, FILE_WRITE); // Abre para escrita
  if (arquivo) {
    arquivo.print(n);
    arquivo.print(",");
    arquivo.print(MQ2G);
    arquivo.print(",");
    arquivo.print(MQ5G);
    arquivo.print(",");
    arquivo.print(MQ7G);
    arquivo.print(",");
    arquivo.print(N1);
    arquivo.print(",");
    arquivo.print(N2);
    arquivo.print(",");
    arquivo.print(N3);
    arquivo.print(",");
    arquivo.print(temperatura);
    arquivo.close();
    Serial.println("Dados gravados com sucesso em " + EM);
    cartao = 1;
  } else {
    Serial.println("Falha ao abrir o arquivo.");
    cartao = 0;
  }
  delay(2421);
  if (cartao == 1){
    arquivo = SD.open(EM, FILE_READ); // Abre para leitura
    String mensagem = "#";
    while (arquivo.available()) {
      //Serial.write(arquivo.read());
      mensagem = arquivo.readStringUntil('\n');
    }
    arquivo.close();
    Serial.print(mensagem);
    mensagem.length();
    char mensagem2[32];
    mensagem.toCharArray(mensagem2, mensagem.length());
    
    if (client.connected()){
      client.publish("/v0", mensagem2);
      client.loop();
    } else {
      digitalWrite(LED, LOW);
      if (client.connect(MQTT_CLIENT_ID)) {
      Serial.println("Conectado ao broker MQTT!");
      digitalWrite(LED, HIGH);
      } else {
        Serial.println("Broker MQTT: reconectando em 1s...");
      }
    }
    Serial.println(" | ");
    Serial.print(mensagem2);
  }
}
