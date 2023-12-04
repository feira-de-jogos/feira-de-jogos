// BIBLIOTECAS
#include <LiquidCrystal.h> // Display LCD
#include <Keypad.h>        // Teclado Matricial
#include <Ethernet.h>      // Modulo Ethernet
#include <PubSubClient.h> // Conexão MQTT
#include <Stepper.h> // Conexão MQTT

// VARIAVEIS PARA MQTT
const char *mqtt_server = "191.36.8.49";
const int mqtt_port = 1883; // Porta padrão do MQTT
const char *mqtt_user = "feira";
const char *mqtt_password = "feira";
const char *mqtt_topic_publish = "debito/0001";
const char *mqtt_topic_subscribe = "0001/+";
const int Step1 = 800;  // Passo por Volta do Motor de Passo
const int Step2 = 800;  // Passo por Volta do Motor de Passo
const int Step3 = 800;  // Passo por Volta do Motor de Passo
const int Step4 = 800;  // Passo por Volta do Motor de Passo
const int Step6 = 800;  // Passo por Volta do Motor de Passo
const int Step7 = 800;  // Passo por Volta do Motor de Passo
Stepper Motor1(Step1, 25, 24, 23, 22);  //Stepper Motor1(Step1, 25, 24, 23, 22); menor torque //
Stepper Motor2(Step2, 29, 28, 27, 26);
Stepper Motor3(Step3, 37, 36, 35, 34);
Stepper Motor4(Step4, 33, 32, 31, 30);
Stepper Motor6(Step6, 45, 44, 43, 42);
Stepper Motor7(Step7, 49, 48, 47, 46);

// DEFINIÇÕES DE REDE/MQTT
byte mac[] = {0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xEF};
EthernetClient ethClient;
PubSubClient client(ethClient);

// DEFINIÇÕES DO DISPLAY: >> EN, RS, DB4, DB5, DB6, DB7 >> PSB (HIGH) >> R/W (LOW) >> V0 (NC)
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

// CONFIGURAÇÃO DO TECLADO MATRICIAL [4 x 3]
const byte LINHAS = 4;
const byte COLUNAS = 3;
const char TECLAS_MATRIZ[LINHAS][COLUNAS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'*', '0', '#'}
};
byte PINOS_LINHAS[LINHAS] = {20, 19, 18, 17}; // Pinos de Conexão (linhas)
byte PINOS_COLUNAS[COLUNAS] = {16, 15, 14};   // Pinos de Conexão (colunas)

Keypad keypad = Keypad(makeKeymap(TECLAS_MATRIZ), PINOS_LINHAS, PINOS_COLUNAS, LINHAS, COLUNAS);

// DEFINIÇÃO DA SENHA DE ACESSO
String usuario = "";    // Usuario com 4 digitos
String senha = "";   // Senha com 4 digitos
String maquina = "0001"; // Indentificador da maquina (4 digitos)
String produto = "";    // Produto selecionado para compra (4 digitos)
String MaqID = "1010";
String Informacoes[] = {"0", "0", maquina, "0"};
String mensagem[] = {MaqID, "0", "0", "0"};
bool umavez = false;
String receivedMessage = "";

// Definições de estoque
int Mola1Qnt = 5;
int Mola2Qnt = 5;
int Mola3Qnt = 5;
int Mola4Qnt = 5;
int Mola6Qnt = 5;
int Mola7Qnt = 5;
int Mola8Qnt = 5;
int Mola9Qnt = 5;

// MÉTODO PARA IMPRIMIR LINHA NO DISPLAY
void LCD_Linha(int a, int b, String texto)
{
  lcd.setCursor(a, b); // Posiciona o cursor na Coluna a x Linha b >> L1(0,0), L2(0,2), L3(8,0), L4(8,2)
  lcd.print(texto);    // Imprime o texto na posição (a,b) do LCD >> Tamanho máximo: 16 caracteres/linha
}

void LCD_Inicial()
{
  lcd.clear();  
  LCD_Linha(0, 0, " DISPENSER V0.5 ");
  LCD_Linha(0, 2, "> Projeto Ensino");
  LCD_Linha(8, 0, "> BEM-VINDO(A)! ");
  LCD_Linha(8, 2, "________________");
  delay(1000);
}

void LCD_Selecao()
{
  lcd.clear();
  LCD_Linha(0, 0, "Ola! Selecione o");
  LCD_Linha(0, 2, "produto de 1 a 6");
  LCD_Linha(8, 0, "'#' p/ Confirmar");
  LCD_Linha(8, 2, "'*' p/ Cancelar!");
  lcd.noBlink();
  delay(500);
}

