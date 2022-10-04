#include "analogWrite.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ThingSpeak.h>
#include "time.h"
#include "HTTPClient.h"


char jsonBuffer[2000] = "["; // Initialize the jsonBuffer to hold data

// Collect data once every 15 seconds and post to ThingSpeak once every minute
unsigned long lastConnectionTime = 0; // Track the last connection time
unsigned long lastUpdateTime = 0; // Track the last update time
const unsigned long postingInterval = 30L * 1000L; // Post data every 1 minutes
const unsigned long updateInterval = 0.1L * 1000L; // Update once every 0.2 seconds

int status = WL_IDLE_STATUS;
#define WIFI_TIMEOUT 10000


char ssid[] = "HaveYouCheckedYourBH"; // Your network SSID (name)
char pass[] = "SearchItUp"; // Your network password
WiFiClient client; // Initialize the WiFi client library

char server[] = "api.thingspeak.com"; // ThingSpeak Server

#define ENCA 34 // YELLOW
#define ENCB 32 // WHITE
#define PWM 5
#define IN2 19
#define IN1 18

volatile int posi = 0; 
long prevT = 0;
float eprev = 0;
float eintegral = 0;

#define PID_TIMER 3000
#define SAMPLING_RATE 100

int readChannelID=1853827;
const char* readAPIKey="HBOKWG0WPO910906";

int writeChannelID=1854294;
const char* writeAPIKey="KQ8FHKMGKNOV4775";

int errorChannelID=1859511;
const char* errorAPIKey="IEO4JVNRDNSDB324";

