import Object from '@ember/object';
import Service from '@ember/service';
import {getObject, setObject} from "../utils/storage";

const SETTINGS_KEY = 'user_settings';
const TOKENS_KEY = 'user_tokens';
const PROPERTIES = ['githubTokenModalSeen']

// Use github_com instead of github.com for localstorage because of ember `set`
// and `get` internals
const userSettings = Service.extend({
  init() {
    this._super(...arguments);
    this.tokens = Object.create({
      'github_com': null
    });
    this.reload();
  },

  reload() {
    this.reloadSettings();
    this.reloadToken();
  },

  reloadSettings() {
    const settings = getObject(SETTINGS_KEY) || {};

    // Only set property defined in PROPERTIES
    for(let property of PROPERTIES) {
      this.set(property, settings[property]);
    }
  },

  reloadToken() {
    const tokens = getObject(TOKENS_KEY) || {};
    for(let key in tokens) {
      this.tokens.set(key, tokens[key]);
    }
  },

  setSetting(setting, value) {
    this.set(setting, value);
    this.persistSettings();
    return setting;
  },

  setToken(service, token) {
    this.tokens.set(service, token);
    this.persistTokens();
    return token;
  },

  persistSettings() {
    let currentSettings = {};
    for(let property of PROPERTIES) {
      currentSettings[property] = this.get(property);
    }
    setObject(SETTINGS_KEY, currentSettings);
  },

  persistTokens() {
    setObject(TOKENS_KEY, this.tokens);
  }

});

export default userSettings;
