// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'hf09cxrehd'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-uzbbwb1udd6opcaq.us.auth0.com',            // Auth0 domain
  clientId: 'UsPQnP2xAejZpN3eBwv4uUq9xqX7JwLU',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
