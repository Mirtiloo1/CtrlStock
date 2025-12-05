#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid = "CtrlStock";
const char* password = "StockChain";
String serverUrl = "https://ctrlstock-api.onrender.com/api/movements";

// Pinos
const int ledVermelhoPin = 2;  
const int ledVerdePin = 21;     
const int buttonPin = 15;
const int buzzerPin = 22;

#define SS_PIN 5
#define RST_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);
WiFiClientSecure clientSecure;

bool modoEntrada = true; 
unsigned long lastDebounce = 0;
int lastReading = HIGH;
int stableState = HIGH;

void bipSucesso() { tone(buzzerPin, 2000, 100); delay(120); }
void bipErro() { tone(buzzerPin, 500, 800); delay(850); } // Longo
void bipModo() { tone(buzzerPin, 1500, 80); delay(100); tone(buzzerPin, 1500, 80); delay(100); }

void atualizaLEDs() {
  digitalWrite(ledVerdePin, modoEntrada ? HIGH : LOW);
  digitalWrite(ledVermelhoPin, modoEntrada ? LOW : HIGH);
}

void setupWiFi() {
  WiFi.begin(ssid, password);
  int t = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    if (++t > 20) ESP.restart();
  }
}

void sendData(String uid) {
  if (WiFi.status() != WL_CONNECTED) { bipErro(); return; }
  
  HTTPClient http;
  clientSecure.setInsecure();

  if (http.begin(clientSecure, serverUrl)) {
    http.addHeader("Content-Type", "application/json");
    String tipo = modoEntrada ? "entrada" : "saida";
    String json = "{\"uid\":\"" + uid + "\", \"tipo\":\"" + tipo + "\"}";
    
    int code = http.POST(json);

   if (code == 200 || code == 201 || code == 202) {
      int pino = modoEntrada ? ledVerdePin : ledVermelhoPin;
      digitalWrite(pino, LOW); bipSucesso(); delay(100); digitalWrite(pino, HIGH);
    } 
    else {
      digitalWrite(ledVerdePin, LOW); 
      digitalWrite(ledVermelhoPin, HIGH);
      bipErro(); 
      delay(200); 
      digitalWrite(ledVermelhoPin, LOW); 
      delay(200);
      atualizaLEDs();
    } 
    http.end();
  }
}

void sendStatusUpdate() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    clientSecure.setInsecure();
    
    String statusUrl = "https://ctrlstock-api.onrender.com/api/device-status";
    
    if (http.begin(clientSecure, statusUrl)) {
      http.addHeader("Content-Type", "application/json");
      
      String modoStr = modoEntrada ? "entrada" : "saida";
      String json = "{\"mode\":\"" + modoStr + "\"}";
      
      http.POST(json);
      http.end();
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(ledVermelhoPin, OUTPUT); pinMode(ledVerdePin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP); pinMode(buzzerPin, OUTPUT);
  
  atualizaLEDs();
  setupWiFi();
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {
  int reading = digitalRead(buttonPin);
  if (reading != lastReading) lastDebounce = millis();
  
  if ((millis() - lastDebounce) > 50) {
    if (reading != stableState) {
      stableState = reading;
      if (stableState == LOW) {
        modoEntrada = !modoEntrada;
        bipModo();
        atualizaLEDs();
        Serial.println(modoEntrada ? "Modo: ENTRADA" : "Modo: SAIDA");

        sendStatusUpdate();
      }
    }
  }
  lastReading = reading;

  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
       uid += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
       uid += String(mfrc522.uid.uidByte[i], HEX);
       if (i < mfrc522.uid.size - 1) uid += "-";
    }
    uid.toUpperCase();
    sendData(uid);
    mfrc522.PICC_HaltA();
  }
}