import { Configuration, MessageApi } from './Ozeki.Libs.Rest.js';


var configuration = new  Configuration();
configuration.Username = "http_user";
configuration.Password = "qwe123";
configuration.ApiUrl = "http://127.0.0.1:9509/api";

var api = new MessageApi(configuration);

const result = await api.DownloadIncoming();

console.log(result.toString());

for (let i = 0; i < result.MessageCount; i++) {
    console.log(result.Messages[i].toString());
}