# Description
This my part of a group project for IoT course (2022). 
<br>
<br>
The idea of the project was to collect data from a plant using sensortag, then send it through MQTT broker to backend, which stores the data and exposes it through REST API. Frontend application would then get the data from the API through HTTP requests. User could see different measurements about the plant, including temperature, humidity and light. User could also trigger the light state to control how much light the plant is getting.

<br>
This part of the project sets up a MQTT broker that listens to incoming measurements and light state, and forwards the data to backend server through a MQTT client. The server stores the data to InfluxDB and exposes it through a REST API.
<br/>
<br/>
The project is containerized and there is a separate docker-compose file for starting the backend (InfluxDB, REST API, MQTT broker) and a separate one for the MQTT client.
These can be started with the command:

```
docker-compose up
```


## MQTT

### Mosquitto

Mosquitto can be installed and started with:

<pre>sudo apt update -y && sudo apt install mosquitto mosquitto-clients -y
sudo systemctl start mosquitto
</pre>
<br>
Connecting to broker with MQTT client: <pre>mosquitto_sub -h &ltbroker ip&gt -t <b>your-topic-here</b></pre>
Sending a message:
<pre>mosquitto_pub -h &ltbroker ip&gt -t <b>your-topic-here</b> -m <b>your-message-here</b></pre>
<br>

### MQTT message formats

#### Measurements

Measurements should be published to the topic <b>measurements</b>
<br>
Measurement message format should be: temperature,humidity,light,timestamp.
<br>
<b> Timestamp is required because client listening to messages is running in an infinite loop, so with the timestamp sending same message multiple times can be avoided.</b>
<br>
Measurements are separated with a comma (,)
<br>
Example message format: 23.4,10.10,10.99,1671299386".

#### Light state messages

Light states should be published to the topic <b>light</b>
<br>
Light state message format should be: light state(bool),timestamp
<br>
Example: true,1671299386
<br>
<b> Timestamp is required because client listening to messages is running in an infinite loop, so with the timestamp sending same message multiple times can be avoided.</b>
<br>
Light state and timestamp is separated with a comma (,)
