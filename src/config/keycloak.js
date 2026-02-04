require('dotenv').config();
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const {
  KEYCLOAK_ENABLED,
  KEYCLOAK_REALM,
  KEYCLOAK_AUTH_SERVER_URL,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM_PUBLIC_KEY,
  KEYCLOAK_CLIENT_SECRET
} = process.env;

const enabled = KEYCLOAK_ENABLED === 'true' || KEYCLOAK_ENABLED === '1';
const hasConfig = KEYCLOAK_REALM && KEYCLOAK_AUTH_SERVER_URL && KEYCLOAK_CLIENT_ID;

let sessionStore = null;
let keycloakInstance = null;

if (enabled && hasConfig) {
  sessionStore = new session.MemoryStore();
  const config = {
    realm: KEYCLOAK_REALM,
    'auth-server-url': KEYCLOAK_AUTH_SERVER_URL.replace(/\/$/, ''),
    'ssl-required': 'external',
    resource: KEYCLOAK_CLIENT_ID,
    'bearer-only': true,
    'public-client': !KEYCLOAK_CLIENT_SECRET
  };
  if (KEYCLOAK_REALM_PUBLIC_KEY) config['realm-public-key'] = KEYCLOAK_REALM_PUBLIC_KEY;
  if (KEYCLOAK_CLIENT_SECRET) config.credentials = { secret: KEYCLOAK_CLIENT_SECRET };
  keycloakInstance = new Keycloak({ store: sessionStore }, config);
} else if (enabled && !hasConfig) {
  console.warn('Keycloak enabled but KEYCLOAK_REALM/AUTH_SERVER_URL/CLIENT_ID missing. RBAC disabled.');
}

module.exports = {
  keycloak: keycloakInstance,
  sessionStore,
  isKeycloakEnabled: !!keycloakInstance
};
