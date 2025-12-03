import time
import os
import sys
import requests
import json

# Configuration
ZAP_API_KEY = os.environ.get('ZAP_API_KEY', 'enbg17v8q0d9du6fnjd39df5kn')
ZAP_PORT = os.environ.get('ZAP_PORT', '8080')
ZAP_ADDR = os.environ.get('ZAP_ADDR', '127.0.0.1') # Force IPv4 to avoid localhost resolution issues
BASE_URL = f'http://{ZAP_ADDR}:{ZAP_PORT}'

# Paths (Absolute paths are safer for ZAP)
BASE_DIR = os.getcwd()
SECURITY_DIR = os.path.join(BASE_DIR, 'security')
CONTEXTS_DIR = os.path.join(SECURITY_DIR, 'contexts')
SCRIPTS_DIR = os.path.join(SECURITY_DIR, 'scripts')
REPORTS_DIR = os.path.join(SECURITY_DIR, 'reports')

def zap_request(url, params=None):
    headers = {
        'X-ZAP-API-Key': ZAP_API_KEY,
        'Accept': 'application/json',
        'Connection': 'close' # Prevent keep-alive issues
    }
    if params is None:
        params = {}
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        
        # If it's a JSON endpoint, return parsed JSON
        if '/JSON/' in url:
            return response.json()
        # If it's OTHER (like reports), return raw text
        return response.text
    except Exception as e:
        print(f"Error calling ZAP API {url}: {e}")
        # Print response content if available for debugging
        try:
            print(f"Response: {response.text}")
        except:
            pass
        raise

def wait_for_zap():
    print("Waiting for ZAP to be ready...")
    url = f'{BASE_URL}/JSON/core/view/version/'
    retries = 0
    while retries < 20:
        try:
            zap_request(url)
            print("ZAP is ready!")
            return
        except Exception:
            time.sleep(2)
            retries += 1
    raise Exception("ZAP failed to start")

def load_script(name, type, engine, file_path):
    print(f"Loading script: {name}")
    # Remove existing script if it exists (ignore errors)
    try:
        zap_request(f'{BASE_URL}/JSON/script/action/remove/', {'scriptName': name})
    except:
        pass
    
    # Load new script
    params = {
        'scriptName': name,
        'scriptType': type,
        'scriptEngine': engine,
        'fileName': file_path
    }
    res = zap_request(f'{BASE_URL}/JSON/script/action/load/', params)
    print(f"Load result: {res}")
    
    # Enable script (Only needed for some types, but good practice)
    # Note: Authentication scripts don't always need explicit 'enable' via API if loaded correctly
    try:
        zap_request(f'{BASE_URL}/JSON/script/action/enable/', {'scriptName': name})
    except Exception as e:
        print(f"Note: Could not enable script {name} (might not be required for this type). Error: {e}")

def get_context_id(context_name):
    """Helper to get the numeric Context ID from its name."""
    try:
        # Try to get context details by name
        res = zap_request(f'{BASE_URL}/JSON/context/view/context/', {'contextName': context_name})
        if 'context' in res and 'id' in res['context']:
            return res['context']['id']
    except Exception:
        pass
    return None

def setup_context(role, target_url):
    context_name = "User Context" if role == 'user' else "Admin Context"
    print(f"Setting up context: {context_name}")
    
    # 1. Create Context (or get ID if exists)
    context_id = None
    try:
        res = zap_request(f'{BASE_URL}/JSON/context/action/newContext/', {'contextName': context_name})
        context_id = res.get('newContext')
    except Exception:
        print("Context might already exist.")

    # If creation didn't return ID (or failed), try to fetch it
    if not context_id:
        context_id = get_context_id(context_name)
    
    if not context_id:
        # Fallback: use name as ID (some endpoints support this)
        print(f"Warning: Could not retrieve numeric ID for {context_name}. Using name.")
        context_id = context_name

    print(f"Using Context: {context_id}")

    # 2. Configure Scope
    # Clear previous scope to be safe (optional, but good if re-running)
    # zap_request(f'{BASE_URL}/JSON/context/action/removeContext/', {'contextName': context_name}) # Dangerous if we just created it
    
    # Include Regexes
    includes = [
        f'http://localhost:5173/.*',
        f'http://localhost:8000/api/.*'
    ]
    if role == 'admin':
        includes = [
            f'http://localhost:5173/admin/.*',
            f'http://localhost:8000/api/admin/.*'
        ]

    for regex in includes:
        zap_request(f'{BASE_URL}/JSON/context/action/includeInContext/', {'contextName': context_name, 'regex': regex})
    
    # Exclude Regexes
    excludes = [
        r'http://localhost:5173/assets/.*',
        r'.*\.png', r'.*\.jpg', r'.*\.css', r'.*\.js'
    ]
    
    for regex in excludes:
        try:
            zap_request(f'{BASE_URL}/JSON/context/action/excludeFromContext/', {'contextName': context_name, 'regex': regex})
        except:
            pass # Ignore errors on excludes

    return context_id

