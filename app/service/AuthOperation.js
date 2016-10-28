var {EventEmitter} = require('fbemitter');
import { storageService } from './StorageService';
import { authConfig } from './authConfig';

export var authEmitter = new EventEmitter();

class AuthOperation {
  constructor() {
    this.serverAddress = 'https://ossauth.appbase.io';
    // this.serverAddress = 'http://127.0.0.1:3000';
    // this.serverAddress = 'http://40.76.86.68:3000';
    this.auth0 = new Auth0(authConfig);
    this.isTokenExpired = this.isTokenExpired.bind(this);
    this.show_logged_in = this.show_logged_in.bind(this);
    this.login = this.login.bind(this);
    // check if already logged in
    this.parseHash.call(this);
  }
  isTokenExpired(token) {
    var decoded = this.auth0.decodeJwt(token);
    var now = (new Date()).getTime() / 1000;
    return decoded.exp < now;
  }
  login(subscribeOption) {
    let savedState = window.location.hash;
    storageService.set('subscribeOption', subscribeOption);
    if (savedState.indexOf('access_token') < 0) {
      storageService.set('savedState', savedState);
    }
    this.auth0.login({
      connection: 'github'
    }, function(err) {
      if (err) console.log("something went wrong: " + err.message);
    });
  }
  show_logged_in(token) {
    this.token = token;
    if (window.location.hash.indexOf('access_token') > -1) {
      this.restoreStates();
    } else {
      this.getUserProfile();
    }
  }
  show_sign_in() {}
  restoreStates() {
    let domain = location.href.split('#')[0];
    let savedState = storageService.get('savedState');
    let finalPath = domain;
    if (savedState && savedState.indexOf('access_token') < 0) {
      finalPath += savedState;
    } else {
      finalPath += '#';
    }
    window.location.href = finalPath;
    location.reload();
  }
  getUserProfile() {
    var url = this.serverAddress+'/api/getUserProfile';
    let subscribeOption = storageService.get('subscribeOption') && storageService.get('subscribeOption') !== 'null' ? storageService.get('subscribeOption') : null;
    var request = {
      token: storageService.get('id_token'),
      origin_app: 'GEM',
      email_preference: subscribeOption
    };
    $.ajax({
      type: 'POST',
      url: url,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(request)
    })
    .done(function(res) {
      storageService.set('subscribeOption', null);
      authEmitter.emit('profile', res.message);
    })
    .fail(function(err) {
      console.error(err);
    });
  }
  parseHash() {
    var token = storageService.get('id_token');
    if (token !== null && !this.isTokenExpired(token)) {
      this.show_logged_in(token);
    } else {
      var result = this.auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        storageService.set('id_token', result.idToken);
        this.show_logged_in(result.idToken);
      } else if (result && result.error) {
        console.log('error: ' + result.error);
        this.show_sign_in();
      } else {
        this.show_sign_in();
      }
    }
  }
}

export const authOperation = new AuthOperation();
