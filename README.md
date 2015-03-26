# Javascript ACIS Web Service Library

The goal of this library is to allow users of ACIS to make web service calls and easily handle the data returned in any way they want without having to copy and paste parts of aciswsdoc.js. Making calls to the Web Services is the same but the user can inject their own functions to handle successful calls any way they like. They can also handle error calls with a function of their choosing.

## implementing

To include this library in your website simply download the package and add `<script src="/js/jsACIS.js"></script>` to your html file (or php file). jsACIs requires jQuery to work so include the prior after you include jQuery.

## Usage

The jsACIS library uses an AMD module format in its design. This allows users to call exposed functions using the jsACIS object.

### Passed Object

The `passedobject` is the structure that is passed to the jsACIS object and contains the user defined data. This variable is a traditional javascipt object with key/value pairs. Acceptable keys are as such:

Name|Description
----|-----------
query|Element that contains the ACIS-WS JSON object
successFunction|Contains the function to run when ajax is successful
errorFunction|Contains the function to run when ajax encounters an error
successParams|Variable to pass to the successFunction
errorParams|Variable to pass to the errorFunction
alert|Set to `true` if you want default output to pop up an alert window instead of printing to an `<div id='jsresult'></div>` element
geocode|Uses Google Geocoder to search for passed string
radius|Used in geocode as a radius for a bounding box

### Custom Success Function

Users can pass a custom function that will be ran when the Web Service call is successful. A successFunction is declared by:

```
var success = function(data) {
  console.log(this.data);
}

var passedobject = {
    successFunction: success,
	  query: {
	    sid: sid,
	    sdate: sdate,
	    edate: edate,
		  elems: [{
		    name: "pcpn"
	  	}]
	  }
	}
jsACIS.dataRequest(passedobject);
```

A few notes on this declaration. 
* `var success` this declares a javascript variable named success
* `function(data)` the above variable contains a function that is expecting a single passed variable named data. When you write your own function you must, at a minimum, include the data variable. This variable will contain the data returned from the ACIS-WS call.
* `console.log(this.data)` within the curl brackets is where you write what you want to do with the data. In this example the user wants to print the returned data to the console. Notice the `this` object that our passed `data` variable is attached to. What it does is tells our function that `this.data` is the variable passed to the function and not some global variable with the same name. In order to interact with the data passed you must attach the `this` object.
* In the `passedobject` we add the element `successFunction` to let jsACIS know that we are passing our own custom function that will run when the ajax call succeeds. 

If a user wants to pass other variables to their function they can do so easily. We have to include the `successParams` element to our passed object so that jsACIS can manage the parameters your function is expecting. Here is another example of this usage:

```
var success = function(data, foo) {
  console.log(this.foo, this.data);
}

var passedobject = {
    successFunction: success,
    successParams: {
      foo: 'bar'
    },
	  query: {
	    sid: sid,
	    sdate: sdate,
	    edate: edate,
		  elems: [{
		    name: "pcpn"
	  	}]
	  }
	}
jsACIS.dataRequest(passedobject);
```
Lets look at this code line-by-line:
* The `success` function is the same as the above example but we have another parameter, `foo`
* `passedobject` is also similar to the above example but when we are passing other variables other than `data` we have to include the `successParams` element. The `successParams` is an object that conatains key/value pairs of the data you will pass to your function. Notice that you do not have to include the `data` variable to this object, that element is automatically added, and expected. 

### Custom Error Function

Using your own custom error functions is very similar to how a custom success function is impemented. Here is an example:
```
var error = function(textStatus, errorThrown) {
  $("#jsresult").empty().html("<p>Web services call failed: " + this.errorThrown + "</p>");
}

var passedobject = {
  errorFunction: error,
  query: {
    bbox: "-108,42.5,-110,44",
  	meta: "name,sids,ll,valid_daterange",
  	elems: "pcpn"
  }
}

jsACIS.metaRequest(passedobject);
```
* A custom error function requires two passed variables: `textStatus` and `errorThrown`.
* In the `passedobject` we add the element `errorFunction` to let jsACIS know that we are passing our own custom function that will run when an error is returned by the ajax call. 

Just as the Custom Success Function can pass other variables so can the custom error function. The difference between these is that the `passedobject` includes the `errorParams` element.

### Default Actions

When a user does not provide a successFunction or an errorFunction jsACIS handles the returned call in a default manner. On a successful call the output data is inserted into the `<div id='jsresult'></div>` element. If the user is expecting an image instead of a string being inserted into `<div id='jsresult'></div>`, an `img` tag will be embedded. 

On an error from ajax the output will be inserted into `<div id='jsresult'></div>` unless the user adds the `alert: true` element to the passed object. When this happens instead of being inserted into `<div id='jsresult'></div>` a browser alert window is fired.

### Available Functions

#### metaRequest

The `jsACIS.metaRequest(passedobject)` function is used to call MetaData. 

#### dataRequest

Requests for station data are made using `jsACIS.dataRequest(passerobject)`. This function makes calls the the ACIS-WS StnData, MultiStnData, and GridData. If a user specifies `grid` with the `output: 'image'` element then they are expecting an image to be returned. jsACIS will post this image to `<div id='jsresult'></div>` the same as any other default output. If a User wants to place this is a specific element they can pass a custom success function to do so:
```
var picture = function(data) {
  $('#picture').html('<img src="' + this.data.data + '" />');
}

var list = {
  query: {
    state: "ne,ok",
    grid: "1",
    output: "image",
    date: "2012-6",
    elems: [{
      name: "maxt",
      interval: "mly",
      duration: "mly",
      reduce: "max"
    }],
    image: {
      proj: "lcc",
      overlays: ["county:1:gray","state:2:purple"],
      interp: "cspline",
      width: 350,
      levels: [90,95,100,105,110]
    }
  }
}

jsACIS.dataRequest(list);
```

###Geocoder

When you set the `geocode` key in the `passedobject` and give it a value, jsACIS uses Google Geocoder to find that location and sets the proper ACIS-WS `query` element, based on what if returned. This requires the user to include the Google Maps API v3 javascript library to their website. Please use your own API key as provided by [Google](https://developers.google.com/maps/signup).

When using the geocode element of jsACIS, Geocoder will return three types: administrative_area_level_1, administrative_area_level_2, and locality. The geocode element will only handle the last result, that being the most exact to the users search string (ex. entering "NE" will return administrative_area_level_1, were as "lincoln" will likely return a locality). The first, administrative_area_level_1, are states and the returned result will be set to the ACIS-WS `state` element in the `query` string. 

Counties are administrative_area_level_2 and ACIS-WS requires a 6 digit FIPS number. Geocoder does not return this number natively but using the csv file in the included datasets will locate the correct FIPS id and set the `county` element in the `query` string. 

The smallest area is a locality which are cities and towns. Since localities are not directly enterable into ACIS-WS, jsACIS will calculate a bounding box with the locality in the center. A user can pass the disance to each of the corners of this box by passing the `radius` element with a value set in miles (the default if not passed is 5 miles).