def run_scan(role, context_filename, target_url, username, password):
    print(f"\n--- Starting Security Scan for Role: {role} ---")
    
    # 1. Setup Context Programmatically (Avoids XML issues)
    context_id = setup_context(role, target_url)
    
    # 2. Configure Authentication Method (Script-based)
    print("Configuring Authentication Method...")
    auth_script_name = f"auth_{role}.js"
    login_url = "http://localhost:8000/api/login/"
    
    # Params format: scriptName=name&param1=value1
    # IMPORTANT: contextId parameter is required
    auth_params = f"scriptName={auth_script_name}&loginUrl={login_url}"
    
    zap_request(f'{BASE_URL}/JSON/authentication/action/setAuthenticationMethod/', {
        'contextId': context_id,
        'authMethodName': 'scriptBasedAuthentication',
        'authMethodConfigParams': auth_params
    })
    
    # 3. Configure Indicators
    print("Configuring Session Indicators...")
    if role == 'admin':
        loggedin_regex = '\\Q"is_superuser":true\\E'
    else:
        loggedin_regex = '\\Q"success":true\\E'
        
    loggedout_regex = '\\Q"detail":"Authentication credentials were not provided."\\E'
    
    zap_request(f'{BASE_URL}/JSON/authentication/action/setLoggedInIndicator/', {
        'contextId': context_id,
        'loggedInIndicatorRegex': loggedin_regex
    })
    zap_request(f'{BASE_URL}/JSON/authentication/action/setLoggedOutIndicator/', {
        'contextId': context_id,
        'loggedOutIndicatorRegex': loggedout_regex
    })

    # 4. Create User Programmatically
    print(f"Creating user {username}...")
    user_id = None
    try:
        res = zap_request(f'{BASE_URL}/JSON/users/action/newUser/', {'contextId': context_id, 'name': username})
        print(f"newUser response: {res}")
        user_id = res.get('newUser')
    except Exception as e:
        print(f"Note: Error creating user (might already exist): {e}")

    if not user_id:
        print("User ID not returned. Checking if user already exists...")
        try:
            user_list_res = zap_request(f'{BASE_URL}/JSON/users/view/usersList/', {'contextId': context_id})
            users = user_list_res.get('usersList', [])
            print(f"Existing users: {users}")
            for user in users:
                if user.get('name') == username:
                    user_id = user.get('id')
                    print(f"Found existing user ID: {user_id}")
                    break
        except Exception as e:
            print(f"Error listing users: {e}")
    
    # 5. Set Credentials
    # Format: username=value&password=value
    # IMPORTANT: The parameter name is 'authCredentialsConfigParams' but sometimes ZAP expects 'authCredentialsConfigParams' 
    # AND 'userId' AND 'contextId'.
    # Let's double check the API call. It seems correct but maybe the userId is missing in the error log?
    # Wait, the error says "Missing Parameter".
    # In some ZAP versions, setAuthenticationCredentials requires 'userId' to be passed as 'userId' (integer) not string?
    # Or maybe the user creation failed silently? No, we got an ID.
    
    # Let's try to be explicit with userId
    if not user_id:
         raise Exception("Failed to create or find user, no ID returned")

    auth_credentials_config_params = f"username={username}&password={password}"
    
    # Debug print
    print(f"Setting credentials for User ID: {user_id} in Context ID: {context_id}")
    
    zap_request(f'{BASE_URL}/JSON/users/action/setAuthenticationCredentials/', {
        'contextId': context_id, 
        'userId': int(user_id), # Ensure it's an integer
        'authCredentialsConfigParams': auth_credentials_config_params
    })
    
    # 6. Enable User
    zap_request(f'{BASE_URL}/JSON/users/action/setUserEnabled/', {'contextId': context_id, 'userId': user_id, 'enabled': 'true'})
    
    # 7. Set Forced User (Optional, but good for Zest)
    zap_request(f'{BASE_URL}/JSON/forcedUser/action/setForcedUser/', {'contextId': context_id, 'userId': user_id})
    zap_request(f'{BASE_URL}/JSON/forcedUser/action/setForcedUserModeEnabled/', {'boolean': 'true'})
    
    print(f"User {username} (ID: {user_id}) configured and enabled.")
    
    # 8. Spider (Authenticated)
    print(f"Starting Authenticated Spider on {target_url}...")
    params = {
        'contextId': context_id,
        'userId': user_id,
        'url': target_url
    }
    res = zap_request(f'{BASE_URL}/JSON/spider/action/scanAsUser/', params)
    scan_id = res.get('scanAsUser')
    
    while True:
        status_res = zap_request(f'{BASE_URL}/JSON/spider/view/status/', {'scanId': scan_id})
        status = int(status_res.get('status', 0))
        if status >= 100:
            break
        print(f"Spider progress: {status}%")
        time.sleep(2)
    print("Spider completed.")
    
    # 9. Active Scan (Authenticated)
    print(f"Starting Authenticated Active Scan on {target_url}...")
    params = {
        'contextId': context_id,
        'userId': user_id,
        'url': target_url
    }
    res = zap_request(f'{BASE_URL}/JSON/ascan/action/scanAsUser/', params)
    scan_id = res.get('scanAsUser')
    
    while True:
        status_res = zap_request(f'{BASE_URL}/JSON/ascan/view/status/', {'scanId': scan_id})
        status = int(status_res.get('status', 0))
        if status >= 100:
            break
        print(f"Active Scan progress: {status}%")
        time.sleep(5)
    print("Active Scan completed.")
    
    # 10. Generate Reports
    print("Generating reports...")
    report_html = zap_request(f'{BASE_URL}/OTHER/core/other/htmlreport/')
    report_json = zap_request(f'{BASE_URL}/OTHER/core/other/jsonreport/')
    
    with open(os.path.join(REPORTS_DIR, f'report_{role}.html'), 'w', encoding='utf-8') as f:
        f.write(report_html)
    
    with open(os.path.join(REPORTS_DIR, f'report_{role}.json'), 'w', encoding='utf-8') as f:
        f.write(report_json)
        
    print(f"Reports saved to {REPORTS_DIR}")

