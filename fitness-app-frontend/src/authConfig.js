const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8181';
const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173';

export const authConfig = {
    clientId: 'oauth2-pkce-client',
    authorizationEndpoint: `${keycloakUrl}/realms/fitness-oauth2/protocol/openid-connect/auth`,
    tokenEndpoint: `${keycloakUrl}/realms/fitness-oauth2/protocol/openid-connect/token`,
    redirectUri,
    scope: 'openid profile email offline_access',
    onRefreshTokenExpire: (event) => event.logIn(),
};
