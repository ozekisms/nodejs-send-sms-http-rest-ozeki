const fetch = require('node-fetch');


class Configuration {
    constructor () {
        this.Username = null;
        this.Password = null;
        this.ApiUrl = null;
    }
}

class Message {
    constructor () {
        this.ID = uuid();
        this.FromConnection = null;
        this.FromAddress = null;
        this.FromStation = null;
        this.ToConnection = null;
        this.ToAddress = null;
        this.ToStation = null;
        this.Text = null;
        this.CreateDate = new LocalDateTime(new Date());
        this.ValidUntil = LocalDateTime(new Date().AddDays(7));
        this.TimeToSend = new LocalDateTime(new Date());
        this.IsSubmitReportRequested = true;
        this.IsDeliveryReportRequested = true;
        this.IsViewReportRequested = true;
        this.Tags = []
    }

    getTags() {
        return this.Tags;
    }

    addTag(key, value) {
        var tag = {}
        tag[key] = value;
        this.Tags.push(tag);
    }

    parseMessage(message) {
        var msg = new Message();
        if (message.hasOwnProperty("message_id")) {
            msg.ID = message.message_id;
        }
        if (message.hasOwnProperty("from_connection")) {
            msg.FromConnection = message.from_connection;
        }
        if (message.hasOwnProperty("from_address")) {
            msg.FromAddress = message.from_address;
        }
        if (message.hasOwnProperty("from_station")) {
            msg.FromStation = message.from_station;
        }
        if (message.hasOwnProperty("to_connection")) {
            msg.ToConnection = message.to_connection;
        }
        if (message.hasOwnProperty("to_address")) {
            msg.ToAddress = message.to_address;
        }
        if (message.hasOwnProperty("to_station")) {
            msg.ToStation = message.to_station;
        }
        if (message.hasOwnProperty("text")) {
            msg.Text = message.text;
        }
        if (message.hasOwnProperty("create_date")) {
            msg.CreateDate = message.create_date;
        }
        if (message.hasOwnProperty("valid_until")) {
            msg.ValidUntil = message.valid_until;
        }
        if (message.hasOwnProperty("time_to_send")) {
            msg.TimeToSend = message.time_to_send;
        }
        if (message.hasOwnProperty("submit_report_requested")) {
            msg.IsSubmitReportRequested = message.submit_report_requested;
        }
        if (message.hasOwnProperty("delivery_report_requested")) {
            msg.IsDeliveryReportRequested = message.delivery_report_requested;
        }
        if (message.hasOwnProperty("view_report_requested")) {
            msg.IsViewReportRequested = message.view_report_requested;
        }
        if (message.hasOwnProperty("tags")) {
            msg.Tags = message.tags;
        }
        var statusMessage = undefined;
        var status = undefined;
        if (message.status == "SUCCESS") {
            status = DeliveryStatus.Success;
        } else {
            status = DeliveryStatus.Failed;
            statusMessage = message.status;
        }
        return new MessageSendResult(msg, status, statusMessage);
    }

    jsonVal() {
        var message = {};
        if (this.ID != null) {
            message.message_id = this.ID;
        }
        if (this.FromConnection != null) {
            message.from_connection = this.FromConnection;
        }
        if (this.FromAddress != null) {
            message.from_address = this.FromAddress;
        }
        if (this.FromStation != null) {
            message.from_station = this.FromStation;
        }
        if (this.ToConnection != null) {
            message.to_connection = this.ToConnection;
        }
        if (this.ToAddress != null) {
            message.to_address = this.ToAddress;
        }
        if (this.ToStation != null) {
            message.to_station = this.ToStation;
        }
        if (this.Text != null) {
            message.text = this.Text;
        }
        if (this.CreateDate != null) {
            message.create_date = this.CreateDate.toISOString().split('.')[0];
        }
        if (this.ValidUntil != null) {
            message.vaild_date = this.ValidUntil.toISOString().split('.')[0];
        }
        if (this.TimeToSend != null) {
            message.time_to_send = this.TimeToSend.toISOString().split('.')[0];
        }
        if (this.IsSubmitReportRequested != null) {
            message.submit_report_requested = this.IsSubmitReportRequested;
        }
        if (this.IsDeliveryReportRequested != null) {
            message.delivery_report_requested = this.IsDeliveryReportRequested;
        }
        if (this.IsViewReportRequested != null) {
            message.view_report_requested = this.IsViewReportRequested;
        }
        if (this.Tags.length > 0) {
            message.tags = this.Tags;
        }
        return message;
    }
}

Message.prototype.toString = function() {
    return `->${ this.ToAddress } '${ this.Text }'`;
}

class MessageApi {

