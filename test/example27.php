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
		    	sid: "kfar",
		      sdate: "1945-6-30",
		      edate: "1950-6-30",
		      meta: "name",
		      elems: [{
		          name: "mint",
		          interval: [1, 0, 0],
		          duration: "std",
		          season_start: "7-1",
		          reduce: {
		              reduce: "run_le_32",
		              add: "date,mcnt,rmcnt",
		              n: 1
		          }
		      }, {
		          name: "mint",
		          interval: [1, 0, 0],
		          duration: "std",
		          season_start: "7-1",
		          reduce: {
		              reduce: "run_le_32",
		              add: "date,mcnt,rmcnt",
		              n: 1,
		              run_maxmissing: 2
		          }
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
