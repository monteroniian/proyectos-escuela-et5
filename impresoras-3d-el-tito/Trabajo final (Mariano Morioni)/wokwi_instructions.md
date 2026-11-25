# Simulación Wokwi - Control de Impresora 3D

## Instrucciones para usar la simulación

### 1. Acceder a Wokwi
- Ve a [https://wokwi.com](https://wokwi.com)
- Crea una cuenta gratuita o inicia sesión

### 2. Crear nuevo proyecto
- Haz clic en "New Project"
- Selecciona "ESP32"

### 3. Cargar los archivos
- Copia el contenido de `wokwi_simulation.ino` en el editor de código
- Copia el contenido de `diagram.json` en el archivo diagram.json (pestaña diagram.json)

### 4. Componentes del circuito
- **ESP32**: Controlador principal
- **Potenciómetro**: Simula sensor de temperatura (gira para cambiar temperatura)
- **LED Rojo**: Indica calentador encendido
- **LED Azul**: Indica ventilador encendido  
- **LED Verde**: Indica motor funcionando
- **LED Amarillo**: Indicador de estado del sistema
- **Botón**: Simula parada de emergencia

### 5. Funcionamiento
1. **Inicio**: El sistema se conecta a WiFi y MQTT
2. **Control de temperatura**: 
   - Gira el potenciómetro para simular cambios de temperatura
   - < 200°C: LED rojo (calentador) se enciende
   - > 220°C: LED azul (ventilador) se enciende
3. **Control MQTT**: Usa el monitor serial para enviar comandos
4. **Monitoreo**: Observa los datos en el monitor serial

### 6. Comandos MQTT disponibles
- `start`: Inicia el motor (LED verde)
- `stop`: Detiene el motor
- `emergency`: Parada de emergencia

### 7. Datos enviados
El sistema envía telemetría cada 2 segundos:
```json
{
  "temperature": 205.3,
  "heater": true,
  "fan": false,
  "motor": true,
  "timestamp": 12345
}
```

### 8. Link directo a la simulación
Una vez creado el proyecto en Wokwi, comparte el enlace para acceso directo.

## Características técnicas simuladas
- **Protocolo**: MQTT sobre WiFi
- **Frecuencia de muestreo**: 2 segundos
- **Rango de temperatura**: 150-250°C
- **Control**: ON/OFF con histéresis
- **Comunicación**: Bidireccional (telemetría + comandos)