function parseAxisData(d,keysNum, keysStr, keysMeta) {
  return _.map(d, function(d) { //return a list after performing function for each data in d
    var o = {};
    _.each(keysNum, function(k) { // for each column which is a number
        o[k] = parseFloat(d[k]);
    })
    _.each(keysStr, function(k) { // for each column that is a string
        o[k] = d[k];
    });
    _.each(keysMeta, function(k) { // for each column that is a string
        o[k] = d[k];
    });

    return o;
  });
}

function createGroups(d,groupName) {
  return new Set(_.map(d, function(d) {return d[groupName]}));  
}

function getBounds(d, paddingFactor) {
  // Find min and maxes (for the scales)
  paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1; //!== not equal value or type to string 'undefined'

  var keys = _.keys(d[0]), b = {};
  //only num value keys
  //var keys = keysNum, b = {};
  _.each(keys, function(k) { //for each column
    b[k] = {};
    _.each(d, function(d) { //for each row
      if(isNaN(d[k]))
        return;
      if(b[k].min === undefined || d[k] < b[k].min) //look through rows, set bound for [key for that column]
        b[k].min = d[k];
      
      if(b[k].max === undefined || d[k] > b[k].max)
        b[k].max = d[k];
    });

    b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor; //add a little padding
    b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
  });
  return b;
}

function getCorrelation(xArray, yArray) {
  function sum(m, v) {return m + v;}
  function sumSquares(m, v) {return m + v * v;}
  function filterNaN(m, v, i) {isNaN(v) ? null : m.push(i); return m;}

  // clean the data (because we know that some values are missing)
  var xNaN = _.reduce(xArray, filterNaN , []);
  var yNaN = _.reduce(yArray, filterNaN , []);
  var include = _.intersection(xNaN, yNaN);
  var fX = _.map(include, function(d) {return xArray[d];});
  var fY = _.map(include, function(d) {return yArray[d];});

  var sumX = _.reduce(fX, sum, 0);
  var sumY = _.reduce(fY, sum, 0);
  var sumX2 = _.reduce(fX, sumSquares, 0);
  var sumY2 = _.reduce(fY, sumSquares, 0);
  var sumXY = _.reduce(fX, function(m, v, i) {return m + v * fY[i];}, 0);

  var n = fX.length;
  var ntor = ( ( sumXY ) - ( sumX * sumY / n) );
  var dtorX = sumX2 - ( sumX * sumX / n);
  var dtorY = sumY2 - ( sumY * sumY / n);
 
  var r = ntor / (Math.sqrt( dtorX * dtorY )); // Pearson ( http://www.stat.wmich.edu/s216/book/node122.html )
  var m = ntor / dtorX; // y = mx + b
  var b = ( sumY - m * sumX ) / n;

  return {r: r, m: m, b: b};
}

