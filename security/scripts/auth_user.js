// The authenticate function is called by ZAP to authenticate.
// Type: Authentication
// Role: User Normal

function authenticate(helper, paramsValues, credentials) {
    var loginUrl = paramsValues.get("loginUrl");
    var username = credentials.getParam("username");
    var password = credentials.getParam("password");

    print("Authenticating User: " + username);


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
    print("Login Response: " + responseBody);

    try {
        var json = JSON.parse(responseBody);
        if (json.access) {
            org.zaproxy.zap.extension.script.ScriptVars.setGlobalVar("USER_JWT", json.access);
            print("User Login Successful. Token stored.");
        } else {
            print("User Login Failed: No access token found.");
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
