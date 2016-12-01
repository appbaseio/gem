# [GEM](https://opensource.appbase.io/gem) 💎

### GUI for Elasticsearch Mappings

![GEM banner image](http://i.imgur.com/OjNdc5p.png)


1. **[GEM: Intro](#gem-intro)**   
2. **[Features](#features)**  
3. **[Mapping and GEM FAQs](#mapping-and-gem-faqs)**  
   1. [What is a mapping?](#what-is-a-mapping)  
   1. [How to create a new mapping?](#how-to-create-a-new-mapping)  
   1. [What are the available mapping types?](#what-are-the-available-mapping-types)  
   1. [What other mapping parameters are available?](#what-other-mapping-parameters-are-available)  
   1. [Can a mapping be modified once it is applied?](#can-a-mapping-be-modified-once-it-is-applied)
   1. [How to map a sub field?](#how-to-map-a-sub-field)
   1. [What is an analyzer?](#what-is-an-analyzer)
   1. [How to create a custom analyzer?](#how-to-create-a-custom-analyzer)
   1. [How to share a GEM view?](#how-to-share-a-gem-view-externally)
4. **[GEM Usage Examples](#gem-usage-examples)**  
5. **[Build Locally](#build-locally)**   
6. **[Get GEM](#get-gem)**  
  a. [Hosted](#use-hosted-app)  
  b. [Chrome Extension](#get-the-chrome-extension)  
  c. [Elasticsearch Plugin](#install-as-elasticsearch-plugin)  
7. **[Other Apps](#other-apps)**


### GEM: Intro

GEM is a GUI for creating and managing an Elasticsearch index's datastructure mappings. ES Mappings provide an immutable interface to control how data is stored internally within Elasticsearch and how queries can be applied to it.  

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

A mapping in Elasticsearch is like a schema in SQL. It's an API for defining how data should be internally stored within Elasticsearch indexes.

#### How to create a new mapping?

A mapping can be created at the time of an Elasticsearch index creation or afterwards in an explicit definition. If no mapping is specified, it is dynamically created when data is inserted into the index.

#### What are the available mapping types?

`string` (starting v5.0 is called `text`), `date`, `long`, `integer`, `short`, `byte`, `double`, `float`, `boolean` are the common data types. `nested`, `object`, `binary`, `geo_point`, `geo_shape`, `ip`, `completion` are some of the specialized data types. You can read more about the available types on [Elasticsearch docs here](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html).

#### What other mapping parameters are available?

While mapping's main role is in defining data structures, it also allows defining certain indexing and querying related parameters that are commonly used. For example, `analyzer` allows defining which analyzer to use for indexing the text data. `doc_values` parameter makes indexing data available for aggregations functionality by storing it in a column-oriented fashion. Another one, `null_value` parameter allows replacing a `null` value field to be replaced with a specified value. You can read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/5.0/mapping-params.html).

#### Can a mapping be modified once it is applied?

Starting v2.0, mappings are immutable. Once applied, they cannot be modified. In the event a mapping needs modification, the suggested alternative is to reindex data in a new index.

#### How to map a sub field?

Sub fields allow indexing the same field in two different ways, the idea is slightly counter intuitive if you come from a structured database background. Since Elasticsearch is a search engine primarily, data is indexed primarily in a search oriented data structure. However, it's necessary to index it in an exact format for exact search queries and aggregations. Not surprisingly, sub fields only apply to a `string` field.

#### What is an analyzer?

An analyzer is a pre-processor that is applied to data before indexing it. It does three things:  
1. Sanitizing the string input,  
2. Tokenizing the input into words,  
3. and Filtering the tokens.

Because of the focus on searching, Elasticsearch comes with a good number of standard analyzers that can be applied at mapping time to a data field. However, since there is so much room for customization, it supports an interface to add custom analyzers.

GEM also provides a GUI interface to import a user defined analyzer and lists available analyzers to pick from at mapping time.

#### How to create a custom analyzer?

The specs for creating a custom analyzer can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html). 

#### How to share a GEM view externally?

A GEM view can be shared externally (both embeddable and as a hyperlink) via the share icon at the top left screen ![](https://i.imgur.com/Qgum6wv.png).

---

### GEM Usage Examples

#### Creating a Mapping from Data

Let's say your JSON data looks like this: 

```json
{
  "name": "geolocation data",
  "place": {
    "city": "New York",
    "country": "United States"
  },
  "location": [40.3,-74]
}
```

Use [this magic link](https://opensource.appbase.io/gem/#?input_state=XQAAAAKrAAAAAAAAAAA9iImmVFabo7XsB6A419CICVNEnslh5QMbF3MIxKBLbnZNCf8XVBQ_fk66Q5WeoQou8VkZNq5ye8BQl694_faoiqtLVcAPLosQf7njKrKrBTA0gEWaUB5MzP3HMsZ64wmtVjou6Ik43s7r1xwdvmdq1Wpgh23ow2w9OTOfjDJmdtiSQlpTjHyDz21n_wKMAAA) to view this data directly in GEM. You will need to set the `app name` and `cluster URL` fields before being able to apply these.  

Alternatively, you can write the exact mapping object in GEM's editor view to use the Elasticsearch APIs.

#### Import Analyzer Settings

For importing analyzer settings, select the Import Analyzer button from the button group in the bottom left screen.

![](https://i.imgur.com/721NHwW.png)

You can now add one ore more analyzers in the editor view to make them available at mapping creation time. The following JSON can be used for some good defaults.

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


### Build Locally

``dev`` branch is the bleeding edge version of gem, all new changes go here.

``gh-pages`` branch is for the Github Pages hosted version of the app, it is just the stable version of the `dev` branch.

``master`` branch is more suitable for installing gem locally. The Elasticsearch site plugin for gem uses ``master`` branch.

``chrome-extension`` branch is for publishing the chrome extension.  

#### Local Installation

1. git clone https://github.com/appbaseio/gem
2. git checkout master
3. npm install
4. bower install
5. npm start (runs gem on http://localhost:8000)

And build with  

```sh
$ npm run build
```

#### Contributing

The source code is in the `app` directory. Pull requests should be created against the ``dev`` branch.


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

---

### Other Apps

GEM is purpose built for the mapping needs of an Elasticsearch index.    
**[dejavu](http://opensource.appbase.io/dejavu/)** is similarly purpose built for viewing your Elasticsearch index's data and perform CRUD operations, and  
**[mirage](http://opensource.appbase.io/mirage/)** is a GUI for composing Elasticsearch queries.

![](https://i.imgur.com/Wxh8ceG.png)  

Together, these three apps form the building blocks for powering a great search experience.
