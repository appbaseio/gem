# GEM 

### GUI for Elasticsearch Mappings

![GEM banner image](http://i.imgur.com/OjNdc5p.png)

A GUI for creating Elasticsearch data type mappings.

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