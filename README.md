# Node.js sms library to send sms with http/rest/json

This node.js sms library enables you to **send sms** from node.js with http requests. 
You may also use it to **receive sms** from node.js with http downloads. The library
uses HTTP Post requests and JSON encoded content to send the text
messages to the mobile network1. It connects to the HTTP SMS API of 
[Ozeki SMS gateway](https://ozeki-sms-gateway.com). This repository is better
for implementing SMS solutions then other alternatives, because it allows
you to use the same code to send SMS through an Android mobile, through
a high performance IP SMS connection or a GSM modem or modem pool. This
library gives you SMS service provider independence.

## What is Ozeki SMS Gateway 

The Ozeki SMS Gateway is a 

Download: [Ozeki SMS Gateway download page](https://ozeki-sms-gateway.com/p_727-download-sms-gateway.html)

Tutorial: [node.js send sms sample and tutorial](https://ozeki-sms-gateway.com/p_840-node-js-send-sms-with-the-http-rest-api-code-sample.html)

## How to send sms from node.js: 

**To send sms from node.js**
1. [Download Ozeki SMS Gateway](https://ozeki-sms-gateway.com/p_727-download-sms-gateway.html)
2. [Connect Ozeki SMS Gateway to the mobile network](https://ozeki-sms-gateway.com/p_70-mobile-network-connections.html)
3. [Create an HTTP SMS API user](https://ozeki-sms-gateway.com/p_2102-create-an-http-sms-api-user-account.html)
4. Checkout the Github send SMS from node.js repository
5. Visual Studio Code or Windows Notepad
6. Download the example project above
7. Create the SMS by creating a new Message object
8. Create an api to send your message
9. Use the Send method to send your message

## How to use the code

To use the code you need to import the Ozeki.Libs.Rest sms library. This
sms library is also included in this repositry with it's full source code.

To authenticate the node.js sms client, you need to change the password and the username. You can do this by sending it in a base 64 encoded string to the server in a HTTP request. The correct format is:**base64(username+":"+password)**

```
import { Configuration, Message, MessageApi } from './Ozeki.Libs.Rest.js';
 
 
var configuration = new  Configuration();
configuration.Username = "http_user";
configuration.Password = "qwe123";
configuration.ApiUrl = "http://127.0.0.1:9509/api";
 
var api = new MessageApi(configuration);
 
var msg = new Message();
msg.ToAddress = "+36201111111";
msg.Text = "Hello world!";
 
const result = await api.Send(msg);
 
console.log(result.toString());
```

## Manual

If you want to understand every aspect of the **SMS code example** above, the webpage below is good to visist. You can find videos, explenations and downloadable content in the following url:

Link: [How to send sms from Node.js](https://ozeki-sms-gateway.com/p_840-node-js-send-sms-with-the-http-rest-api-code-sample.html)


## How to send sms through your Android mobile phone

If you wish to [send SMS through your Android mobile phone from node.js](https://android-sms-gateway.com/), 
you need to [install Ozeki SMS Gateway on your Android](https://ozeki-sms-gateway.com/p_2847-how-to-install-ozeki-sms-gateway-on-android.html) 
mobile phone. It is recommended to use an Android mobile phone with a minimum of 
4GB RAM and a quad core CPU. Most devices today meet these specs. The advantage
of using your mobile, is that it is quick to setup and it often allows you
to [send sms free of charge](https://android-sms-gateway.com/p_246-how-to-send-sms-free-of-charge.html).

[Android SMS Gateway](https://android-sms-gateway.com)

## Get started now

Don't waste any time, download the repository now, and send your first SMS!
