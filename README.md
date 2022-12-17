# Backend information

## Running docker containers

The backend can be started with the command <pre> docker-compose up</pre>

### The docker containers that are started through docker-compose are hosted at this address http://139.59.205.221

## Accessing API

API can be accessed from this URL http://139.59.205.221:3000/
<br>
More detailed instructions on how to use the API can be found from the above URL.
<br>
<b> Note: adding new devices is not supported. Use device id 1 in the requests.</b>

## MQTT

MQTT broker is also hosted at the same IP address.
<br>

### Mosquitto

Mosquitto can be installed and started with:

<pre>sudo apt update -y && sudo apt install mosquitto mosquitto-clients -y
sudo systemctl start mosquitto
</pre>
<br>
Connecting to broker with MQTT client: <pre>mosquitto_sub -h 139.59.205.221 -t <b>your-topic-here</b></pre>
Sending a message:
<pre>mosquitto_pub -h 139.59.205.221 -t <b>your-topic-here</b> -m <b>your-message-here</b></pre>
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
