/**
 * 
 */
var jsACIS = (function() {
	/**
	 * Storage of the ACIS_WS urls
	 * 
	 * @attribute urls
	 */
	var urls = {
			meta: 'http://data.rcc-acis.org/StnMeta',
			data: 'http://data.rcc-acis.org/StnData'
	}
	
	/**
	 * Minimum Distance of the Bounding Box search
	 * 
	 * @attribute mind
	 */
	var mind = 5;
	
	/**
	 * Setup Object
	 * 
	 * This method sets up the passed object with the 
	 * minimum required elements. The defaults are secondary
	 * and will be replaced via extend if the user sets their own.
	 * Default elements includes:
	 * alert set to false
	 * an empty query object
	 * false geocode returning
	 * when a successFunction is passed add the data element to successParams
	 * when a errorFunction is passed add the textStatus and errorThrown 
	 * 	elements to errorParams
	 * 
	 * @method setup
	 * @requires jQuery
	 * @return {Object} An object containing the call specifications
	 * @param {Object} object Raw object passed from user
	 */
	var setup = function(object) {
		//default objects
		var defaultObject = {
				alert: false,
				query: {},
				geocode: false
		}
		//extend the passed object with the defaults
		$.extend(defaultObject, object);
		//successFunction successParams defaults
		if (typeof object.successFunction !== 'undefined') {
			var paramsObject = {
					data: ''
			}
			//successParams must exist
			if (typeof object.successParams === 'undefined')
				$.extend(defaultObject, {successParams: {}});
			//extend the passed object with the defaults
			$.extend(defaultObject.successParams, paramsObject);
			//check for geocode result request
			if (defaultObject.geocode)
				defaultObject.successParams.geocode = '';
			
		}
		//errorFunction errorParams defaults
		if (typeof object.errorFunction !== 'undefined') {
			var paramsObject = {
					textStatus: '', 
					errorThrown: ''
			}
			//errorParams must exist
			if (typeof object.errorParams === 'undefined')
				$.extend(defaultObject.errorParams, {errorParams: {}});
			//extend the passed object with the defaults
			$.extend(defaultObject.errorParams, paramsObject);
		}
		//return object
		return defaultObject;
	}
	/**
	 * aJax Call
	 * 
	 * Function to make the ajax call to the requested ACIS-WS process.
	 * After making the ajax call if the user has passed a function for either
	 * or both the success and/or failure of the ajax call, their functions are
	 * "injected" into the ajax results. The apply method from jQuery is 
	 * used to insert each element in the passed object into the parameters
	 * of the passed function regardless of the number. 
	 * 
	 * @method aJaxCall
	 * @param {Object} object Raw object passed from user
	 * @param {String} url This is the url for the ACIS call
	 * @requires jQuery
	 */
	var aJaxCall = function(object, url) {
		//make the ajax call
		jQuery.ajax({
			url: url,
			data: {params: JSON.stringify(object.query)},
			type: 'POST',
			crossDomain: true,
			success: function(data, status, XHR) {
				console.log(data);
				//deviate from the default functions
				if (typeof object.successFunction !== 'undefined') {
					//set the data variable so that functions have something to work with
					object.successParams.data = data;
					//Using apply to pass func_object as 'this' to the successFunction
					object.successFunction.apply(object.successParams);
				}
				else {
					//default to print returned contents to the html div
					$('#jsresult').html(data);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//deviate from the default functions
				if (typeof object.errorFunction !== 'undefined') {
					//set the error variables
					object.errorParams.textStatus = textStatus;
					object.errorParams.textStatus = errorThrown;
					//Using apply to pass func_object as 'this' to the errorFunction
					object.errorFunction.apply(object.errorParams);
				}
				else {
					console.log('Error: ' + textStatus + ' ' + errorThrown);
				}
			}
		});
	}
	
	/**
	 * Search
	 * 
	 * This method requires the use of Google Maps v3 API to use the Geocoder call. This 
	 * implements the searching used in Google Maps for the State, county and bounding box 
	 * methods used in ACIS-WS meta functions. The first type returned by this call 
	 * (referenced https://developers.google.com/maps/documentation/geocoding/#Types) 
	 * governs the ACIS-WS type of search ie state, county, bbox. All other super types 
	 * are ignored for these calls. County searches require a FIPS code (six digits) which
	 * is not reported by the Goecoder method. In order to facilitate this a csv file is 
	 * used to search for and construct a FIPS code for the query. this file is handled
	 * using client side javascript and could cause a possible slow down in site loading.
	 * 
	 * 
	 * @method search
	 * @requires jQuery, Google Maps v3 API
	 * @param {Object} object Raw object passed from user
	 * @return {Object} An object containing the call specifications
	 */
	var search = function(object) {
		//create geocoder instance
		var geocoder = new google.maps.Geocoder();
		//request from geocoder API
		geocoder.geocode(
				{
					address: object.search
				},
				//Callback function for geocode
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
//						console.log(results);
						//checking the types variable result from geocoder
						//state-wide
						if (results[0].types[0] == 'administrative_area_level_1') {
							object.query.state = results[0].address_components[0].short_name;
							if (object.geocode)
								object.successParams.geocode = results[0];
							//ajax call
							aJaxCall(object, urls.meta);
						}	
						//county-wide
						else if (results[0].types[0] == 'administrative_area_level_2') {
							//set our searchable terms
							var stateFIPS = results[0].address_components[1].short_name;
							var countyFIPS = results[0].address_components[0].short_name.split(' ')[0];
							var fips = '';
							if (object.geocode)
								object.successParams.geocode = results[0];
							//acis-ws county queries require a FIPS number
							//Geocoder does not return that data so we have to look it up
							//from a csv file. luckily this file is not big but it could 
							//slow down initial loading of the website
							//source: http://opengeocode.org/download.php
							jQuery.ajax({
								url: 'datasets/statecounty.csv', 
								type: 'GET',
								dataType: 'text',
								success: function(data, status, XHR) {
									console.log(data);
									//create an array for each new line in the csv
									var csv = data.split(/\r\n|\n/);
									for (var a = 0; a < csv.length; a++) {
										var line = csv[a].split(',');
										//int must be a string
										if (line[0] == stateFIPS && line[2] == countyFIPS) {
											if (line[1] < 10)
												fips = "0"+line[1];
											else
												fips = line[1];
											if (line[3] < 10)
												fips += "0"+line[3];
											else if (line[3] < 100)
												fips += "00"+line[3];
											else
												fips += line[3];
											object.query.county = fips;
											//ajax call
											aJaxCall(object, urls.meta);
											break;
										}
									}
								},
								error: function(jqXHR, textStatus, errorThrown) {
									console.log('Error: ' + textStatus + ' ' + errorThrown);
								}
							});
						}
						//incorporated city or town
						else if (results[0].types[0] == 'locality') {
							if (object.geocode)
								object.successParams.geocode = results[0];
							//since this is not a general area such as the above
							//we need a search radius. This can be passed within 
							//the object but if its not a default of 5 miles is used.
							//do not that this is a radius of a circle that fits within
							//a bounding box.
							var center = results[0].geometry.location;
							//check for radius
							if (typeof object.radius !== 'undefined') {
								//get the bounding box North East corner
								var pointNE = destinationPoint({lat: center.lat()*(Math.PI/180), lng: center.lng()*(Math.PI/180)},object.radius*1.60934,(45)*(Math.PI/180));
								//get the bounding box South West corner
								var pointSW = destinationPoint({lat: center.lat()*(Math.PI/180), lng: center.lng()*(Math.PI/180)},object.radius*1.60934,(225)*(Math.PI/180));
							}
							else {
								//get the bounding box North East corner
								var pointNE = destinationPoint({lat: center.lat()*(Math.PI/180), lng: center.lng()*(Math.PI/180)},mind*1.60934,(45)*(Math.PI/180));
								//get the bounding box South West corner
								var pointSW = destinationPoint({lat: center.lat()*(Math.PI/180), lng: center.lng()*(Math.PI/180)},mind*1.60934,(225)*(Math.PI/180));
							}
							//set the variable
							object.query.bbox = pointSW.lng+','+pointSW.lat+','+pointNE.lng+','+pointNE.lat;
							//ajax call
							aJaxCall(object, urls.meta);
						}
					}
		});
		return object;
	}
	/**
	 * Destination Point
	 * 
	 * Calculation of a destination latitude and longitude given a bearing
	 * and the distance traveled. all angles need to be in radians prior to
	 * passing them to this function, they will not be converted within the function.
	 * 
	 * @method destinationPoint
	 * @return {Object} point Contains the latitude and longitude of the requested point (decimal degrees)
	 * All angles in radians
	 */
	var destinationPoint = function(startLL, distance, bearing) {
		//returnable object
		var point = {
				lat: '',
				lng: ''
		}
		//earth radius in km
		var earthRadius = 6371.01;
		//calculations
		point.lat = Math.asin(Math.sin(startLL.lat)*Math.cos(distance/earthRadius)+Math.cos(startLL.lat)*Math.sin(distance/earthRadius)*Math.cos(bearing));
		point.lng = startLL.lng + Math.atan2(Math.sin(bearing)*Math.sin(distance/earthRadius)*Math.cos(startLL.lat),Math.cos(distance/earthRadius)-Math.sin(startLL.lat)*Math.sin(point.lat));
		//convert to degrees
		point.lat = point.lat*(180/Math.PI);
		point.lng = point.lng*(180/Math.PI);	
		return point;
	}
	
	return {
		/**
		 * Data Request
		 * 
		 * Function to make an ACIS-WS StnData request. Several checks are made 
		 * on the object passed and whether the user request the alerts will be 
		 * expressed if encountered and in most if not all cases the function will 
		 * terminate. Checking to make sure the number of parameters the successFunction
		 * (or errorFunction) expects are the same is important so that whe the object
		 * is applied to the function everything fits.  
		 * 
		 * @method dataRequest
		 * @param {Object} object Raw object passed from user
		 * @requires jQuery
		 */
		dataRequest: function(object) {
			//see if jQuery is loaded
			if (window.jQuery) {
				//make sure an object has been passed
				if (typeof object !== 'undefined') {
					//extend object with default elements
					var query_object = setup(object);
					//are you passing a function...
					if (typeof query_object.successFunction !== 'undefined') {
						//check to make sure variables passed into the function 
						//have the same number as those expected
						if (object.successFunction.length != Object.keys(query_object.successParams).length) {
							if (alert)
								alert("Parameters between SuccessFunction and successParams do not match.");
							else
								console.log("Parameters between SuccessFunction and successParams do not match.");
							return -1;
						}
					}
					if (typeof query_object.errorFunction !== 'undefined') {
						if (object.errorFunction.length != Object.keys(query_object.errorParams).length) {
							if (alert)
								alert("Parameters between errorFunction and errorParams do not match.");
							else
								console.log("Parameters between errorFunction and errorParams do not match.");
							return -1;
						}
					}			
					//query will be stringified
					//make the call to ACIS WS
					aJaxCall(query_object, urls.data);
				}
				else {
					if (alert)
						alert("You must pass an object containing request queries. Please see documentation for details.");
					else
						console.log("You must pass an object containing request queries. Please see documentation for details.");
					return -1;
				}
			}
		},
		/**
		 * Meta Request
		 * 
		 * Function to make an ACIS-WS StnMeta request. Several checks are made 
		 * on the object passed and whether the user request the alerts will be 
		 * expressed if encountered and in most if not all cases the function will 
		 * terminate. Checking to make sure the number of parameters the successFunction
		 * (or errorFunction) expects are the same is important so that whe the object
		 * is applied to the function everything fits. Google Maps needs to be loaded 
		 * if the user wants to search for a location. 
		 * 
		 * @method metaRequest
		 * @param {Object} object Raw object passed from user
		 * @requires jQuery
		 */
		metaRequest: function(object) {
			//see if jQuery is loaded
			if (window.jQuery) {
				//make sure an object has been passed
				if (typeof object !== 'undefined') {
					//extend object with default elements
					var query_object = setup(object);
					//are you passing a function...
					if (typeof query_object.successFunction !== 'undefined') {
						//check to make sure variables passed into the function 
						//have the same number as those expected
						if (object.successFunction.length != Object.keys(query_object.successParams).length) {
							if (alert)
								alert("Parameters between SuccessFunction and successParams do not match.");
							else
								console.log("Parameters between SuccessFunction and successParams do not match.");
							return -1;
						}
					}
					if (typeof query_object.errorFunction !== 'undefined') {
						if (object.errorFunction.length != Object.keys(query_object.errorParams).length) {
							if (alert)
								alert("Parameters between errorFunction and errorParams do not match.");
							else
								console.log("Parameters between errorFunction and errorParams do not match.");
							return -1;
						}
					}
					//using geocoder to search for a location
					if (typeof query_object.search !== 'undefined' && typeof google.maps !== 'undefined'){
						search(query_object);
					}
					else {
						//query will be stringified
						//make the call to ACIS WS
						aJaxCall(object, urls.meta);
					}
				}
				else {
					if (alert)
						alert("You must pass an object containing request queries. Please see documentation for details.");
					else
						console.log("You must pass an object containing request queries. Please see documentation for details.");
					return -1;
				}
			}
		}
	}
})();