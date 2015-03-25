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
    	  bbox: "-102,48,-98,50",
        sdate: "2008-01",
        edate: "2010-12",
        elems: [{
            name: "pcpn",
            interval: "yly",
            duration: "yly",
            reduce: {
                reduce: "sum",
                add: "mcnt"
            },
            maxmissing: 7,
            smry: ["max", "min", "mean"]
        }],
        meta: "name,state,ll"
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
