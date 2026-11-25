// Control de Impresora 3D - Simulación Wokwi
#include <WiFi.h>
#include <PubSubClient.h>

// Configuración WiFi
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// Configuración MQTT
const char* mqtt_server = "test.mosquitto.org";
WiFiClient espClient;
PubSubClient client(espClient);

// Pines de sensores y actuadores
#define TEMP_SENSOR A0
#define HEATER_PIN 2
#define FAN_PIN 3
#define MOTOR_PIN 4
#define LED_STATUS 5

// Variables de control
float temperature = 0;
bool heaterState = false;
bool fanState = false;
bool motorState = false;
unsigned long lastMsg = 0;

void setup() {
  Serial.begin(115200);
  
  // Configurar pines
  pinMode(HEATER_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT);
  pinMode(LED_STATUS, OUTPUT);
  
  // Conectar WiFi
  setup_wifi();
  
  // Configurar MQTT
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  
  Serial.println("Sistema de control iniciado");
  digitalWrite(LED_STATUS, HIGH);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    
    // Leer temperatura simulada
    int sensorValue = analogRead(TEMP_SENSOR);
    temperature = map(sensorValue, 0, 1023, 150, 250);
    
    // Control de temperatura
    controlTemperature();
    
    // Enviar datos por MQTT
    sendTelemetry();
    
    // Mostrar en Serial
    printStatus();
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.print("Mensaje recibido [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);
  
  if (String(topic) == "printer/control") {
    if (message == "start") {
      motorState = true;
      digitalWrite(MOTOR_PIN, HIGH);
      Serial.println("Motor iniciado");
    } else if (message == "stop") {
      motorState = false;
      digitalWrite(MOTOR_PIN, LOW);
      Serial.println("Motor detenido");
    } else if (message == "emergency") {
      // Parada de emergencia
      motorState = false;
      heaterState = false;
      fanState = true;
      digitalWrite(MOTOR_PIN, LOW);
      digitalWrite(HEATER_PIN, LOW);
      digitalWrite(FAN_PIN, HIGH);
      Serial.println("PARADA DE EMERGENCIA");
    }
  }
}

void controlTemperature() {
  if (temperature < 200) {
    // Temperatura baja - encender calentador
    heaterState = true;
    fanState = false;
    digitalWrite(HEATER_PIN, HIGH);
    digitalWrite(FAN_PIN, LOW);
  } else if (temperature > 220) {
    // Temperatura alta - encender ventilador
    heaterState = false;
    fanState = true;
    digitalWrite(HEATER_PIN, LOW);
    digitalWrite(FAN_PIN, HIGH);
  } else {
    // Temperatura óptima - mantener estado
    if (temperature > 215) {
      heaterState = false;
      digitalWrite(HEATER_PIN, LOW);
    }
  }
}

void sendTelemetry() {
  String payload = "{";
  payload += "\"temperature\":" + String(temperature, 1) + ",";
  payload += "\"heater\":" + String(heaterState) + ",";
  payload += "\"fan\":" + String(fanState) + ",";
  payload += "\"motor\":" + String(motorState) + ",";
  payload += "\"timestamp\":" + String(millis());
  payload += "}";
  
  client.publish("printer/telemetry", payload.c_str());
}

void printStatus() {
  Serial.println("=== Estado del Sistema ===");
  Serial.print("Temperatura: ");
  Serial.print(temperature);
  Serial.println("°C");
  Serial.print("Calentador: ");
  Serial.println(heaterState ? "ON" : "OFF");
  Serial.print("Ventilador: ");
  Serial.println(fanState ? "ON" : "OFF");
  Serial.print("Motor: ");
  Serial.println(motorState ? "ON" : "OFF");
  Serial.println("========================");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    String clientId = "Printer3D_";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("conectado");
      client.subscribe("printer/control");
      client.publish("printer/status", "online");
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" reintentando en 5 segundos");
      delay(5000);
    }
  }
}