import { urlShare } from './UrlShare';
import { storageService } from './StorageService';

class DataOperation {
  constructor() {
    this.inputState = {
      url: '',
      appname: '',
      selectedType: []
    };
    this.defaultApp1 = {
      appname: '2016primaries',
      url: 'https://Uy82NeW8e:c7d02cce-94cc-4b60-9b17-7e7325195851@scalr.api.appbase.io',
      selectedType: []
    };
    this.defaultApp = {
      url: 'https://VV3IsiOap:f937dbed-9b5d-4fc2-9ce8-55f2f495d1a5@scalr.api.appbase.io',
      appname: 'heatmap-sample'
    };
  }
  // Get input stats from url
  getInputState() {
    return new Promise((resolve, reject) => {
      let config = null;
      let isDefault = window.location.href.indexOf('#?default=true') > -1 ? true : false;
      let isInputState = window.location.href.indexOf('input_state=') > -1 ? true : false;
      if(isDefault) {
        this.updateInputState(this.defaultApp);
        resolve(this.defaultApp);
      } else if(!isInputState) {
        reject('learn');
      }
      else {
        urlShare.decryptUrl().then((data) => {
          var decryptedData = data. data;
          if(decryptedData && decryptedData.config) {
            this.updateInputState(decryptedData.config);
            resolve(decryptedData.config);
          } else {
            reject(null);
          }
        });
      }
    });
  }
  //Get config from localstorage 
  getLocalConfig() {
    var url = storageService.get('gem-url');
    var appname = storageService.get('gem-appname');
    let appsList = this.getAppsList();
    return {
      appsList: appsList,
      url: url,
      appname: appname
    };
  }
  // get appsList from storage
  getAppsList() {
    var appsList = storageService.get('gem-appsList');
    if(appsList) {
      try {
        appsList = JSON.parse(appsList);
      } catch(e) {
        appsList = [];
      }
    } else {
      appsList = [];
    }
    return appsList;
  }
  // updateInputState
  updateInputState(inputState) {
    this.inputState = inputState;
    storageService.set('gem-appname', inputState.appname);
    storageService.set('gem-url', inputState.url);
  }
  // get mapping
  getMapping() {
    let requestConfig = this.requestConfig = this.filterurl(this.inputState.url); 
    let url = this.requestConfig.url + '/' + this.inputState.appname + '/_mapping';
    return $.ajax({
      type: 'GET',
      beforeSend: function(request) {
        request.setRequestHeader('Authorization', 'Basic ' + btoa(requestConfig.username + ':' + requestConfig.password));
      },
      url: url,
      xhrFields: {
        withCredentials: true
      }
    });
  }
  // update mapping
  updateMapping(request, type) {
    let requestConfig  = this.filterurl(this.inputState.url);
    let url = this.requestConfig.url + '/' + this.inputState.appname+ '/_mapping/'+type;
    return $.ajax({
      type: 'PUT',
      beforeSend: function(request) {
        request.setRequestHeader('Authorization', 'Basic ' + btoa(requestConfig.username + ':' + requestConfig.password));
      },
      url: url,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(request),
      xhrFields: {
        withCredentials: true
      }
    });
  }
  filterurl(url) {
      if (url) {
          var obj = {
              username: 'test',
              password: 'test',
              url: url
          };
          var urlsplit = url.split(':');
          try {
              obj.username = urlsplit[1].replace('//', '');
              var httpPrefix = url.split('://');
              if(urlsplit[2]) {
                  var pwsplit = urlsplit[2].split('@');
                  obj.password = pwsplit[0];
                  if(url.indexOf('@') !== -1) {
                      obj.url = httpPrefix[0] + '://' + pwsplit[1];
                      if(urlsplit[3]) {
                          obj.url += ':'+urlsplit[3];
                      }
                  }
              }
          } catch(e) {
              console.log(e);
          }
          return obj;
      } else {
          return null;
      }
    }

}

export const dataOperation = new DataOperation();
