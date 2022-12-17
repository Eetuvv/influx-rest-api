const mqtt = require("mqtt")
const { postMeasurement, postLightState } = require("./queries")

const mqtt_client = mqtt.connect("mqtt://localhost:1883") // Connect to the broker
// const client = mqtt.connect("http://139.59.205.221:1883") // Connect to the hosted broker

console.log("Connecting to broker...")
mqtt_client.on("connect", () => {
  console.log("Connected to the MQTT broker successfully")
  mqtt_client.subscribe("measurements")
  mqtt_client.subscribe("light")
})

let prevTimeStamp = ""
mqtt_client.on("message", (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message}`)
  if (topic.includes("measurements")) {
    // separate temperature, humidity and light data in the msg with semicolon
    message = message.toString().split(",")
    const temperature = message[0]
    const humidity = message[1]
    const light = message[2]
    const timestamp = message[3]

    // check that timestamp is different from the previously sent message
    // this avoids sending multiple messages in infinite loop
    if (timestamp != prevTimeStamp) {
      prevTimeStamp = timestamp
      // send query to api/measurements/id
      console.log("sending post measurement query to API")
      postMeasurement(topic, temperature, humidity, light)
    }
  } else if (topic === "light") {
    console.log(message.toString())
    message = message.toString().split(",")
    console.log("2", message.toString())
    const lightState = message[0]
    const timestamp = message[1]

    // check that timestamp is different from the previously sent message
    // this avoids sending multiple messages in infinite loop
    if (timestamp != prevTimeStamp) {
      prevTimeStamp = timestamp
      // send query to api/light/id
      console.log("sending post light state query to API")
      postLightState(topic, lightState)
    }
  }
})

// data format for measurements is temperature,humidity,light, timestamp
// example:
// mqtt_client.publish("measurements", "23.4,10,10,1671299386")

// data format for light is bool, timestamp
// example:
// mqtt_client.publish("light", "true")
