const express = require("express")
const cors = require("cors")

const app = express()

const measurementsRouter = require("./measurements")
const lightRouter = require("./light")

app.use("/api/measurements", measurementsRouter)
app.use("/api/light", lightRouter)

app.use(express.json())
app.use(express.static("build"))
app.use(cors())

app.get("/", (request, response) => {
  const res = `
  <div>
   <h1>REST API USAGE</h1>
   <div>
    <h2>Get requests</h2>
    <div>
      <p><b>Measurements</b></p>
      <p> Latest measurement:</p>
      <p>/api/measurements/device-id/latest</p>
      <pre>
        <b>Json format</b>

            {
              "temperature": 23.4,
              "humidity": 10,
              "light": 10,
              "time": "2022-12-15T21:39:37.214Z"
            }
      </pre>
      <p>All measurements:</p>
      <p>/api/measurements/device-id/all</p>
      <pre>
        <b>Json format</b>

            {
              "temperature": [
                  [
                      "2022-12-15T20:00:12.708Z",
                      3
                  ],
                  [
                      "2022-12-15T20:00:26.003Z",
                      3
                  ],
                  [
                      "2022-12-15T20:00:29.367Z",
                      3
                  ]
              ],
              "humidity": [
                  [
                      "2022-12-15T20:00:12.708Z",
                      999399
                  ],
                  [
                      "2022-12-15T20:00:26.003Z",
                      999399
                  ],
                  [
                      "2022-12-15T20:00:29.367Z",
                      999399
                  ]
              ],
              "light": [
                  [
                      "2022-12-15T20:00:12.708Z",
                      30343454540
                  ],
                  [
                      "2022-12-15T20:00:26.003Z",
                      30343454540
                  ],
                  [
                    "2022-12-15T20:00:29.367Z",
                    30343454540
                  ],
              ]
            }
      </pre>
    </div>
    <div>
      <p><b>All measurements in given range</b><p>
      <p> All measurements in hour range: /api/measurements/device-id/all/hours/--number of hours here--</p>
      <p>All measurements in minute range: /api/measurements/device-id/all/minutes/-number of minutes here--</p>
      <pre>
            Json format
            {
              "temperature":
              [
                [1671143364840000000,30224],
                [1671143428553000000,30224],
                [1671143428965000000,30224]
              ]
            }
      </pre>
    <div>
    <h3>Average of measurements in given range</h3>
    <p> Ranges can be in minutes or hours</p>
    <p><b>Average of measurements in given hour range</b><p>
    <p>/api/measurements/device-id/mean/hours/--number of hours here--
    <br>
    <p><b><p>Average of measurements in given minute range</b></p>
    <p>/api/measurements/device-id/mean/minutes/--number of minutes here--
    <br>
    <pre>
      Json format
      {"temperature":32.2,"humidity":40.8,"light":3.2}
    </div>
    <div>
      <p><b>Light state</b></p>
      <p>/api/light/device-id</p>
      <pre>
        <b>Json format</b>

        {
          "light_state": true,
          "time": "2022-12-15T21:39:37.215Z"
        }
      </pre>
    </div>
   </div> 
   <div>
   <br>
   <div>
    <h2>Post requests</h2>
    <div>
      <p><b>Measurements</b></p>
      <p>/api/measurements/device-id</p>
      <pre>
        Json format

          {
              "temperature": float,
              "humidity": float,
              "light": float
          }
        </p>
      </pre>
    </div>
    <div>
      <p><b>Light state</b></p>
      <p>/api/light/device-id
      <pre>
        Json format

            {
                "light-state": bool
            }
        </p>
      </pre>
   </div>
   </div>
  </div>
  `
  response.send(res)
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
