const mqtt = require("mqtt")

const mqtt_client = mqtt.connect("mqtt://localhost:1883") // Connect to the broker
// const client = mqtt.connect("http://139.59.205.221:1883") // Connect to the hosted broker

console.log("Connecting to broker...")
mqtt_client.on("connect", () => {
  console.log("Connected to the MQTT broker successfully")
  mqtt_client.subscribe("measurements")
  mqtt_client.subscribe("light")
})

module.exports = mqtt_client
