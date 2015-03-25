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
  	var list = {
		    query: {
		    	sid: "304174",
		      sdate: "2009-01-01",
		      edate: "2009-01-10",
		      elems: "1,2,4,10,11",
		      output: "csv"
		    }
		}

		jsACIS.dataRequest(list);
  </script>
  <body>
    <div id="jsresult">
      <p>Results will appear here</p>
    </div>
  </body>  
</html>
