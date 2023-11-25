// BIBLIOTECAS
#include <LiquidCrystal.h> // Display LCD
#include <Keypad.h>        // Teclado Matricial
#include <Ethernet.h>      // Modulo Ethernet
#include <PubSubClient.h> // Conexão MQTT

// VARIAVEIS PARA MQTT
const char *mqtt_server = "191.36.8.49";
const int mqtt_port = 1883; // Porta padrão do MQTT
const char *mqtt_user = "feira";
const char *mqtt_password = "feira";
const char *mqtt_topic_publish = "debito/0001";
const char *mqtt_topic_subscribe = "0001/+";

// DEFINIÇÕES DE REDE/MQTT
byte mac[] = {0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xEF};
EthernetClient ethClient;
PubSubClient client(ethClient);

// DEFINIÇÕES DO DISPLAY: >> EN, RS, DB4, DB5, DB6, DB7 >> PSB (HIGH) >> R/W (LOW) >> R/W (LOW) >> V0 (NC)
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

// CONFIGURAÇÃO DO TECLADO MATRICIAL [4 x 3]
const byte LINHAS = 4;
const byte COLUNAS = 3;
const char TECLAS_MATRIZ[LINHAS][COLUNAS] = {
    {'1', '2', '3'},
    {'4', '5', '6'},
    {'7', '8', '9'},
    {'*', '0', '#'}};
byte PINOS_LINHAS[LINHAS] = {20, 19, 18, 17}; // Pinos de Conexão (linhas)
byte PINOS_COLUNAS[COLUNAS] = {16, 15, 14};   // Pinos de Conexão (colunas)

Keypad keypad = Keypad(makeKeymap(TECLAS_MATRIZ), PINOS_LINHAS, PINOS_COLUNAS, LINHAS, COLUNAS);

// DEFINIÇÃO DA SENHA DE ACESSO
String usuario = "";    // Usuario com 4 digitos
String senha = "";   // Senha com 4 digitos
String maquina = "0001"; // Indentificador da maquina (4 digitos)
String produto = "";    // Produto selecionado para compra (4 digitos)
String valor = "2";      // valor da compra (4 digitos)
String MaqID = "1010";
String Informacoes[] = {"0", "0", maquina, "0", "0"};
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
  lcd.blink();
  delay(100);
}

void LCD_Selecao()
{
  lcd.clear();
  LCD_Linha(0, 0, "Ola! Selecione o");
  LCD_Linha(0, 2, "produto de 1 a 9");
  LCD_Linha(8, 0, "'#' p/ Confirmar");
  LCD_Linha(8, 2, "'*' p/ Cancelar!");
  lcd.noBlink();
  delay(100);
}

void LCD_Identificacao()
{
  lcd.clear();
  LCD_Linha(0, 0, "Prod Selecionado");
  LCD_Linha(0, 2, "Digite codigo de");
  LCD_Linha(8, 0, "usuario c/ 4 dig");
  LCD_Linha(8, 2, "CODIGO:         ");
  lcd.noBlink();
  delay(100);
}

void LCD_Requisicao()
{
  lcd.clear();
  LCD_Linha(0, 0, " DISPENSER V0.5 ");
  LCD_Linha(0, 2, "Senha do Usuario");
  LCD_Linha(8, 0, "com (4 digitos):");
  LCD_Linha(8, 2, "SENHA:          ");
  lcd.blink();
  delay(100);
}

void LCD_Validacao()
{
  lcd.clear();
  LCD_Linha(0, 0, "COMPRA EFETIVADA");
  LCD_Linha(0, 2, "AGUARDE LIBERAR!");
  LCD_Linha(8, 0, "RETIRE ABAIXO   ");
  LCD_Linha(8, 2, " >> OBRIGADO! <<");
  lcd.noBlink();
  delay(100);
}

void LCD_Erro()
{
  lcd.clear();
  LCD_Linha(0, 0, " Solicitacao nao");
  LCD_Linha(0, 2, "atendida. Falha ");
  LCD_Linha(8, 0, "na autenticacao ");
  LCD_Linha(8, 2, "Retornando......");
  lcd.noBlink();
  delay(100);
}

void LCD_ErroSelecao()
{
  lcd.clear();
  LCD_Linha(0, 0, "Selecao Inválida!");
  LCD_Linha(0, 2, "Favor, selecionar");
  LCD_Linha(8, 0, "número da bandeja");
  LCD_Linha(8, 2, "de produtos:1 a 8");
  lcd.noBlink();
  delay(100);
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
  for (int j = 0; j < 8; j++)
  {
    PORTA = HR1[j]; // 4 bits LSB PORT_A (22, 23, 24, 25)
    delayMicroseconds(1150);
  }
}

void M2()
{

  for (int j = 0; j < 8; j++)
  {
    PORTA = HR2[j]; // 4 bits MSB PORT_A (26, 27, 28, 29)
    delayMicroseconds(1150);
  }
}

