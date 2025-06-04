#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "TP-Link_3BE6";
const char* password = "Home@67ghTb";

// HiveMQ Cloud credentials
const char* mqtt_server = "78b044a0e0d54281b409642c380f0e7b.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "hivemq.webclient.1748953097876";
const char* mqtt_pass = ",41.2XG5SZ@fahDKgtm&";

WiFiClientSecure espClient;  // Secure client
PubSubClient client(espClient);

#define WIFI_SIGNAL_LED D4
#define LED_PIN1 D5
#define LED_PIN2 D6
#define LED_PIN3 D7

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(WIFI_SIGNAL_LED, LOW);
    delay(500);
    digitalWrite(WIFI_SIGNAL_LED, HIGH);
    delay(500);
  }
  digitalWrite(WIFI_SIGNAL_LED,LOW);
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
  pinMode(WIFI_SIGNAL_LED, OUTPUT);
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