    constructor (configuration) {
        this._configuration = configuration;
    }

    createAuthHeader(username, password) {
        var usernamePassword = username + ":" + password;
        return `Basic ${Base64.encode(usernamePassword)}`;
    }

    createRequestBody(messages) {
        try {
            var result = {};
            if (Array.isArray(messages)) {
                var messagesArray = new Array();
                for (let i = 0; i < messages.length; i++) {
                    var msg = messages[i];
                    messagesArray.push(msg.jsonVal());
                }
                result.messages = messagesArray;
                return JSON.stringify(result);
            } else {
                var messagesArray = new Array();
                messagesArray.push(messages.jsonVal());
                result.messages = messagesArray;
                return JSON.stringify(result);
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
        
    }

    createRequestBodyToManipulate(folder, messages) {
        try {
            var result = {};
            if (Array.isArray(messages)) {
                var messageIds = new Array();
                for (let i = 0; i < messages.length; i++) {
                    messageIds.push(messages[i].ID);
                }
                result.folder = folder;
                result.message_ids = messageIds;
                return JSON.stringify(result);
            } else {
                var messageIds = new Array();
                messageIds.push(messages.ID);
                result.folder = folder;
                result.message_ids = messageIds;
                return JSON.stringify(result);
            }
        } catch(error) {
            console.log(`Error: ${error}`);
        }
    }

    Send (messages) {
        try {
            var authHeader = this.createAuthHeader(this._configuration.Username, this._configuration.Password);
            var requestBody = this.createRequestBody(messages);
            return this.DoRequestPost(this.createUriToSendMessage(this._configuration.ApiUrl), authHeader, requestBody);
        } catch (error) {
            return `Error: ${error}`;
        }
    }

    Delete (folder, messages) {
        try {
            var authHeader = this.createAuthHeader(this._configuration.Username, this._configuration.Password);
            var requestBody = this.createRequestBodyToManipulate(folder, messages);
            return this.DoRequestPost(this.createUriToDeleteMessage(this._configuration.ApiUrl), authHeader, requestBody, messages, "delete");
        } catch (error) {
            return `Error: ${error}`;
        }
    }

    Mark (folder, messages) {
        try {
            var authHeader = this.createAuthHeader(this._configuration.Username, this._configuration.Password);
            var requestBody = this.createRequestBodyToManipulate(folder, messages);
            return this.DoRequestPost(this.createUriToMarkMessage(this._configuration.ApiUrl), authHeader, requestBody, messages, "mark");
        } catch (error) {
            return `Error: ${error}`;
        }
    }

    DownloadIncoming = async () => {
        var authHeader = this.createAuthHeader(this._configuration.Username, this._configuration.Password);
        return this.DoRequestGet(this.createUriToReceiveMessage(this._configuration.ApiUrl), authHeader)
    }

    async DoRequestPost (url, authHeader, requestBody, messages, method) {
        var result = await fetch(url, {
            method : "POST",
            headers : { "Authorization" : authHeader, "Content-Type" : "application/json" },
            body : requestBody
        })
        var response = await result.json();
        if (messages) {
            return this.getMessageResponseManipulate(response, messages, method);
        } else {
            var result = this.getMessageResponse(response);
            return result;
        }
    }

    async DoRequestGet (url, authHeader) {
        var result = await fetch(url, {
            method : "GET",
            headers : { "Authorization" : authHeader }
        })
        var response = await result.json();
        return this.getMessages(response);
    }

    createUriToSendMessage (url) {
        var baseurl = url.split("?")[0];
        return `${baseurl}?action=sendmsg`;
    }

    createUriToReceiveMessage (url) {
        var baseurl = url.split("?")[0];
        return `${baseurl}?action=receivemsg&folder=${Folder.Inbox}`;
    }

    createUriToDeleteMessage(url) {
        var baseurl = url.split("?")[0];
        return `${baseurl}?action=deletemsg`;
    }

    createUriToMarkMessage(url) {
        var baseurl = url.split("?")[0];
        return `${baseurl}?action=markmsg`;
    }

    getMessageResponse (response) {
        try {
            var data = response.data;
            if (data.total_count == 1) {
                var msg = data.messages[0];
                return new Message().parseMessage(msg);
            } else if (data.total_count > 1) {
                var results = new Array();
                for (let i = 0; i < data.messages.length; i++) {
                    results.push(new Message().parseMessage(data.messages[i]));
                }
                return new MessageSendResults(data.total_count, data.success_count, data.failed_count, results);
            } else {
                return new MessageSendResults(0, 0, 0, new Array());
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } 
    }
    
    getMessageResponseManipulate(response, messages, method) {
        try {
            var folder = response.data.folder;
            var msgs = response.data.message_ids;
            if (Array.isArray(messages)) {
                if (messages.length > 1) {
                    var messages_success = new Array();
                    var messages_failed = new Array();
                    for (let i = 0; i < messages.length; i++) {
                        var success = false;
                        for (let j = 0; j < msgs.length; j++) {
                            if (msgs[j] === messages[i].ID) {
                                success = true;
                            }
                        }
                        if (success) {
                            messages_success.push(messages[i]);
                        } else {
                            messages_failed.push(messages[i]);
                        }
                    }
                    if (method == "delete") {
                        return new MessageDeleteResult(folder, messages_success, messages_failed);
                    } else {
                        return new MessageMarkResult(folder, messages_success, messages_failed);
                    }
                }
            } else {
                if (msgs.length == 1 && messages.ID == msgs[0]) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    getMessages (response) {
        try {
            var messages = response.data.data;
            var folder = response.data.folder;
            var limit = response.data.limit;

            var msgs = new Array();
            
            for (let i = 0; i < messages.length; i++) {
                var msg = new Message().parseMessage(messages[i]).Message;
                msgs.push(msg);
            }
            if (msgs.length > 0) {
                this.Delete(Folder.Inbox, msgs);
            }
            return new MessageReceiveResult(folder, limit, msgs);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
}

class MessageSendResult {
    constructor(message, status, statusMessage) {
        this.Message = message;
        this.Status = status;
        if (typeof statusMessage !== 'undefined') {
            this.StatusMessage = statusMessage;
        } else {
            this.StatusMessage = "";
        }
    }
}

MessageSendResult.prototype.toString = function() {
    return `${ this.Status }, ${ this.Message }`;
}

class MessageSendResults {
    constructor(totalCount, successCount, failedCount, results) {
        this.TotalCount = totalCount;
        this.SuccesCount = successCount,
        this.FailedCount = failedCount;
        this.Results = results;
    }
}

MessageSendResults.prototype.toString = function() {
    return `Total: ${ this.TotalCount }. Success: ${ this.SuccesCount }. Failed: ${ this.FailedCount }.`;
}

class MessageDeleteResult {
    constructor(folder, messageIdsRemoveSucceeded, messageIdsRemoveFailed) {
        this.Folder = folder;
        this.MessageIdsRemoveSucceeded = messageIdsRemoveSucceeded;
        this.MessageIdsRemoveFailed = messageIdsRemoveFailed;
        this.SuccesCount = messageIdsRemoveSucceeded.length;
        this.FailedCount = messageIdsRemoveFailed.length;
        this.TotalCount = this.SuccesCount + this.FailedCount;
    }
}

MessageDeleteResult.prototype.toString = function () {
    return `Total: ${ this.TotalCount }. Success: ${ this.SuccesCount }. Failed: ${ this.FailedCount }.`;
}

class MessageMarkResult {
    constructor(folder, messageIdsMarkSucceeded, messageIdsMarkFailed) {
        this.Folder = folder;
        this.MessageIdsMarkSucceeded = messageIdsMarkSucceeded;
        this.MessageIdsMarkFailed = messageIdsMarkFailed;
        this.SuccesCount = messageIdsMarkSucceeded.length;
        this.FailedCount = messageIdsMarkFailed.length;
        this.TotalCount = this.SuccesCount + this.FailedCount;
    }
}

MessageMarkResult.prototype.toString = function () {
    return `Total: ${ this.TotalCount }. Success: ${ this.SuccesCount }. Failed: ${ this.FailedCount }.`;
}

class MessageReceiveResult {
    constructor(folder, limit, messages) {
        this.Folder = folder,
        this.Limit = limit;
        this.Messages = messages;
        this.MessageCount = messages.length;
    }
}

MessageReceiveResult.prototype.toString = function () {
    return `Messages count: ${ this.MessageCount }.`
}

class FolderObj {
    constructor() {
        this.Inbox = "inbox";
        this.Outbox = "outbox";
        this.Sent = "sent";
        this.NotSent = "notsent";
        this.Deleted = "deleted";
    }
}

class DeliveryStatusObj {
    constructor() {
        this.Success = "Success";
        this.Failed = "Failed";
    }
}

var DeliveryStatus = new DeliveryStatusObj();
var Folder = new FolderObj();

function LocalDateTime(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate;
}

Date.prototype.AddDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; i++) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
}; 

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

function uuid() {
    var u='',i=0;
    while(i++<36) {
        var c='xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
        u+=(c=='-'||c=='4')?c:v.toString(16)
    }
    return u;
}

module.exports.Configuration = Configuration;
module.exports.MessageApi = MessageApi;
module.exports.Message = Message;
module.exports.Folder = Folder;