void LCD_Identificacao()
{
  lcd.clear();
  LCD_Linha(0, 0, "> Bem-vindo(a)! ");
  LCD_Linha(0, 2, "Insira seu ID de");
  LCD_Linha(8, 0, "usuario c/ 4 dig");
  LCD_Linha(8, 2, "ID:             ");
  lcd.noBlink();
  delay(500);
}

void LCD_Requisicao()
{
  lcd.clear();
  LCD_Linha(0, 0, " DISPENSER V0.5 ");
  LCD_Linha(0, 2, "Senha do Usuario");
  LCD_Linha(8, 0, "com (4 digitos):");
  LCD_Linha(8, 2, "SENHA:          ");
  lcd.blink();
  delay(500);
}

void LCD_Validacao()
{
  lcd.clear();
  LCD_Linha(0, 0, "COMPRA EFETIVADA");
  LCD_Linha(0, 2, "AGUARDE LIBERAR!");
  LCD_Linha(8, 0, "RETIRE ABAIXO   ");
  LCD_Linha(8, 2, " >> OBRIGADO! <<");
  lcd.noBlink();
  delay(500);
}

void LCD_Erro()
{
  lcd.clear();
  LCD_Linha(0, 0, " Solicitacao nao");
  LCD_Linha(0, 2, "atendida. Falha ");
  LCD_Linha(8, 0, "na autenticacao ");
  LCD_Linha(8, 2, "Retornando......");
  lcd.noBlink();
  delay(3000);
}

void LCD_ErroSelecao()
{
  lcd.clear();
  LCD_Linha(0, 0, "Selecao Invalida!");
  LCD_Linha(0, 2, "Favor, selecionar");
  LCD_Linha(8, 0, "um produto entre");
  LCD_Linha(8, 2, "1 a 6");
  lcd.noBlink();
  delay(3000);
}

void LCD_ErroSaldo(){
  lcd.clear();
  LCD_Linha(0, 0, "Tentativa");
  LCD_Linha(0, 2, "Invalida");
  LCD_Linha(8, 0, "Saldo");
  LCD_Linha(8, 2, "Insuficiente!");
  lcd.noBlink();
  delay(3000);
}

byte AH1[8] = {0x09, 0x01, 0x03, 0x02, 0x06, 0x04, 0x0c, 0x08};
byte AH2[8] = {0x90, 0x10, 0x30, 0x20, 0x60, 0x40, 0xc0, 0x80};
byte HR1[8] = {0x08, 0x0c, 0x04, 0x06, 0x02, 0x03, 0x01, 0x09};
byte HR2[8] = {0x80, 0xc0, 0x40, 0x60, 0x20, 0x30, 0x10, 0x90};
byte steps = 50; // change the parameter to change the angle of the stepper
int LED = 21;
int BZZ = 0;

void M1()
{
  Motor1.step(Step1);
}

void M2()
{
  Motor2.step(Step2);
}

void M3()
{
  Motor3.step(Step3);
}

void M4()
{
  Motor4.step(Step4);
}

void M6()
{
  Motor6.step(Step6);
}

void M7()
{
  Motor7.step(Step7);
}

void setup()
{
  // Inicialização do Display
  pinMode(A5, OUTPUT);
  pinMode(A4, OUTPUT);
  pinMode(A3, OUTPUT);
  pinMode(A2, OUTPUT);
  pinMode(A1, OUTPUT);
  pinMode(A0, OUTPUT);
  lcd.begin(16, 4); // Configura o tamanho do display
  LCD_Inicial();    // Teste do display
  delay(2000);
  Motor1.setSpeed(4);
  Motor2.setSpeed(4);
  Motor3.setSpeed(4);
  Motor4.setSpeed(4);
  Motor6.setSpeed(4);
  Motor7.setSpeed(4);

  DDRA = 0xff;
  PORTA = 0x00;
  DDRC = 0xff;
  PORTC = 0x00;
  DDRL = 0xff;
  PORTL = 0x00;

  // Inicialização da Serial e Ethernet
  Serial.begin(9600);

  if (Ethernet.begin(mac) == 0)
  {
    Serial.println("Falha ao obter um endereço IP via DHCP, reiniciando...");
    delay(5000);
  }

  while (Ethernet.linkStatus() == LinkOFF)
  {
    Serial.println("Aguardando a conexão Ethernet...");
    delay(500);
  }

  Serial.println("Conectado à rede Ethernet!");

  // Configura o servidor MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setSocketTimeout(120);
  client.setKeepAlive(120);

  // Conecta ao broker MQTT
  reconnect();

  digitalWrite(A5,LOW);
  digitalWrite(A4,LOW);
  digitalWrite(A3,LOW);
  digitalWrite(A2,LOW);
  digitalWrite(A1,LOW);
  digitalWrite(A0,LOW);
}

