import { Configuration, Folder, Message, MessageApi } from './Ozeki.Libs.Rest.js';


var configuration = new  Configuration();
configuration.Username = "http_user";
configuration.Password = "qwe123";
configuration.ApiUrl = "http://127.0.0.1:9509/api";

var msg = new Message();
msg.ID = "49c4bec8-348b-42c4-ba56-dee741bc3160";

var api = new MessageApi(configuration);

const result = await api.Delete(Folder.Inbox, msg);

console.log(result);