# GEM 💎

### GUI for Elasticsearch Mappings

![GEM banner image](http://i.imgur.com/OjNdc5p.png)


1. **[GEM: Intro](#gem-intro)**   
2. **[Features](#features)**  
3. **[Mapping and GEM FAQs](#mapping-and-gem-faqs)**  
   1. [What is a Mapping?](#what-is-a-mapping)  
   1. [How to create a new mapping?](#how-to-create-a-new-mapping)  
   1. [What are the available mapping types?](#what-are-the-available-mapping-types)
   1. [Can a mapping be modified once it is applied?](#can-a-mapping-be-modified-once-it-is-applied)
   1. [How to map a sub field?](#how-to-map-a-sub-field)
   1. [What is an analyzer?](#what-is-an-analyzer)
   1. [How to create a custom analyzer?](#how-to-create-a-custom-analyzer)
   1. [How to share a GEM view?](#how-to-share-a-gem-view-externally)
4. **[Build Locally](#build-locally)**   
5. **[Get GEM](#get-gem)**  
  a. [Hosted](#use-hosted-app)  
  b. [Chrome Extension](#get-the-chrome-extension)  
  c. [Elasticsearch Plugin](#install-as-elasticsearch-plugin)


### GEM: Intro

GEM is a GUI for creating and managing an Elasticsearch index's datastrcuture mappings. ES Mappings provide an immutable interface to control how data is stored internally within Elasticsearch and how queries can be applied to it.  

Mappings allow deciding things like:

* Should a field with value '2016-12-01' be treated as a `date` or as a `text` field?  
* Should 'San Francisco' be stored as an **analyzed** text field to then run full-text search queries against it, or should it be kept non-analyzed for an aggregations use-case?  
* Should 'loc': ['40.73', '-73.9'] be stored as `Object` or should it have a `geopoint` datatype.  

**GEM** takes this a step further by providing an on-the-fly mapping inference based on user provided input data.

![GEM Create Mappings](http://i.imgur.com/Q6fEKUi.gif)  


### Features

GEM supports three key mapping related options today:  

1. **Create data mappings** with an on-the-fly auto inferencing capability.  
2. **Managing all the current data mappings** with an option to see the raw JSON data.  
![GEM View Mappings](https://i.imgur.com/GdrCWvq.png)

3. **Importing new data analyzers** to be later associated with field mappings.  
![GEM Analyzer View](https://i.imgur.com/QtCMxXE.png)

GEM keeps the entire app state in the URL which makes for easy sharing of views.   And most importantly, GEM is entirely built on the client side and is available as a github hosted app.

### Mapping and GEM FAQs

#### What is a mapping?

#### How to create a new mapping?

#### What are the available mapping types?

#### Can a mapping be modified once it is applied?

#### How to map a sub field?

#### What is an analyzer?

#### How to create a custom analyzer?

#### How to share a GEM view externally?


### Build Locally

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

### Get GEM

GEM is available as a hosted app and as a chrome extension.

#### [Use hosted app](http://appbaseio.github.io/gem)  

or  

#### [Get the Chrome extension](https://chrome.google.com/webstore/detail/gem/enmjddbghmojhlldblbblolfljndkkjn)

or

#### Install As Elasticsearch Plugin

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
