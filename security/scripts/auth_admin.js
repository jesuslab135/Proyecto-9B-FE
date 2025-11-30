// The authenticate function is called by ZAP to authenticate.
// Type: Authentication
// Role: Admin

function authenticate(helper, paramsValues, credentials) {
    var loginUrl = paramsValues.get("loginUrl");
    var username = credentials.getParam("username");
    var password = credentials.getParam("password");

    print("Authenticating Admin: " + username);

    var requestBody = '{"username":"' + username + '", "password":"' + password + '"}';

    var msg = helper.prepareMessage();
    var requestHeader = new org.parosproxy.paros.network.HttpRequestHeader(
        org.parosproxy.paros.network.HttpRequestHeader.POST, 
        new org.apache.commons.httpclient.URI(loginUrl, true), 
        "HTTP/1.1"
    );
    requestHeader.setHeader("Content-Type", "application/json");
    msg.setRequestHeader(requestHeader);
    msg.setRequestBody(requestBody);
    msg.getRequestHeader().setContentLength(msg.getRequestBody().length());

    helper.sendAndReceive(msg);

    var responseBody = msg.getResponseBody().toString();
    print("Admin Login Response: " + responseBody);

    try {
        var json = JSON.parse(responseBody);
        if (json.access) {
        
            org.zaproxy.zap.extension.script.ScriptVars.setGlobalVar("ADMIN_JWT", json.access);
            print("Admin Login Successful. Token stored.");
        } else {
            print("Admin Login Failed: No access token found.");
        }
    } catch (e) {
        print("Error parsing login response: " + e);
    }

    return msg;
}

function getRequiredParamsNames() {
    return ["loginUrl"];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamsNames() {
    return ["username", "password"];
}
