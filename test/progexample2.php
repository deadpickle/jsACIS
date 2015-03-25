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
  <!-- Highcharts -->
  <script src="http://code.highcharts.com/highcharts.js"></script>

  <script>
		var postSuccess = function(data) {
			if (typeof this.data.data == 'undefined') { 
		  	alert('Station is invalid or has no data.  Try another station (eg. HOU).');
		  }
		  else {
			  var sum = new Array();
		  	var titleName = "Growing Degree Days (Base 50\u00B0F)";
		  	var gdd = new Array();
		  	for(var i=0;i<this.data.data.length;i++){
			  	if(this.data.data[i][1] === "M"){gdd[i] = null;} //if the data is missing it will not show the data value.  
		  		else{gdd[i] = parseInt(this.data.data[i][1],10);}
		  		if(i==0){sum[i] = gdd[i];}
		  		else{sum[i] = sum[i-1] + gdd[i];}
		  	}
		  	
		  	$('#output').highcharts({
			  	chart:{
				  	zoomType: 'x'
					},
					title:{
		  	    text: titleName
		  	  },
		  	  subtitle:{
		  	    text: this.data.meta.name + " (" + this.data.meta.state + ")",
		  	    style: {
		  	      fontSize: '14px'
		  	    }
		  	  },
		  	  xAxis:{
		  	   	type: 'datetime',
		  	    maxZoom: 3 * 24 * 3600000,
		  	    labels: {
		  	      style: {
		  	        color: '#000000',
		  	        fontSize: '14px'
		  	      }
		  	    }
		  	  },
		  	  yAxis:[{
		  	   	title:{
		  	     	text: 'Growing Degree Days',
		  	      style: {
		  	        fontSize: '14px'
		  	      },
		  	    },
		  	    labels: {
		  	   	  style: {
		  	     	  color: '#000000'
		  	      }
		  	    }
		  	  },{
		  	    title:{
		  	     	text: 'Accumulated Growing Degree Days',
		  	      style: {
		  	       	color: '#F00000',
		  	       	fontSize: '14px'
		  	      },
		  	    },
		  	    labels: {
		  				style: {
		  	        color: '#000000'
		  	      }
		  	    },
		  	    min: 0,
		  	    opposite: true
		  	  }],
		  	  tooltip:{
		  	    shared: true,
		  	    crosshairs: true
		  	  },
		  	  credits:{
		  	    text: 'Click and drag to zoom',
		  	    href: 'http://www.rcc-acis.org/'
		  	  },
		  	  plotOptions: {
		  	    series: {
		  	      marker: {
		  	        enabled: false
		  	      }
		  	    }
		  	  },
		  	  series:[{
		  	    name: 'Growing Degree Days',
		  	    color: '#0404B4',
		  	    type: 'column',
		  	    data: gdd,
		  	    pointStart: Date.UTC(yyyy,00,01),
		  	    pointInterval: 24 * 3600 * 1000
		  	  },{
		  	    name: 'Accumulated Growing Degree Days',
		  	    color: '#F00000',
		  	    yAxis: 1,
		  	    type: 'line',
		  	    data: sum,
		  	    pointStart: Date.UTC(yyyy,00,01),
		  	    pointInterval: 24 * 3600 * 1000
		  	  }]
	  		});
		 	}
		}
		
		var stnId = "HOU";
	 	var today = new Date();
	  var dd = today.getDate();
	  var mm = today.getMonth()+1; //January is 0!
	  var yyyy = today.getFullYear();
  	var firstDate = new Date(yyyy,00,01);
  	var lastDate = new Date(yyyy,today.getMonth(),dd);
  	var oneDay = 24*60*60*1000;
  	var edate = yyyy+'-'+mm+'-'+dd;
  	var sdate = yyyy+'-1-1';;

  	var list = {
  		  	alert: true,
  		  	successFunction: postSuccess,
  		  	query: {
  	  		  	sid: stnId,
  	  		  	sdate: sdate,
  	  		  	edate: edate,
  	  		  	elems: 'gdd'
  	  	  }
		}

		jsACIS.dataRequest(list);
  </script>
  <body>
    <div id="output" style="width:800px;height:500px"></div>
  </body>  
</html>
