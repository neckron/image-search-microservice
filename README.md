
# image-search-microservice

 * **User Story:**  I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
 * **User Story:** I can paginate through the responses by adding a ?offset=2 parameter to the URL.
 * **User Story:** I can get a list of the most recently submitted search strings.

## Example creation usage:

```
* https://host:port/create/www.google.com
* https://host:port/create/http://foo.com:80
```

## Example creation output:

```
* {"original_url" : "www.google.com", "short_url" : "https://hots:port/AxJi12"}
```

#Usage:

```
*  https://hots:port/AxJi12 will redirecto to : www.google.com
```


### Installing and Running

To installing it on local dev env:

```
* install npm install
* run node server.js
```
## Built With

* [Node.js](https://nodejs.org/) - Execution environment
* [Express.js](http://expressjs.com/) - Web framework for Node.js programs
* [ejs](http://www.embeddedjs.com/) - Templating engine
* [randomstring]

## Authors

* **Neckron**
