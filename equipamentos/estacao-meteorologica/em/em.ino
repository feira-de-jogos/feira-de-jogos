// Bibliotecas
#include <PubSubClient.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include <Wire.h>
#include <TinyDHT.h>
#include <Adafruit_BMP280.h>
#include <WiFi.h>

// Configuração
#include "em.h"

// Objetos
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(sensor_DHT11, DHT11);
OneWire oneWire(sensor_DS18B20);
DallasTemperature sensors(&oneWire);
DeviceAddress endereco;
Adafruit_BMP280 bmp;

// Variáveis globais
String mensagem = "";
float leitura;

void ler_sensores(){
  dtostrf(analogRead(sensor_MQ2), 6, 2, MQ2G);
  dtostrf(analogRead(sensor_MQ5), 6, 2, MQ5G);
  dtostrf(analogRead(sensor_MQ7), 6, 2, MQ7G);
  dtostrf(sensors.requestTemperatures(), 6, 2, D18T);
  dtostrf(bmp.readTemperature(), 6, 2, BMPT);
  dtostrf(bmp.readPressure(), 6, 2, BMPP);
  dtostrf(bmp.readAltitude(1013.25), 6, 2, BMPA);
  dtostrf(dht.readHumidity(), 6, 2, DHTU);
  dtostrf(dht.readTemperature(1), 6, 2, DHTT);
  dtostrf(((analogRead(sensor_LM35) / 1024.0) * 3300) / 10, 6, 2, L35T);
}

String formatar_mensagem()
{
  String msg = "";

  msg += mqtt_client_id;
  msg += " ";
  msg += "MQ2G=" + String(MQ2G) + ",";
  msg += "MQ5G=" + String(MQ5G) + ",";
  msg += "MQ7G=" + String(MQ7G) + ",";
  msg += "D18T=" + String(D18T) + ",";
  msg += "BMPT=" + String(BMPT) + ",";
  msg += "BMPP=" + String(BMPP) + ",";
  msg += "BMPA=" + String(BMPA) + ",";
  msg += "DHTU=" + String(DHTU) + ",";
  msg += "DHTT=" + String(DHTT) + ",";
  msg += "L35T=" + String(L35T);
  // msg += " " + timestamp
  return msg;
}

void setup()
{
  pinMode(LED, OUTPUT);
  pinMode(sensor_MQ2, INPUT);
  pinMode(sensor_MQ5, INPUT);
  pinMode(sensor_MQ7, INPUT);
  pinMode(sensor_DHT11, INPUT);
  pinMode(sensor_DS18B20, INPUT);
  pinMode(sensor_LM35, INPUT);

  dht.begin();
  sensors.begin();
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, mqtt_port);
  Serial.begin(115200);

  digitalWrite(LED, LOW);
}

void loop()
{
  ler_sensores();

  if (client.connected())
  {
    mensagem = formatar_mensagem();
    client.publish(topico, mensagem.c_str());

    client.loop();
  }
  else
  {
    digitalWrite(LED, LOW);
    if (client.connect(mqtt_client_id))
    {
      Serial.println("Conectado ao broker MQTT!");
      digitalWrite(LED, HIGH);
    }
    else
    {
      Serial.println("Broker MQTT: reconectando em 1s...");
    }
  }

  delay(1000);
}
