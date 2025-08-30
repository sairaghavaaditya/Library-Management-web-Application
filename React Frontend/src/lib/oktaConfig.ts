import { Redirect } from "react-router-dom";

export const oktaConfig = {
    clientId: '0oanr23ft9ep2ZW7G5d7',
    issuer: 'https://dev-25959890.okta.com/oauth2/default',
    redirectUri:'https://localhost:3000/login/callback',
    scopes:['openid','profile','email'],
    pkce:true,
    disableHttpsCheck: true,

}
export default oktaConfig;