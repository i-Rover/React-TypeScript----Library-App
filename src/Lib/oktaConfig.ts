export const oktaConfig = {
    clientId            :   '0oa9100yjhDHmSgPs5d7',
    issuer              :   'https://dev-46114195.okta.com/oauth2/default',
    redirectUri         :   'http://localhost:3000/login/callback',
    scopes              :   ['openid','profile','email'],
    pkce                :   true,
    disableHttpChecks   :   true,
}