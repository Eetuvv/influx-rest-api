const baseUrl = "http://localhost:3000/api" // localhost API
// const baseUrl = "http://139.59.205.221:3000/api" // hosted API

const postMeasurement = (topic, temperature, humidity, light) => {
  const url = `${baseUrl}/${topic}/1`
  query = fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      temperature: temperature,
      humidity: humidity,
      light: light,
    }),
  })
    .then((res) => console.log("Measurement inserted successfully"))
    .catch((err) => console.log(err))
}

const postLightState = (topic, lightState) => {
  const url = `${baseUrl}/${topic}/1`
  query = fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      light_state: JSON.parse(lightState),
    }),
  })
    .then((res) => console.log("Light state updated successfully"))
    .catch((err) => console.log(err))
}

module.exports = {
  postMeasurement: postMeasurement,
  postLightState: postLightState,
}