String codigo = "Codigo: ";
// char * mensagem[] = {MaqID,"0","0","0"};
boolean inicio = false;
boolean selecao = false;

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }

  // Mantém a conexão MQTT ativa
  client.loop();

  while (umavez == false)
  { // loop pra chamar 1 vez a função no código(para testes)
    //FinalizarCompra();
    umavez = true;
  }

  // Serial.println("EXTERNO!");
  /*// char senha = "";
    char codigo = '*';
    //char leitura = teclado.getKey(); // Atribui a variavel a leitura do teclado
    if (leitura)
    {
    inicio = true;
    };

    while (inicio == true) // Se alguma tecla foi pressionada
    {
    Serial.print("LEITURA >> ");
    Serial.println(leitura);
    LCD_Selecao();
    delay(1000);
    // char opcao = teclado.getKey(); // Atribui a variavel a leitura do teclado
    if (opcao)                     // Se nova tecla foi pressionada
    {
      Serial.print("OPCAO >> ");
      Serial.println(opcao);
      delay(1000);
      if (opcao == '0' || opcao == '9' || opcao == '*' || opcao == '#')
      {
        lcd.clear();
        lcd.setCursor(0, 0);  // Posiciona o cursor na Coluna a x Linha b >> L1(0,0), L2(0,2), L3(8,0), L4(8,2)
        lcd.print(" TESTE "); // Imprime o texto na posição (a,b) do LCD >> Tamanho máximo: 16 caracteres/linha
        lcd.noBlink();
        Serial.println("Erro Selecao");
        inicio = false;
        delay(3000);
        break;
      }
      else
      {
        mensagem[2] = opcao;
        // PRODUTO SELECIONADO
        LCD_Identificacao();
        for (int i = 1; i < 5; i++)
        {
          char leitura = teclado.getKey(); // Atribui a variavel a leitura do teclado
          usuario += leitura;
        }
        mensagem[3] = usuario;

        // CÓDIGO DIGITADO
        LCD_Requisicao();
        for (int i = 1; i < 5; i++)
        {
          char leitura = teclado.getKey(); // Atribui a variavel a leitura do teclado
          senha += leitura;
        }
        mensagem[4] = senha;
      }
    }
    }*/
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Mensagem recebida no tópico: ");
  Serial.println(topic);

  Serial.print("Conteúdo: ");
  receivedMessage = ""; // Clear the previous message

  LCD_Requisicao();

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
    receivedMessage += (char)payload[i]; // Concatenate the characters to the message
    if (i == length - 1)
    {
      Serial.print("\n");
    }
  }
  if (receivedMessage == "200")
  {
    Serial.println("Autorização confirmada");
    LCD_Validacao();
    if (produto == "0001")
    {
      //for (int w = 0; w < 2; w++) // 400 half-step/revolucao
      //{
      digitalWrite(A5,HIGH);
      M1();
      delay(1000);
      digitalWrite(A5,LOW);
      //}
      inicio = false;

      Mola1Qnt -= 1;
      Serial.println(Mola1Qnt);
    }
    else if (produto == "0002")
    {
      //for (int w = 0; w < 2; w++) // 400 half-step/revolucao
      //{
        digitalWrite(A4,HIGH);
        M2();
        delay(1000);
        digitalWrite(A4,LOW);
      //}
      inicio = false;

      Mola2Qnt -= 1;
      Serial.println(Mola2Qnt);
    }
    else if (produto == "0003")
    {
      //for (int w = 0; w < 2; w++) // 400 half-step/revolucao
      //{
      digitalWrite(A3,HIGH);
      M3();
      delay(1000);
      digitalWrite(A3,LOW);
      //}
      inicio = false;

      Mola3Qnt -= 1;
      Serial.println(Mola3Qnt);
    }
    else if (produto == "0004")
    {
      //for (int w = 0; w < 2; w++) // 400 half-step/revolucao
      //{
      digitalWrite(A2,HIGH);
      M4();
      delay(1000);
      digitalWrite(A2,LOW);
      //}
      inicio = false;

      Mola4Qnt -= 1;
      Serial.println(Mola4Qnt);
    }
    else if (produto == "0006")
    {
      //for (int w = 0; w < 2; w++) // 400 half-step/revolucao
      //{
      digitalWrite(A0,HIGH);
      M6();
      delay(1000);
      digitalWrite(A0,LOW);
      //}
      inicio = false;

      Mola6Qnt -= 1;
      Serial.println(Mola6Qnt);
    }
    else if (produto == "0007")
    {
      //for (int w = 0; w < 2; w++) // 400 half-step/revolucao
      //{
      digitalWrite(A0,HIGH);
      M7();
      delay(1000);
      digitalWrite(A0,LOW);
      //}
      inicio = false;

      Mola7Qnt -= 1;
      Serial.println(Mola7Qnt);
    }
    InicioDaCompra();
  }
  else if (receivedMessage == "400")
  {
    Serial.println("Dados Enviados Fora do Padrão( Dados maiores que 20 caracteres)");
    InicioDaCompra();
    // Dados Enviados Fora do Padrão( Dados maiores que 20 caracteres)
  }
  else if (receivedMessage == "401")
  {
    Serial.println("Usuário ou Senha Incorreta");
    LCD_Erro();
        InicioDaCompra();
    // Usuário ou Senha Incorreta
  }else if(receivedMessage == "402"){
    LCD_ErroSaldo();
    Serial.println("Saldo Insuficiente");
        InicioDaCompra();
  }
  else if (receivedMessage == "403")
  {
    LCD_ErroSelecao();
    Serial.println("Produto sem estoque");
    InicioDaCompra();
    // Produto sem estoque ou Saldo Insuficiente
  }
  else if (receivedMessage == "500")
  {
    Serial.println("Erro no Servidor");
    LCD_Erro();
    InicioDaCompra();
    // Erro no Servidor
  }

  Serial.println();
}

