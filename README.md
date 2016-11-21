# GEM 

### GUI for Elasticsearch Mappings

![GEM banner image](http://i.imgur.com/OjNdc5p.png)

A GUI for creating Elasticsearch data type mappings.

### Elasticsearch plugin - Installation

``bin/plugin install appbaseio/gem``

``Note``: To make sure you enable CORS settings for your ElasticSearch instance, add the following lines in the ES configuration file.

```sh
 http.port: 9200
 http.cors.allow-origin: "http://127.0.0.1:9200"
 http.cors.enabled: true
 http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
 http.cors.allow-credentials: true
```

After installing the plugin, 
start elasticsearch service 
```sh
elasticsearch
```
and visit the following URL to access it.

```sh 
http://127.0.0.1:9200/_plugin/gem 
```

``Note:`` If you use Elasticsearch from a different port, the URL to access and the `http.cors.allow-origin` value in the configuration file would change accordingly.

### Developing

``dev`` branch is the bleeding edge version of gem, all new changes go here.

``master`` branch is more suitable for installing gem locally. The Elasticsearch site plugin for gem uses ``master`` branch.

``chrome-extension`` branch is where we make chrome extension related changes.

#### Local Installation

1. git clone https://github.com/appbaseio/gem
2. git checkout master
3. npm install
4. bower install
5. npm start (runs gem on http://localhost:8000)

#### Local Build

#### `dev` branch: Elasticsearch Plugin

```sh
$ npm run build
```

#### `master` branch: Elasticsearch Plugin

```sh
$ npm run build_es_plugin
```

#### `chrome-extension` branch: Chrome extension

```sh
$ npm run build_chrome_extension
```

#### `gh-pages` branch: Github hosted pages

```sh
$ npm run build
```

#### Contributing

The source code is under the ``_site/app`` directory.
You can make pull requests against the ``dev`` branch.

---


### Import data sample
```json
{
  "name": "Foo",
  "id": 1234,
  "flag": true,
  "location": {
    "lat": 1234,
    "lon": 1234
  },
  "place": {
    "country": "india",
    "city": "ahmedabad",
    "pincode": 380055
  }
}
```

### Import mapping sample
```json
{
	"properties": {
		"age": {
			"type": "long"
		},
		"flag": {
			"type": "boolean"
		},
		"id": {
			"type": "integer"
		},
		"location": {
			"type": "geo_point"
		},
		"location1": {
			"type": "geo_point",
			"fields": {
				"sample": {
					"type": "integer"
				},
				"sample2": {
					"type": "string",
					"index": "not_analyzed"
				}
			},
			"geohash": true,
			"geohash_prefix": true,
			"geohash_precision": 10
		},
		"name": {
			"type": "string"
		},
		"place": {
			"properties": {
				"city": {
					"type": "string"
				},
				"country": {
					"type": "string"
				},
				"pincode": {
					"type": "integer"
				}
			}
		}
	}
}
```

### Import Settings sample
```json
{
	"filter": {
	  "nGram_filter": {
	    "type": "edge_ngram",
	    "min_gram": 1,
	    "max_gram": 20,
	    "token_chars": [
	      "letter",
	      "digit",
	      "punctuation",
	      "symbol"
	    ]
	  }
	},
	"analyzer": {
	  "nGram_analyzer": {
	    "type": "custom",
	    "tokenizer": "whitespace",
	    "filter": [
	      "lowercase",
	      "asciifolding",
	      "nGram_filter"
	    ]
	  },
	  "body_analyzer": {
	    "type": "custom",
	    "tokenizer": "standard",
	    "filter": [
	      "lowercase",
	      "asciifolding",
	      "stop",
	      "snowball",
	      "word_delimiter"
	    ]
	  },
	  "standard_analyzer": {
	    "type": "custom",
	    "tokenizer": "standard",
	    "filter": [
	      "lowercase",
	      "asciifolding"
	    ]
	  },
	  "whitespace_analyzer": {
	    "type": "whitespace",
	    "tokenizer": "whitespace",
	    "filter": [
	      "lowercase",
	      "asciifolding"
	    ]
	  }
	}
}
```
