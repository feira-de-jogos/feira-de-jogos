// Bibliotecas
#include <Arduino.h>
#include <string.h>
#include <PubSubClient.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include <Wire.h>
#include <TinyDHT.h>
#include <Adafruit_BMP280.h>
#include <WiFi.h>


//VARIAVEIS PARA MQTT
#define SSID "feira"
#define PASSWORD "feiradejogos"
#define MQTT_SERVER "feira-de-jogos.dev.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "EMv0"
String MENSAGEM = "";
String TOPICO = "/em/v0";

#define MQ2G "0000.00"
#define MQ5G "0000.00"
#define MQ7G "0000.00"
#define D18T "0000.00"
#define BMPT "0000.00"
#define BMPP "0000.00"
#define BMPA "0000.00"
#define DHTU "0000.00"
#define DHTT "0000.00"
#define L35T "0000.00"



// DEFINIÇÕES DE REDE/MQTT
WiFiClient espClient;
PubSubClient client(espClient);


// Pré-definições
int Sensor_MQ2 = 36;        // 
int Sensor_MQ5 = 39;        // 
int Sensor_MQ7 = 34;        // Monóxido de Carbono (CO)
int Sensor_DHT11 = 35;      // Umidade e Temperatura
int Sensor_DS18B20 = 32;    // Temperatura
int Sensor_LM35 = 33;         // Temperatura

DHT dht(Sensor_DHT11, DHT11);
OneWire oneWire(Sensor_DS18B20);
DallasTemperature sensors(&oneWire);
DeviceAddress endereco;
Adafruit_BMP280 bmp;

// Periféricos
int LED = 2;                        // LED Built-in
float leitura[10] = {0,0,0,0,0,0,0,0,0,0};


// Variáveis Globais
unsigned long tempoAnterior = 0;
const long intervalo = 400;

void setup() {
  pinMode(LED,OUTPUT);
  pinMode(Sensor_MQ2,INPUT);
  pinMode(Sensor_MQ5,INPUT);
  pinMode(Sensor_MQ7,INPUT);
  pinMode(Sensor_DHT11,INPUT);
  pinMode(Sensor_DS18B20,INPUT);
  pinMode(Sensor_LM35,INPUT);
  WiFi.begin(SSID, PASSWORD);
  client.setServer(MQTT_SERVER, MQTT_PORT);
  sensors.begin();
  digitalWrite(LED, LOW);
  dht.begin();
  Serial.begin(115200);
}

void loop() {
  unsigned long tempoAtual = millis();
  if (tempoAtual - tempoAnterior >= intervalo) {
    tempoAnterior = tempoAtual;
    leitura[1] = analogRead(Sensor_MQ5);
    leitura[2] = analogRead(Sensor_MQ7);
    leitura[3] = sensors.requestTemperatures();
    leitura[4] = bmp.readTemperature();
    leitura[5] = bmp.readPressure();
    leitura[6] = bmp.readAltitude(1013.25);
    leitura[7] = dht.readHumidity();
    leitura[8] = dht.readTemperature(1);
    leitura[9] = ((analogRead(Sensor_LM35)/1024.0) * 3300)/10;   // Leitura LM35 em ºC

    Serial.println("----------------");
    Serial.print("Tempo atual = ");
    Serial.println(tempoAtual);

    dtostrf(leitura[0], 6, 2, MQ2G);
    dtostrf(leitura[1], 6, 2, MQ5G);
    dtostrf(leitura[2], 6, 2, MQ7G);
    dtostrf(leitura[3], 6, 2, D18T);
    dtostrf(leitura[4], 6, 2, BMPT);
    dtostrf(leitura[5], 6, 2, BMPP);
    dtostrf(leitura[6], 6, 2, BMPA);
    dtostrf(leitura[7], 6, 2, DHTU);
    dtostrf(leitura[8], 6, 2, DHTT);
    dtostrf(leitura[9], 6, 2, L35T);
    Serial.println("----------------");
    /*Serial.print("Leitura MQ2: ");
    Serial.println(leitura[0]);
    Serial.print("Captura MQ5: ");
    Serial.println(leitura[1]);
    Serial.print("Captura MQ7: ");
    Serial.println(leitura[2]);
    Serial.print("Temperatura DS18B20: ");
    Serial.println(leitura[3]);
    Serial.print("Temperatura BMP280: ");
    Serial.println(leitura[4]);
    Serial.print("Pressão BMP280: ");
    Serial.println(leitura[5]);
    Serial.print("Altitude BMP280: ");
    Serial.println(leitura[6]);
    Serial.print("Umidade DHT11: ");
    Serial.println(leitura[7]);
    Serial.print("Temperatura DHT11: ");
    Serial.println(leitura[8]);
    Serial.print("Temperatura LM35: ");
    Serial.println(L35T);
    Serial.println("----------------");*/
  }  

  if (!client.connected())
  {
    digitalWrite(LED, LOW);
    if (client.connect(MQTT_CLIENT_ID))
    {
      Serial.println("Conectado ao broker MQTT!");
      digitalWrite(LED, HIGH);
    } else {
      Serial.print("Broker MQTT: reconectando em 5s...");
      delay(1000);
    }
  } else {
    client.loop();
  }
  
  MENSAGEM = MQ2G + MQ5G + MQ7G + D18T + BMPT + BMPP + BMPA + DHTU + DHTT + L35T;
  client.publish(TOPICO, MENSAGEM);

}
