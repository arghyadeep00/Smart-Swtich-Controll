#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "TP-Link_3BE6";
const char* password = "Home@67ghTb";

// HiveMQ Cloud credentials
const char* mqtt_server = "16e43abbd885424baf2d25eba3b63656.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "hivemq.webclient.1747369072656";
const char* mqtt_pass = "pxCnV76@a*$P9m.K3GLo";

WiFiClientSecure espClient;  // Secure client
PubSubClient client(espClient);

// LED on GPIO2 (NodeMCU D4)
#define LED_PIN1 D5
#define LED_PIN2 D6
#define LED_PIN3 D7

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println(" connected");
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
    if (client.connect("ESP8266Client", mqtt_user, mqtt_pass)) {
      Serial.println(" connected");
      client.subscribe("switch1");
      client.subscribe("switch2");
      client.subscribe("switch3");
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN1, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
  pinMode(LED_PIN3, OUTPUT);
  digitalWrite(LED_PIN1, HIGH);  // LED off initially
  digitalWrite(LED_PIN2, HIGH);  // LED off initially
  digitalWrite(LED_PIN3, HIGH);  // LED off initially

  setup_wifi();

  // Accept all certificates (INSECURE - for testing)
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
