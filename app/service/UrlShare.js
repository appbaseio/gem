class UrlShare {
	constructor() {
		this.secret = 'e';
		this.decryptedData = {};
		this.inputs = {};
		this.url = '';
	}
	getInputs() {
		return this.inputs;
	}
	setInputs(inputs, changeUrl=true) {
		this.inputs = inputs;
		if(changeUrl) {
			this.createUrl();
		}
	}
	createUrl() {
		var inputs = JSON.parse(JSON.stringify(this.inputs));
		this.compress(inputs, compressCb.bind(this));
		function compressCb(error, ciphertext) {
			if (error) {
				console.log(error);
				return;
			}
			this.url = ciphertext;
			if (window.location.href.indexOf('#?default=true') > -1) {
				window.location.href = window.location.href.split('?default=true')[0];
			}
			let finalUrl = '#?input_state=' + ciphertext;
			for(let params in this.queryParams) {
				if(params !== 'input_state') {
					console.log(params, this.queryParams[params]);
					finalUrl += '&'+params+'='+this.queryParams[params];
				}
			}
			window.location.href = finalUrl;
		}
	}
	decryptUrl(queryParams) {
		return new Promise((resolve, reject) => {
			if (queryParams && queryParams.input_state) {
				this.decompress(queryParams.input_state, function(error, data) {
					resolve({ error: error, data: data });
				});
			} else {
				resolve({ error: 'Empty url' });
			}
		});
	}
	convertToUrl() {
		var ciphertext = this.url;
		let	final_url = 'https://opensource.appbase.io/gem/#?input_state=' + ciphertext;
		return final_url;
	}
	dejavuLink() {
		let obj = {
			url: this.inputs.url,
			appname: this.inputs.appname,
			selectedType: this.inputs.selectedType
		};
		let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), 'dejvu').toString();
		let final_url = 'https://opensource.appbase.io/dejaVu/live/#?input_state=' + ciphertext;
		return final_url;
	}
	mirageLink() {
		let inputs = {
			config: {
				url: this.inputs.url,
				appname: this.inputs.appname
			},
			selectedTypes: this.inputs.selectedType
		};
		return new Promise((resolve, reject) => {
			this.compress(inputs, compressCb);
			function compressCb(error, ciphertext) {
				if (error) {
					reject(error);
					return;
				}
				else {
					let final_url = 'https://opensource.appbase.io/mirage/#?input_state=' + ciphertext;
					resolve(final_url);
				}
			}
		});
	}
	mappingUrl(obj) {	
		return new Promise((resolve, reject) => {
			var inputs = JSON.parse(JSON.stringify(this.inputs));
			this.compress(inputs, compressCb.bind(this));
			function compressCb(error, ciphertext) {
				if(error) {
					reject(error);
				} else {
					let final_url = 'https://opensource.appbase.io/gem/#?input_state=' + ciphertext;
					resolve(final_url);
				}
			}
		});	
	}
	mappingUrlWithoutApp(obj) {	
		return new Promise((resolve, reject) => {
			var inputs = JSON.parse(JSON.stringify(obj));
			this.compress(inputs, compressCb.bind(this));
			function compressCb(error, ciphertext) {
				if(error) {
					reject(error);
				} else {
					let final_url = 'https://opensource.appbase.io/gem/#?input_state=' + ciphertext;
					resolve(final_url);
				}
			}
		});	
	}
	compress(jsonInput, cb) {
		if (!jsonInput) {
			return cb('Input should not be empty');
		} else {
			var packed = JSON.stringify(jsonInput);
			JSONURL.compress(packed, 9, function(res, error) {
				try {
					var result = SafeEncode.buffer(res);
					cb(null, SafeEncode.encode(result));
				} catch (e) {
					cb(e);
				}
			});
		}
	}

	decompress(compressed, cb) {
		var self = this;
		if (compressed) {
			var compressBuffer = SafeEncode.buffer(compressed);
			JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
				var decryptedData = res;
				try {
					if (decryptedData) {
						decryptedData = JSON.parse(decryptedData);
						self.decryptedData = decryptedData;
						cb(null, decryptedData);
					} else {
						cb('Not found');
					}
				} catch (e) {
					cb(e);
				}
			});
		} else {
			return cb('Empty');
		}
	}
	redirectUrl(method) {
		return new Promise((resolve, reject) => {
			switch(method) {
				case 'dejavu':
					resolve(this.dejavuLink());
				break;
				case 'mirage':
					this.mirageLink().then((url) => {
						resolve(url);
					}).catch((error) => {
						reject(error)
					});
				break;
				case 'gem':
					resolve(this.convertToUrl());
				break;
			}
		});
	}
}
export const urlShare = new UrlShare();