void reconnect()
{
  // Loop até estar reconectado ao broker MQTT
  while (!client.connected())
  {
    Serial.println("Conectando ao Broker MQTT...");

    // Tenta conectar ao broker MQTT
    if (client.connect("arduino_client", mqtt_user, mqtt_password))
    {
      Serial.println("Conectado ao Broker MQTT!");
      client.subscribe(mqtt_topic_subscribe);
      InicioDaCompra();

    }
    else
    {
      Serial.print("Falha na conexão, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos...");
      delay(5000);
    }
  }
}

String formatarComZeros(String valor)
{
  while (valor.length() < 4)
  {
    valor = "0" + valor;
  }
  return valor;
}

void FinalizarCompra() {
  usuario = formatarComZeros(usuario);
  senha = formatarComZeros(senha);
  maquina = formatarComZeros(maquina);
    if( produto.toInt() >= 5){
    produto = String(produto.toInt() + 1);
    produto  = formatarComZeros(produto);
  }else if(produto.toInt() < 5){
    produto = formatarComZeros(produto);
  }

  Informacoes[0] = usuario; // Usuário
  Informacoes[1] = senha;   // Senha
  Informacoes[2] = maquina; // maquina
  Informacoes[3] = produto; // Produto
  String msg = Informacoes[0] + Informacoes[1] + Informacoes[2] + Informacoes[3]; // Construa a mensagem
  client.publish(mqtt_topic_publish, msg.c_str(), 2);
}

void InicioDaCompra() {
  /*Serial.println("Insira seu ID de usuário: ");
    while (!Serial.available()) {
    // Aguarda até que o usuário insira o ID
    }
    // Lê o ID de usuário da porta Serial
    usuario = Serial.readStringUntil('\n');
    Serial.print("ID de usuário inserido: ");
    Serial.println(usuario);

    Serial.println("Insira sua senha: ");
    while (!Serial.available()) {
    // Aguarda até que o usuário insira a senha
    }
    // Lê a senha da porta Serial
    senha = Serial.readStringUntil('\n');
    Serial.print("Senha inserida: ");
    Serial.println(senha);

    Serial.println("Insira o ID do produto á comprar: ");
    while (!Serial.available()) {
    // Aguarda até que o usuário insira a senha
    }
    // Lê a senha da porta Serial
    produto = Serial.readStringUntil('\n');
    Serial.print("Produto selecionado: ");
    Serial.println(produto);*/

  Serial.println("Insira seu ID de usuário: ");
  LCD_Identificacao();
  usuario = readFromKeypad();
  Serial.print("ID de usuário inserido: ");
  Serial.println(usuario);

  Serial.println("Insira sua senha: ");
  LCD_Requisicao();
  senha = readFromKeypad();
  Serial.print("Senha inserida: ");
  Serial.println(senha);

  Serial.println("Insira o ID do produto a comprar: ");
  LCD_Selecao();
  produto = readFromKeypad();
  Serial.print("Produto selecionado: ");
  Serial.println(produto);
  FinalizarCompra();

}

String readFromKeypad() {
  /*
    String input = "";

    while (true) {
      char key = keypad.getKey();
      if (key) {
        if (key == '#') {
          break;  // Sai do loop quando '#' é pressionado
        }
        input += key;
      }
    }

    return input;*/

  String input = "";

  while (true) {
    char key = keypad.getKey();
    if (key) {
      if (key == '#') {
        break;  // Sai do loop quando '#' é pressionado
      } else if (key == '*') {
        // Remove o último caractere se '*' é pressionado
        if (input.length() > 0) {
          input.remove(input.length() - 1);
          Serial.println("Caractere removido.");
        }
      } else {
        input += key;
      }
    }
  }

  return input;
}