void M3()
{
  for (int j = 0; j < 8; j++)
  {
    PORTC = HR1[j]; // 4 bits LSB PORT_C (37, 36, 35, 34)
    delayMicroseconds(1150);
  }
}

void M4()
{

  for (int j = 0; j < 8; j++)
  {
    PORTC = HR2[j]; // 4 bits MSB PORT_C (33, 32, 31, 30)
    delayMicroseconds(1150);
  }
}

void M7()
{
  for (int j = 0; j < 8; j++)
  {
    PORTL = HR2[j]; // 4 bits LSB PORT_L (49, 48, 47, 46)
    delayMicroseconds(1150);
  }
}

void M6()
{
  for (int j = 0; j < 8; j++)
  {
    PORTL = HR1[j]; // 4 bits MSB PORT_L (45, 44, 43, 42)
    delayMicroseconds(1150);
  }
}

void M8()
{
  for (int j = 0; j < 8; j++)
  {
    PORTK = HR1[j]; // 4 bits MSB PORT_K (62, 63, 64, 65) Analog
    delayMicroseconds(1150);
  }
}

void M9()
{
  for (int j = 0; j < 8; j++)
  {
    PORTK = HR2[j]; // 4 bits MSB PORT_K (66, 67, 68, 69) Analog
    delayMicroseconds(1150);
  }
}

void setup()
{
  Serial.begin(57600);
  DDRA = 0xff;
  PORTA = 0x00;
  DDRC = 0xff;
  PORTC = 0x00;
  DDRL = 0xff;
  PORTL = 0x00;
  DDRK = 0xff;
  PORTK = 0x00;

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

  // Conecta ao broker MQTT
  reconnect();

  // Alertas de Acionamento de Tecla
  // int LED = 21;
  // int BZZ = 0;
  pinMode(BZZ, OUTPUT); // Alerta sonoro
  pinMode(LED, OUTPUT); // Alerta visual

  // Inicialização do Display
  lcd.begin(16, 4); // Configura o tamanho do display
  LCD_Inicial();    // Teste do display
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
    if (produto == "0001")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M1();
        };
      };
      inicio = false;

      Mola1Qnt -= 1;
      Serial.println(Mola1Qnt);
    }
    else if (produto == "0002")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M2();
        };
      };
      inicio = false;

      Mola2Qnt -= 1;
      Serial.println(Mola2Qnt);
    }
    else if (produto == "0003")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M3();
        };
      };
      inicio = false;

      Mola3Qnt -= 1;
      Serial.println(Mola3Qnt);
    }
    else if (produto == "0004")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M4();
        };
      };
      inicio = false;

      Mola4Qnt -= 1;
      Serial.println(Mola4Qnt);
    }
    else if (produto == "0006")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M6();
        };
      };
      inicio = false;

      Mola6Qnt -= 1;
      Serial.println(Mola6Qnt);
    }
    else if (produto == "0007")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M7();
        };
      };
      inicio = false;

      Mola7Qnt -= 1;
      Serial.println(Mola7Qnt);
    }
    else if (produto == "0008")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M8();
        };
      };
      inicio = false;

      Mola8Qnt -= 1;
      Serial.println(Mola8Qnt);
    }
    else if (produto == "0009")
    {
      for (int w = 0; w < 4; w++) // 400 half-step/revolucao
      {
        for (int z = 0; z < 50; z++) // 1 revolução
        {
          M9();
        };
      };
      inicio = false;

      Mola9Qnt -= 1;
      Serial.println(Mola9Qnt);
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
    InicioDaCompra();
    // Usuário ou Senha Incorreta
  }
  else if (receivedMessage == "403")
  {
    Serial.println("Produto sem estoque ou Saldo Insuficiente");
    InicioDaCompra();
    // Produto sem estoque ou Saldo Insuficiente
  }
  else if (receivedMessage == "500")
  {
    Serial.println("Erro no Servidor");
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

void FinalizarCompra(){
    usuario = formatarComZeros(usuario);
    senha = formatarComZeros(senha);
    maquina = formatarComZeros(maquina);
    produto = formatarComZeros(produto);
    valor = formatarComZeros(valor);

    Informacoes[0] = usuario; // Usuário
    Informacoes[1] = senha;   // Senha
    Informacoes[2] = maquina; // maquina
    Informacoes[3] = produto; // Produto
    Informacoes[4] = valor;   // valor

    String msg = Informacoes[0] + Informacoes[1] + Informacoes[2] + Informacoes[3] + Informacoes[4]; // Construa a mensagem
    client.publish(mqtt_topic_publish, msg.c_str(), 2);

  }

  void InicioDaCompra(){
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
      usuario = readFromKeypad();
      Serial.print("ID de usuário inserido: ");
      Serial.println(usuario);
    
      Serial.println("Insira sua senha: ");
      senha = readFromKeypad();
      Serial.print("Senha inserida: ");
      Serial.println(senha);
    
      Serial.println("Insira o ID do produto a comprar: ");
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
        Serial.println(key);
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
