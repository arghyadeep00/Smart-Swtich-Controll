#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "************";
const char* password = "**************";

// HiveMQ Cloud credentials
const char* mqtt_server = "****************";
const int mqtt_port = 8883;
const char* mqtt_user = "***************";
const char* mqtt_pass = "********************";

// Pins
#define WIFI_SIGNAL_LED D4
#define LED_PIN1 D5
#define LED_PIN2 D6
#define LED_PIN3 D7

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(WIFI_SIGNAL_LED, LOW);   // Blink while connecting
    delay(500);
    digitalWrite(WIFI_SIGNAL_LED, HIGH);
    delay(500);
  }
  digitalWrite(WIFI_SIGNAL_LED, LOW);     // Turn ON when connected
  Serial.println(" connected.");
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.printf("Message received [%s]: %s\n", topic, message.c_str());

  if (strcmp(topic, "switch1") == 0) {
    digitalWrite(LED_PIN1, message == "true" ? LOW : HIGH);
  } else if (strcmp(topic, "switch2") == 0) {
    digitalWrite(LED_PIN2, message == "true" ? LOW : HIGH);
  } else if (strcmp(topic, "switch3") == 0) {
    digitalWrite(LED_PIN3, message == "true" ? LOW : HIGH);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");

    String clientId = "ESP8266Client-" + String(random(0xffff), HEX);

    // Connect with LWT
    if (client.connect(
          clientId.c_str(),
          mqtt_user,
          mqtt_pass,
          "device/status",   // LWT topic
          1,                 // QoS
          true,              // Retain
          "disconnected"     // LWT message
        )) {
      Serial.println(" connected");

      // Send initial online status
      client.publish("device/status", "connected", true);

      // Subscribe to topics
      client.subscribe("switch1");
      client.subscribe("switch2");
      client.subscribe("switch3");
    } else {
      Serial.print(" failed, rc=");
      Serial.println(client.state());
      delay(5000);  // Wait and retry
    }
  }
}

void setup() {
  Serial.begin(115200);

  // Pin Modes
  pinMode(WIFI_SIGNAL_LED, OUTPUT);
  pinMode(LED_PIN1, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
  pinMode(LED_PIN3, OUTPUT);

  // LEDs OFF initially
  digitalWrite(LED_PIN1, HIGH);
  digitalWrite(LED_PIN2, HIGH);
  digitalWrite(LED_PIN3, HIGH);
  digitalWrite(WIFI_SIGNAL_LED, HIGH);  // OFF (active LOW)

  setup_wifi();

  // Accept all certificates (not secure - for testing HiveMQ Cloud)
  espClient.setInsecure();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
