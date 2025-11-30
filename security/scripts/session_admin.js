

function sendingRequest(msg, initiator, helper) {

    var url = msg.getRequestHeader().getURI().toString();
    
    var token = org.zaproxy.zap.extension.script.ScriptVars.getGlobalVar("ADMIN_JWT");

    if (token && url.indexOf("localhost:8000/api") !== -1 && url.indexOf("/login/") === -1) {
        msg.getRequestHeader().setHeader("Authorization", "Bearer " + token);
    }
}

function responseReceived(msg, initiator, helper) {
    if (msg.getResponseHeader().getStatusCode() == 401) {
        print("Admin Token potentially expired for: " + msg.getRequestHeader().getURI().toString());
    }
}
