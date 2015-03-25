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