def get_js_engine():
    try:
        res = zap_request(f'{BASE_URL}/JSON/script/view/listEngines/')
        engines = res.get('listEngines', [])
        print(f"Available Script Engines: {engines}")
        
        # Priority list for JS engines
        for engine in engines:
            if "Graal.js" in engine:
                return engine
            if "Nashorn" in engine:
                return engine
            if "ECMAScript" in engine:
                return engine
        
        # If we are here, no JS engine was found
        print(f"ERROR: No JavaScript engine found in ZAP. Installed engines: {engines}")
        print("Please install the 'GraalVM JavaScript' add-on from the ZAP Marketplace.")
        sys.exit(1)

    except Exception as e:
        print(f"Warning: Could not list engines. Error: {e}")
        sys.exit(1)

def main():
    try:
        wait_for_zap()
        
        # Detect best available JS engine
        engine = get_js_engine()
        print(f"Selected Script Engine: {engine}")
        
        load_script("auth_user.js", "authentication", engine, os.path.join(SCRIPTS_DIR, "auth_user.js"))
        load_script("auth_admin.js", "authentication", engine, os.path.join(SCRIPTS_DIR, "auth_admin.js"))
        load_script("session_user.js", "httpsender", engine, os.path.join(SCRIPTS_DIR, "session_user.js"))
        load_script("session_admin.js", "httpsender", engine, os.path.join(SCRIPTS_DIR, "session_admin.js"))
        
        # Run Scans
        run_scan('user', 'user_context.context', 'http://localhost:5173/dashboard', 'minibodegas@gmail.com', '123qwe')
        run_scan('admin', 'admin_context.context', 'http://localhost:5173/admin/dashboard', 'rlminibodegas@gmail.com', '123qwe')
        
        print("\nAll scans completed successfully.")
        
    except Exception as e:
        print(f"Error during scan: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
