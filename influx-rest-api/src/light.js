const { InfluxDB, Point } = require("@influxdata/influxdb-client")
const express = require("express")
const morgan = require("morgan")

const router = express.Router()
router.use(express.json())

// used for logging things to console
morgan.token("body", (req) => JSON.stringify(req.body))
router.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

const mqtt_client = require("./mqtt_client")

const org = "IoT"
const bucket = "data"
const url = "http://localhost:8086"
const client = new InfluxDB({ url, org })

// get latest light state
router.get("/:id", (request, response) => {
  const id = request.params.id
  const query = `SELECT last(value) FROM light_state WHERE light_id = '${id}'`

  fetch(`${url}/query?db=data&epoch=ns&q=${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((data) => JSON.stringify(data))
    .then((data) => {
      data = JSON.parse(data)

      const obj = new Object()
      try {
        const values = data.results[0].series.map((s) => s.values)
        const light = values.map((v) => [v[0][0], v[0][1]])
        obj.light_state = light[0][1]
        obj.time = light[0][0]
      } catch (err) {
        response.status(404).send("No light state found!")
        return
      }

      response.status(200).json(obj)
    })
})

// post light state with light id
router.post("/:id", (request, response) => {
  // write a query to influxdb through JS API
  const writeClient = client.getWriteApi(org, bucket, "ns")
  const id = request.params.id

  const body = request.body
  const light_state = body.light_state
  if (typeof light_state != "boolean") {
    return response.status(400).json({
      error: "light_state missing",
    })
  }

  // publish light state message
  mqtt_client.publish("light", light_state.toString())
  const date = new Date()

  const point = new Point("light_state")
    .tag("light_id", id)
    .booleanField("value", light_state)
    .timestamp(date)

  writeClient.writePoint(point)
  writeClient.close().then(() => {
    response.sendStatus(200)
    console.log("Write finished!")
  })
})

module.exports = router
