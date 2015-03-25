<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
  </head>
  <!-- jQuery 2.1.1 -->
  <script src="/bower-packages/jquery/dist/jquery.min.js"></script>
  <!-- Google Maps Api v3 *Uses API Key for user hprcc.awdn -->
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDaTF4n7VBiDolGAohiMS4EhPXeJHITEh4&sensor=false"></script>
  <!-- ACIS Javascript -->
  <script src="jsACIS.js"></script>

  <script>
		var postSuccess = function(data) {
			//This will store the html string that will be inserted into 
		  //the table id JSONACIS
		  var tableString = '<tr><th>Name</th><th>Station Start</th><th>Station End</th></tr>';

		  //Loop through the results and for each station
		  for (var key in this.data.meta) {
		  	//add a new row.
		    tableString = tableString + '<tr><td>' + this.data.meta[key].name + '</td><td>' + this.data.meta[key].valid_daterange[0][0] + '</td><td>' + this.data.meta[key].valid_daterange[0][1] + '</td></tr>';
		  }

		  //This call will inject the html string back into the page 
		  //so that it can be seen.
		  $('#jsresult').html(tableString);
		}

		//web services failure callback
		var postError = function(textStatus, errorThrown) {
    	$("#jsresult").empty().html("<p>Web services call failed: " + this.errorThrown + "</p>");
		}
		
  	var list = {
  		  	successFunction: postSuccess,
  		  	errorFunction: postError,
  		  	query: {
  	  		  	bbox: "-108,42.5,-110,44",
  	  		  	meta: "name,sids,ll,valid_daterange",
  	  		  	elems: "pcpn"
  	  	  }
		}

		jsACIS.metaRequest(list);
  </script>
  <body>
    <div id="jsresult">
      <p>Results will appear here</p>
    </div>
  </body>  
</html>
