var scatterChart = function(options) {
  var width = 600,
    height = 400;
  var margin = 60;
  var xdim = 'Ed_Try';
  var ydim = 'Em_Try';

  var chartSelection, svg;
  var circles;;

  var xscale, yscale, xAxis, yAxis;

  function chart(selection, dataset) {
    // we gonna get here
    chartSelection = selection;
    svg = selection.append("svg")
      .attr("width", width)
      .attr("height", height);

    // create the scales

    var y = d3.scaleLinear().range([height, 0]);
    var maxx = d3.max(dataset, function(d) {
      return d[xdim];
    });

    xscale = d3.scaleLinear()
      .domain([0, 100])
      .range([margin, width - margin])

    var maxy = d3.max(dataset, function(d) {
      return d[ydim];
    });

    yscale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin, margin])

    xAxis = d3.axisBottom().scale(xscale);

    yAxis = d3.axisLeft(yscale);

    var brush = d3.brush()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on("brush", brushed)
      .on("end", brushended);

    //draw axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0 ," + (height - margin) + ")")
      .call(xAxis);

    svg.append("text")
      .attr("x", 300)
      .attr("y", 200)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .text("Percentage of Population");

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin + " , 0)")
      .call(yAxis);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -40)
      .attr("y", 10)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .text("Employment Percentage");

    //draw title
    svg.append("text")
      .attr("x", 220)
      .attr("y", 30)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Tertiary Education ");

    svg.append("text")
      .attr("x", 220)
      .attr("y", 10)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Employment rate:");

    circles = svg.selectAll("circle.points")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "points")
      .attr("cx", function(d) {
        return xscale(d[xdim])
      })
      .attr("cy", function(d) {
        return yscale(d[ydim])
      })
      .attr("r", function(d) {
        return 4;
      })


      // if(d['country'] == 'USA') {
      //   .style("fill", "#4292c6")
      // }
      .attr("opacity", 0.7)
      .style("fill", function(d) {
        if (d.country == "USA")
          return "#ff4000";

        if (d.country == "NZL")
          return "#ffbf00";

        if (d.country == "CAN")
          return "#ffff00";

        if (d.country == "FRA")
          return "#80ff00";

        if (d.country == "EU") //change to EU
          return "#00bfff";

        if (d.country == "JPN") //change to JPN
          return "#ff00ff";

        if (d.country == "RUS") //change to RUS
          return "#000000";

        if (d.country == "KOR")
          return "#f8c6a1";
      });

    svg.append("g")
      .call(brush);
  }


  function brushed() {
    var s = d3.event.selection,
      x0 = s[0][0],
      y0 = s[0][1],
      dx = s[1][0] - x0,
      dy = s[1][1] - y0;
    //  console.log(s);
    var brushedData = [];

    svg.selectAll('circle.points')
      .style("fill", function(d) {

        if (xscale(d[xdim]) >= x0 && xscale(d[xdim]) <= x0 + dx && yscale(d[ydim]) >= y0 && yscale(d[ydim]) <= y0 + dy) {
          brushedData.push(d);
          return "#ec7014";
        } else {
          return "#4292c6";
        }
      });

    chart.onBrushData(brushedData)
  }

  function update(country) {

    if (country) { // user selected somting
      svg.selectAll('circle.points').attr("opacity", function(d) {
        if (d['country'] == country) return 0.7
        else return 0;
      });
    } else {
      svg.selectAll('circle.points').attr("opacity", 0.7);
    }
  }

  function brushended() {
    if (!d3.event.selection) {
      svg.selectAll('circle.points')
        .transition()
        .duration(150)
        .ease(d3.easeLinear)
        .style("fill", "#4292c6");
    }
  }

  function isBrushed(brush_coords, cx, cy) {

    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }

  chart.highlightcountry = function(country) {
    update(country);
  }

  chart.width = function(value) {
    if (!arguments.length) {
      return width;
    }
    width = value;
    return chart;
  }

  chart.height = function(value) {
    if (!arguments.length) {
      return height;
    }
    height = value;
    return chart;
  }


  chart.fillColor = function(value) {
    if (!arguments.length) return fillColor;
    fillColor = value;
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  chart.onBrushData = function(data) {
    console.log(" the default handler of on brush data length of brushed data " + data.length);
  };

  return chart;
}