void connectwifi()
{
  // Attempt to connect to WiFi network
  while (WiFi.status() != WL_CONNECTED) {
  Serial.print("Attempting to connect to SSID: ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass); // Connect to WPA/WPA2 network. Change this line if using open or WEP network
  delay(10000); // Wait 10 seconds to connect
    }
    Serial.println("Connected to wifi");
    printWiFiStatus(); // Print WiFi connection information
}

void setup() {
  Serial.begin(9600);
  pinMode(ENCA,INPUT);
  pinMode(ENCB,INPUT);
  attachInterrupt(digitalPinToInterrupt(ENCA),readEncoder,RISING);
  
  pinMode(PWM,OUTPUT);
  pinMode(IN1,OUTPUT);
  pinMode(IN2,OUTPUT);
  connectwifi();
  ThingSpeak.begin(client);
  delay(1000);
  Serial.println("target pos");
}
float target = 0;
float kp = 0;
float ki = 0;
float kd = 0;
int statusCode = 0;
//statusCode = 
float prevtarget=0;
bool flag=false;
void loop() {

  // set target position

  statusCode = ThingSpeak.readMultipleFields(readChannelID);

  if(statusCode == 200)
   {
      target = ThingSpeak.getFieldAsInt(1); // Field 1
      if(!flag)
      {
        prevtarget=target;
        flag=true;
      }
//      if(target>92)
//      {
//        target-=6;
//      }
//      else
//      {
//        target+=6;
//      }
      kp = ThingSpeak.getFieldAsFloat(2); // Field 2
      ki = ThingSpeak.getFieldAsFloat(3); // Field 3
      kd = ThingSpeak.getFieldAsFloat(4); // Field 4
   }
  
  //float target = Serial.parseFloat(); //get target from page
  
  if(target!=0){
//    target = (target*180)/240; //calibrate the input angle and the motor turning angle
    if(target>360)
      target-=360;
    if(target!=prevtarget)
    {
      //float kp = 10; //get kp from page
      //float kd = 0.125; //get kd from page
      //float ki = 0.4; //get ki from page
      String val=String(target);
      createCI(val);
      PID_control(target*1.15,kp,kd,ki);
      prevtarget=target; 
//      String dataString=String(target);

       // If posting interval time has reached 2 minutes, then update the ThingSpeak channel with your data
      if (millis() - lastConnectionTime >= postingInterval) {
      size_t len = strlen(jsonBuffer);
      jsonBuffer[len-1] = ']';
      httpRequest(jsonBuffer);
     }
    
      //String topicString="channels/"+String(writeChannelID) + "/publish/"+"fields/field1/"+String(writeAPIKey);

      //ThingSpeak.writeField(1,1,dataString,writeAPIKey);
      //Serial.println("Uploaded to thingspeak, wait for 15 s for next reading");
      // //delay(12000);
    }
  } 
}


// Updates the jsonBuffer with data
void updatesJson(char* jsonBuffer, int pos){
/* JSON format for updates paramter in the API
* This example uses the relative timestamp as it uses the "delta_t". If your 
device has a real-time clock, you can provide the absolute timestamp using 
the "created_at" parameter
* instead of "delta_t".
* "[{\"delta_t\":0,\"field1\":-70},{\"delta_t\":15,\"field1\":-66}]"
*/
// Format the jsonBuffer as noted above
strcat(jsonBuffer,"{\"delta_t\":");
 unsigned long deltaT = (millis() - lastUpdateTime)/100;
 size_t lengthT = String(deltaT).length();
 char temp[4];
 String(deltaT).toCharArray(temp,lengthT+1);
 strcat(jsonBuffer,temp);
 strcat(jsonBuffer,",");

////////////////////////////////////////////////////////////////////
 //long rssi = WiFi.RSSI();
 //strcat(jsonBuffer, "\"field1\":");
 //lengthT = String(rssi).length();
 //String(rssi).toCharArray(temp,lengthT+1);

 ////////////////////////////////////////////////////////
// long angle = pos;
 strcat(jsonBuffer, "\"field1\":");
 lengthT = String(pos).length();
 String(pos).toCharArray(temp,lengthT+1);
 ////////////////////////////////////////////////
 
 strcat(jsonBuffer,temp);
// strcat(jsonBuffer,",");
//
//  strcat(jsonBuffer, "\"field1\":");
// lengthT = String(tar).length();
// String(pos).toCharArray(temp,lengthT+1);
// ////////////////////////////////////////////////
// 
// strcat(jsonBuffer,temp);
 
 strcat(jsonBuffer,"},");
 
 /*
 // If posting interval time has reached 2 minutes, then update the ThingSpeak channel with your data
  if (millis() - lastConnectionTime >= postingInterval) {
  size_t len = strlen(jsonBuffer);
  jsonBuffer[len-1] = ']';
  httpRequest(jsonBuffer);
 }
 */
 lastUpdateTime = millis(); // Update the last update time
 String data_length = String(strlen(jsonBuffer)+1); //Compute the data buffer length
  Serial.println("buffer length: " + data_length);
  }

 // Updates the ThingSpeakchannel with data
 void httpRequest(char* jsonBuffer) {
 /* JSON format for data buffer in the API
 * This example uses the relative timestamp as it uses the "delta_t". If 
   your device has a real-time clock, you can also provide the absolute 
   timestamp using the "created_at" parameter
   * instead of "delta_t".
   * "{\"write_api_key\":\"YOUR-CHANNEL-WRITEAPIKEY\",\"updates\": 
      [{\"delta_t\":0,\"field1\":-60},{\"delta_t\":15,\"field1\":200}, 
      {\"delta_t\":15,\"field1\":-66}]
   */
    Serial.println("Updating to Thingspeak");
   
   // Format the data buffer as noted above
  char data[5000] = "{\"write_api_key\":\"KQ8FHKMGKNOF4773\",\"updates\":"; 
   //Replace YOUR-CHANNEL-WRITEAPIKEY with your ThingSpeak channel write API key
  strcat(data,jsonBuffer);
  strcat(data,"}");
  // Close any connection before sending a new request
  client.stop();
  String data_length = String(strlen(data)+1); //Compute the data buffer length
  Serial.println("data length: " + data_length);
  // POST data to ThingSpeak
  if (client.connect(server, 80)) {
  client.println("POST /channels/1857194/bulk_update.json HTTP/1.1"); 
  //Replace YOUR-CHANNEL-ID with your ThingSpeak channel ID
  client.println("Host: api.thingspeak.com");
  client.println("User-Agent: mw.doc.bulk-update (Arduino ESP8266)");
  client.println("Connection: close");
  client.println("Content-Type: application/json");
  client.println("Content-Length: "+data_length);
  client.println();
  client.println(data);
 }
 else {
 Serial.println("Failure: Failed to connect to ThingSpeak");
}
//  int lmaoxd=target-posi;
//  String dataString=String(lmaoxd);
//  ThingSpeak.writeField(3,1,dataString,errorAPIKey);
 delay(15000); //Wait to receive the response
client.parseFloat();
String resp = String(client.parseInt());
Serial.println("Response code:"+resp); // Print the response code. 202 indicates that the server has accepted the response
jsonBuffer[0] = '['; // Reinitialize the jsonBuffer for next batch of data
jsonBuffer[1] = '\0';
lastConnectionTime = millis(); // Update the last connection time
  }

  void printWiFiStatus() {
 // Print the SSID of the network you're attached to:
 Serial.print("SSID: ");
 Serial.println(WiFi.SSID());

 // Print your device IP address:
 IPAddress ip = WiFi.localIP();
 Serial.print("IP Address: ");
  Serial.println(ip);

 // Print the received signal strength:
 long rssi = WiFi.RSSI();
 Serial.print("signal strength (RSSI):");
 Serial.print(rssi);
 Serial.println(" dBm");
}





void PID_control(float target,float kp, float kd, float ki)
{
//  float kp = 10;
//  float kd = 0.125;
//  float ki = 0.4;
  uint startTime = millis();
  prevT=micros();
  // time difference
  while(millis()-startTime < PID_TIMER)
  {
    if(millis()-prevT > SAMPLING_RATE)
    {
       long currT = micros();
        float deltaT = ((float) (currT - prevT))/( 1.0e6 );
        prevT = currT;
      
        // Read the position
        int pos = 0; 
        noInterrupts(); // disable interrupts temporarily while reading
        pos = posi;
        interrupts(); // turn interrupts back on
        
        // error
        float e = pos - target;
      
        // derivative
        float dedt = (e-eprev)/(deltaT);
      
        // integral
        eintegral = eintegral + e*deltaT;
      
        // control signal
        float u = kp*e + kd*dedt + ki*eintegral;
      
        // motor power
        float pwr = fabs(u);
        if( pwr > 255 ){
          pwr = 255;
        }
      
        // motor direction
        int dir = -1;
        if(u<0){
          dir = 1;
        }
      
        // signal the motor
        setMotor(dir,pwr,PWM,IN1,IN2);
      
      
        // store previous error
        eprev = e;
      
        Serial.print(target);
        Serial.print(" ");
        Serial.print(pos);
        Serial.println();

                // If update time has reached 15 seconds, then update the jsonBuffer
        if (millis() - lastUpdateTime >= updateInterval) {
          updatesJson(jsonBuffer, pos/1.15);
        }

    }
  }  
  setMotor(0,0,PWM,IN1,IN2);
  digitalWrite(IN1,LOW);
  digitalWrite(IN2,LOW);
  eintegral=0;
  eprev=0;
}

void setMotor(int dir, int pwmVal, int pwm, int in1, int in2){
  analogWrite(pwm,pwmVal);
  if(dir == 1){
    digitalWrite(in1,HIGH);
    digitalWrite(in2,LOW);
  }
  else if(dir == -1){
    digitalWrite(in1,LOW);
    digitalWrite(in2,HIGH);
  }
  else{
    digitalWrite(in1,LOW);
    digitalWrite(in2,LOW);
  }  
}

void readEncoder(){
  int b = digitalRead(ENCB);
  if(b > 0){
    posi++;
  }
  else{
    posi--;
  }
}

// to send target value to om2m
void createCI(String& val ){
  HTTPClient http;
  bool isBegin = http.begin("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-25/Node-1/Data");
  if(isBegin){
  http.addHeader("X-M2M-Origin", "tDrcSg:mPIrxD");
  http.addHeader("Content-Type", "application/json;ty=4");
  String PostReq = "{\"m2m:cin\": {\"con\": \"" + String(val) + "\"}}";
  Serial.println(PostReq);
  int code = http.POST(PostReq);
  Serial.println(code);
  if (code == -1) {
    Serial.println("UNABLE TO CONNECT TO THE SERVER");
  }
  http.end();
  }
  else
    Serial.println("Couldn't begin server!!");
}
