// Definición de los pines para cada color
int ledRojo = 13;
int ledAmarillo = 12;
int ledVerde = 11;

void setup() {
  // Configurar los pines como salida
  pinMode(ledRojo, OUTPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledVerde, OUTPUT);
}

void loop() {
  // 1. Verde encendido por 5 segundos
  digitalWrite(ledVerde, HIGH);
  delay(5000); 
  digitalWrite(ledVerde, LOW);

  // 2. Amarillo encendido por 2 segundos (atención)
  digitalWrite(ledAmarillo, HIGH);
  delay(2000);
  digitalWrite(ledAmarillo, LOW);

  // 3. Rojo encendido por 5 segundos (pare)
  digitalWrite(ledRojo, HIGH);
  delay(5000);
  digitalWrite(ledRojo, LOW);
  
  // El ciclo vuelve a empezar automáticamente
}