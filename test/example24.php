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
		    	sid: "302627",
		      sdate: "1999-6",
		      edate: "2000-12",
		      elems: [{
		          name: "pcpn",
		          interval: "mly",
		          duration: "mly",
		          reduce: {
		              reduce: "sum",
		              add: "mcnt"
		          }
		      }, {
		          name: "pcpn",
		          interval: "mly",
		          duration: "mly",
		          reduce: {
		              reduce: "sum",
		              add: "mcnt"
		          },
		          maxmissing: 0
		      }]
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
