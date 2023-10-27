// BIBLIOTECAS
#include <LiquidCrystal.h>  // Display LCD
#include <Keypad.h>         // Teclado Matricial
#include <Ethernet.h>       // Módulo Ethernet


// DEFINIÇÕES DE REDE/MQTT
byte mac[] = {0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xEF};
EthernetClient ethClient;
String URL = "https://feira-de-jogos.sj.ifsc.edu.br/api/v1/debito";
HTTPClient http;

// DEFINIÇÕES DO DISPLAY: >> EN, RS, DB4, DB5, DB6, DB7 >> PSB (HIGH) >> R/W (LOW)
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

// CONFIGURAÇÃO DO TECLADO MATRICIAL [4 x 3]
const byte LINHAS = 4;
const byte COLUNAS = 3;
const char TECLAS_MATRIZ[LINHAS][COLUNAS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'*', '0', '#'}
};
const byte PINOS_LINHAS[LINHAS] = {14, 15, 16, 17}; // Pinos de Conexão (linhas)
const byte PINOS_COLUNAS[COLUNAS] = {18, 19, 20}; // Pinos de Conexão (colunas)

Keypad teclado = Keypad(makeKeymap(TECLAS_MATRIZ), PINOS_LINHAS, PINOS_COLUNAS, LINHAS, COLUNAS);

// DEFINIÇÃO DA SENHA DE ACESSO
String senha = ""; // Senha utilizada para liberacao

// MÉTODO PARA IMPRIMIR LINHA NO DISPLAY
void LCD_Linha(int a, int b, String texto)
{
  lcd.setCursor(a, b); // Posiciona o cursor na Coluna a x Linha b >> L1(0,0), L2(0,2), L3(8,0), L4(8,2)
  lcd.print(texto); // Imprime o texto na posição (a,b) do LCD >> Tamanho máximo: 16 caracteres/linha
}

// MONTAGEM DAS TELAS
void LCD_Espera()
{
  lcd.clear();
  lcd.setCursor(0, 0); // Posiciona o cursor na Coluna a x Linha b >> L1(0,0), L2(0,2), L3(8,0), L4(8,2)
  char x = 0x08;
  for (int i = 0; i < 32; i++) {
    lcd.write(x); // Imprime o texto na posição (a,b) do LCD >> Tamanho máximo: 16 caracteres/linha
  }
  lcd.setCursor(0, 2); // Posiciona o cursor na Coluna a x Linha b >> L1(0,0), L2(0,2), L3(8,0), L4(8,2)
  for (int i = 0; i < 32; i++) {
    lcd.write(x); // Imprime o texto na posição (a,b) do LCD >> Tamanho máximo: 16 caracteres/linha
  }
}

void LCD_Inicial()
{
  lcd.clear();
  LCD_Linha(0, 0, ">DISPENSER V.0.5");
  LCD_Linha(0, 2, ">Inicializando..");
  LCD_Linha(8, 0, "Tela Inicial do ");
  LCD_Linha(8, 2, "p/ programa LCD ");
  delay(100);
  lcd.blink();
}

void LCD_Validacao()
{
  lcd.noBlink();
  lcd.clear();
  LCD_Linha(0, 0, "Codigo Validado!");
  LCD_Linha(0, 2, "Liberando acesso");
}

void LCD_Invalido()
{
  lcd.noBlink();
  lcd.clear();
  LCD_Linha(0, 0, "****************");
  LCD_Linha(0, 2, "CODIGO INVALIDO!");
  LCD_Linha(8, 0, "Tente novamente!");
  LCD_Linha(8, 2, "****************");
}

void LCD_Final()
{
  lcd.clear();
  LCD_Linha(0, 0, "================");
  LCD_Linha(0, 2, "=Porta Liberada=");
  LCD_Linha(8, 0, "= Bem-Vindo(a) =");
  LCD_Linha(8, 2, "================");
}

void ALERTAS()
{
  int BUZZER = 1;
  int LED = 21;
  digitalWrite(LED, HIGH);
  digitalWrite(BUZZER, HIGH);
  delay(500);
  digitalWrite(LED, LOW);
  digitalWrite(BUZZER, LOW);
}

