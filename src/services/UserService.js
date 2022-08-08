import Keycloak from 'keycloak-js';

const initOptions = {
    url: `http://localhost:8180/auth/`,
    realm: 'master',
    clientId: 'master-realm'
};

const keycloakContext = new Keycloak(initOptions);

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 * https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
 *
 * @param onAuthenticatedCallback
 */

export const initKeycloak = (onAuthenticatedCallback) => {
    keycloakContext.init({ onLoad: 'login-required' })
        .then((authenticated) => {
            if (authenticated) {
                onAuthenticatedCallback(keycloakContext.tokenParsed?.preferred_username);
            }
        });
};

export const doLogin = keycloakContext.login;

export const doLogout= (successCallback) => keycloakContext.logout({redirectUri:window.location.origin}).then(successCallback);

export const getToken = () => keycloakContext.token;

const isLoggedIn = () => !!keycloakContext.token;

export const updateToken = (successCallback) => keycloakContext.updateToken(5).then(successCallback).catch(doLogin);

export const getUsername = () => keycloakContext.tokenParsed?.preferred_username;

export const getUserId = () => keycloakContext.tokenParsed?.email;

export const getName = () => `${keycloakContext.tokenParsed?.given_name} ${keycloakContext.tokenParsed?.family_name}`;

export const getFirstName = () => `${keycloakContext.tokenParsed?.given_name}`;
export const getLastName = () => `${keycloakContext.tokenParsed?.family_name}`;

export const hasRole = (roleName) => keycloakContext.hasRealmRole(roleName);

const hasBackofficeRole = () => keycloakContext.hasRealmRole('BackOffice');

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
  hasBackofficeRole,
  getName,
  getFirstName,
  getLastName,
  getUserId
};

export default UserService;