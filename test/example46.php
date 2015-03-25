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
  </script>
  <body>
    <div id="jsresult">
      <p>Results will appear here</p>
    </div>
  </body>  
</html>