byte AH1[8] = {0x09, 0x01, 0x03, 0x02, 0x06, 0x04, 0x0c, 0x08};
byte AH2[8] = {0x90, 0x10, 0x30, 0x20, 0x60, 0x40, 0xc0, 0x80};
byte HR1[8] = {0x08, 0x0c, 0x04, 0x06, 0x02, 0x03, 0x01, 0x09};
byte HR2[8] = {0x80, 0xc0, 0x40, 0x60, 0x20, 0x30, 0x10, 0x90};
byte steps = 50; //change the parameter to change the angle of the stepper
int LED = 1;
int BZZ = 2;

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

void M5()
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

void M7()
{
  for (int j = 0; j < 8; j++)
  {
    PORTK = HR1[j]; // 4 bits MSB PORT_K (62, 63, 64, 65) Analog
    delayMicroseconds(1150);
  }
}

void M8()
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
  Ethernet.begin(mac);
  Serial.println(Ethernet.localIP());

  // Alertas de Acionamento de Tecla
  int BZZ = 1;
  int LED = 2;
  pinMode(BZZ, OUTPUT); // Alerta sonoro
  pinMode(LED, OUTPUT); // Alerta visual

  // Inicialização do Display
  lcd.begin(16, 4); // Configura o tamanho do display
  LCD_Espera(); // Tela inicial solicitando código
}

String codigo = "Codigo: ";
const char* rootCA= \
"-----BEGIN CERTIFICATE-----\n" \
"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\n" \
"-----END CERTIFICATE-----\n";

void loop()
{
  LCD_Inicial(); // Tela inicial solicitando código
  break;

  char leitura = teclado.getKey(); // Atribui a variavel a leitura do teclado
  if (leitura) // Se alguma tecla foi pressionada
  { 
    ALERTAS();
    if (leitura == '#') //PAREI AQUI NA REVISAO
    {
      if (senha == "1234")
      {
        LCD_Validacao();

        // Requisição HTTP com POST
        http.begin(URL, rootCA)
        int httpResponseCode = http.POST();
        switch(httpResponseCode)
        {
          case 200:
            Serial.println("200 OK"); // único cenário em que a operação é válida
            break;
          case 400:
            Serial.println("400 Bad Request");
            break;
          case 401:
            Serial.println("401 unauthorized");
            break;
          case 403:
            Serial.println("403 Forbidden");
            break;
          case 500:
            Serial.println("500 Internal Server Error");
            break;
          default:
            Serial.print("Erro desconhecido: ")
            Serial.println(httpResponseCode)
            break;
        }
        http.end()

        for (int i = 5; i > 0; i--)
        {
          String texto = "em: " + String(i) + " segundo(s)";
          LCD_Linha(8, 0, texto);
          delay(1000);
        }
        for (int i = 0; i < 20; i++)
        {
          lcd.clear();
          delay(100);
          LCD_Linha(8, 0, "ACESSO LIBERADO!");
          delay(100);
        }
        Serial.println("PORTA ABERTA");
        delay(3000);
        LCD_Final();
      } else {
        LCD_Invalido();
        senha = "";
        codigo = String("Codigo: ");
        delay(1000);
        LCD_Inicial();
      }
    } else {
      if (leitura != '*')
      {
        senha += leitura;
        codigo = codigo + '*';
        LCD_Linha(8, 2, codigo);
      }
    }
    if (leitura == '*')
    {
      lcd.noBlink();
      LCD_Linha(8, 2, "Codigo:         ");
      LCD_Linha(8, 2, "Codigo: ");
      lcd.blink(); // Cursor piscando no final do texto
      senha = "";
      codigo = String("Codigo: ");
    }
  }

  Ethernet.maintain();

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M1();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M2();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M3();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M4();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M5();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M6();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M7();
    };
  };
  delay(2000);

  for (int w = 0; w < 4; w++) // 400 half-step/revolucao
  {
    for (int z = 0; z < 50; z++) // 1 revolução
    {
      M8();
    };
  };
  delay(5000);
}
