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