import { Configuration, Message, MessageApi } from './Ozeki.Libs.Rest.js';


var configuration = new  Configuration();
configuration.Username = "http_user";
configuration.Password = "qwe123";
configuration.ApiUrl = "http://127.0.0.1:9509/api";

var msg1 = new Message();
msg1.ToAddress = "+36201111111";
msg1.Text = "Hello world 1";

var msg2 = new Message();
msg2.ToAddress = "+36202222222";
msg2.Text = "Hello world 2";

var msg3 = new Message();
msg3.ToAddress = "+36203333333";
msg3.Text = "Hello world 3";

var messages = new Array();

messages.push(msg1);
messages.push(msg2);
messages.push(msg3);

var api = new MessageApi(configuration);

const result = await api.Send(messages);

console.log(result.toString());