d3.csv('data/Data.csv', function(data) {

  var keysNum = ["YEAR","PD Capacitance (fF)", "NUMBER OF CHANNELS (Lambda)","TOTAL DATA RATE (Gbps)","DATA RATE PER LANE (Gbps)","TX POWER PER LANE (mW)","RX POWER PER LANE (mW)","TOTAL POWER PER LANE (mW)","TX E/B (fJ/b)","RX E/B (fJ/b)","TOTAL E/B (fJ/b)","RX SENSITIVITY (uA)","PD RESPONSIVITY (A/W)","CHIP AREA (mm^2)"];
  var keysStr = ["JOURNAL/CONF","AFFILIATION","CHANNEL TYPE","MODULATION TYPE","TECHNOLOGY"];
  var keysMeta = ["URL","TITLE","ABSTRACT"];
   
   var xAxisOptions = keysNum;
   var yAxisOptions = keysNum;
   var groupOptions = keysStr;
   var xAxis = xAxisOptions[0], yAxis = yAxisOptions[1], group = groupOptions[0];
  
  var data = parseAxisData(data,keysNum,keysStr,keysMeta);
  var bounds = getBounds(data, 1);
  var colors = ["#1abc9c","#e67e22","#9b59b6","#2980b9","#f1c40f","#27ae60","#c0392b","#34495e","#7f8c8d","#e74c3c","#16a085","#f39c12","#3498db","#95a5a6","#2ecc71"]; //supports up to 15 different groups

  var groups = createGroups(data,group);
  var groupColors={};
  var k=0;
  groups.forEach(function(d) {
    groupColors[d]=colors[k];
    k++;

  });

  // SVG AND D3 STUFF
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 640);
  var xScale, yScale;

  svg.append('g')
    .classed('chart', true)
    .attr('transform', 'translate(80, -60)');

  // Build menus
  d3.select('#y-axis-menu')
  .on('change', function() {
      yAxis = this.value;
      updateChart(1500);
    })
    .selectAll('option')
    .data(yAxisOptions)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .property("selected", function(d) {
      return d === yAxis;
    });

    d3.select('#x-axis-menu')
    .on('change', function() {
      xAxis = this.value;
      updateChart(1500);
    })
    .selectAll('option')
    .data(yAxisOptions)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .property("selected",function(d) {
      return d === xAxis;
    });

    d3.select('#group-menu')
    .on('change', function() {
      group = this.value;
      updateChart(0);
    })
    .selectAll('option')
    .data(groupOptions)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .property("selected",function(d) {
      return d === group;
    })
    

  // Best fit line (to appear behind points)
  d3.select('svg g.chart')
    .append('line')
    .attr('id', 'bestfit');

  // Axis labels
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'xLabel', 'x': 400, 'y': 670, 'text-anchor': 'middle'})
    .text(xAxis);

  d3.select('svg g.chart')
    .append('text')
    .attr('transform', 'translate(-60, 330)rotate(-90)')
    .attr({'id': 'yLabel', 'text-anchor': 'middle'})
    .text(yAxis);

  // Render points
  updateScales();
  d3.select('svg g.chart')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
    })
    .attr('cy', function(d) {
      return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
    })
    .attr('r', 4)
    .style('cursor', 'pointer')
    .on('click', function() {
      d=this.__data__;
      window.open(d["URL"]);
    });
    $('svg g.chart circle').each(function(){
      $(this).tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() {
          var d = this.__data__;
          return d[group]; 
        }
      });
  });
    

  updateChart(1500);
  //updateMenus();

  // Render axes
  
  d3.select('svg g.chart')
    .append("g")
    .attr('transform', 'translate(0, 630)')
    .attr('id', 'xAxis')
    .call(makeXAxis);

  d3.select('svg g.chart')
    .append("g")
    .attr('id', 'yAxis')
    .attr('transform', 'translate(-10, 0)')
    .call(makeYAxis);



  //// RENDERING FUNCTIONS
  function updateChart(duration) {
    updateScales();
    d3.select('svg g.chart')
      .selectAll('circle')
      .transition()
      .duration(500)
      .ease('quad-out')
      .attr('cx', function(d) {
        return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
      })
      .attr('cy', function(d) {
        return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
      })
      .attr('r', function(d) {
        return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0 : 8;
      });

    // Also update the axes
    d3.select('#xAxis')
      .transition()
      .call(makeXAxis);

    d3.select('#yAxis')
      .transition()
      .call(makeYAxis);

    // Update axis labels
    d3.select('#yLabel')
      .text(yAxis);
    d3.select('#xLabel')
      .text(xAxis);

    // Update correlation
    var xArray = _.map(data, function(d) {return d[xAxis];});
    var yArray = _.map(data, function(d) {return d[yAxis];});
    var c = getCorrelation(xArray, yArray);
    var x1 = xScale.domain()[0], y1 = c.m * x1 + c.b;
    var x2 = xScale.domain()[1], y2 = c.m * x2 + c.b;

    //Update colors
    d3.select('svg g.chart')
    .selectAll('circle')
    .attr('fill', function(d) {
      var groups = createGroups(data,group);
      var groupColors={};
      var k=0;
      groups.forEach(function(d) {
        groupColors[d]=colors[k];
        k++;

      });
      return groupColors[d[group]];
    })

    // Fade in
    d3.select('#bestfit')
      .style('opacity', 0)
      .attr({'x1': xScale(x1), 'y1': yScale(y1), 'x2': xScale(x2), 'y2': yScale(y2)})
      .transition()
      .duration(duration)
      .style('opacity', 1);

  }

  function updateScales() {
    xScale = d3.scale.linear()
                    .domain([bounds[xAxis].min, bounds[xAxis].max])
                    .range([20, 780]);
                    

    yScale = d3.scale.linear()
                    .domain([bounds[yAxis].min, bounds[yAxis].max])
                    .range([600, 100]);    
  }

  function makeXAxis(s) {
    s.call(d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(d3.format("")));
  }

  function makeYAxis(s) {
    s.call(d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickFormat(d3.format("")));
  }

})