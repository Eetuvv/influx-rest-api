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

const org = "IoT"
const bucket = "data"
const url = "http://localhost:8086"
const client = new InfluxDB({ url, org })

const getAllMeasurements = (id, range, response) => {
  let query = `SELECT value FROM temperature, humidity, light WHERE sensor_id = '${id}'`

  // if range is specified, get all measurements in given range
  if (range) {
    query = `SELECT value FROM temperature, humidity, light WHERE time >= now() - ${range} AND sensor_id = '${id}'`
  }
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
        const humidity = values[0]
        const light = values[1]
        const temperature = values[2]

        obj.temperature = temperature
        obj.humidity = humidity
        obj.light = light
      } catch (err) {
        response.status(404).send("No data found!")
        return
      }
      response.status(200).json(obj)
    })
}

// get all measurements from database
router.get("/:id/all", (request, response) => {
  const id = request.params.id
  getAllMeasurements(id, "", response)
})

// get all measurements in range (hours)
router.get("/:id/all/hours/:range", (request, response) => {
  const id = request.params.id
  const range = request.params.range
  const rangeStr = `${range}h`
  getAllMeasurements(id, rangeStr, response)
})

// get all measurements in range(minutes)
router.get("/:id/all/minutes/:range", (request, response) => {
  const id = request.params.id
  const range = request.params.range
  const rangeStr = `${range}m`
  getAllMeasurements(id, rangeStr, response)
})

// get latest measurements
router.get("/:id/latest", (request, response) => {
  const id = request.params.id
  const query = `SELECT last(value) as value, time FROM temperature, humidity, light WHERE sensor_id = '${id}'`

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
        const measurements = values.map((v) => [v[0][0], v[0][1]])
        const [humidity, light, temperature] = measurements

        obj.temperature = temperature[1]
        obj.humidity = humidity[1]
        obj.light = light[1]
        obj.time = temperature[0]
      } catch (err) {
        response.status(404).send("No data found in the given range!")
        return
      }

      response.status(200).json(obj)
    })
})

const getMeanValues = (id, range, response) => {
  const query = `SELECT mean(value) FROM temperature, humidity, light WHERE time >= now() - ${range} AND sensor_id = '${id}'`

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
        const measurements = values.map((v) => [v[0][0], v[0][1]])
        const [humidity, light, temperature] = measurements

        obj.temperature = temperature[1]
        obj.humidity = humidity[1]
        obj.light = light[1]
      } catch (err) {
        response.status(404).send("No data found in the given range!")
        return
      }

      response.status(200).json(obj)
    })
}

// get the mean values over a range (hours)
router.get("/:id/mean/hours/:range", (request, response) => {
  const id = request.params.id
  const range = request.params.range
  const rangeStr = `${range}h`
  getMeanValues(id, rangeStr, response)
})

// get the mean values over a range (minutes)
router.get("/:id/mean/minutes/:range", (request, response) => {
  const id = request.params.id
  const range = request.params.range
  const rangeStr = `${range}m`
  getMeanValues(id, rangeStr, response)
})

// post measurement with device id
router.post("/:id", async (request, response) => {
  const writeClient = client.getWriteApi(org, bucket, "ns")
  const id = request.params.id

  console.log(request.body)

  const body = request.body
  if (!body.temperature || !body.humidity || !body.light) {
    return response.status(400).json({
      error: "temperature, humidity or light missing",
    })
  }

  const temperature = body.temperature
  const humidity = body.humidity
  const light = body.light
  const date = new Date()

  const temperaturePoint = new Point("temperature")
    .tag("sensor_id", id)
    .floatField("value", temperature)
    .timestamp(date)

  const humidityPoint = new Point("humidity")
    .tag("sensor_id", id)
    .floatField("value", humidity)
    .timestamp(date)

  const lightPoint = new Point("light")
    .tag("sensor_id", id)
    .floatField("value", light)
    .timestamp(date)

  const points = [temperaturePoint, humidityPoint, lightPoint]

  writeClient.writePoints(points)
  writeClient.close().then(() => {
    response.sendStatus(200)
    console.log("Write finished!")
  })
})

module.exports = router
