var barChart = function(options) {

  // set the dimensions and margins of the graph
  var margin = {
      top: 140,
      right: 20,
      bottom: 50,
      left: 100
    },
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


  // set the ranges

  var yDim = "avg";

  var yearspercountry;
  var svg;
  var keys, bars, x, y;
  var xAxis, yAxis;


  var SVGselection;

  function chart(selection, data) {

    SVGselection = selection;

    x = d3.scaleBand().range([0, width]).paddingInner(0.05);
    y = d3.scaleLinear().range([height, 0]);

    xAxis = d3.axisBottom(x);
    yAxis = d3.axisLeft(y);


    svg = selection.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // process the data to  get how many games per year ...
    yearspercountry = d3.nest()
      .key(function(d) {
        return d['country'];
      })

      .rollup(function(v) {
        return {
          count: v.length,
          total: d3.sum(v, function(d) {
            return d["gdp"];
          }),
          avg: d3.mean(v, function(d) {
            return d["gdp"];
          })
        };
      })
      .entries(data);

    console.log(yearspercountry);

    keys = yearspercountry.map(function(d) {
      return d['key'];
    });
    console.log(keys);
    // scale the range of the data
    x.domain(keys);
    y.domain([0, d3.max(yearspercountry, function(d) {
      return d.value[yDim];
    })]);





    // add the dots with tooltips
    bars = svg.selectAll("rect.bar")
      .data(yearspercountry)
      .enter()
      .append("rect")
      .attr("class", "bar");

    bars.attr("x", function(d, i) {
        return x(d.key);
      })
      .attr("y", function(d) {
        return y(d.value[yDim]);

      })

      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.value[yDim]);
      })
      .attr("fill", function(d) {
        return "teal";

      });



    bars.on("click", function(d) {

        var highlightkey = d.key;

        // remove previous selecitons ...
        d3.selectAll("rect.bar").attr("fill", "teal");

        d3.select(this)
          .attr("fill", "orange");

        chart.onClick(highlightkey);


        d3.selectAll("rect.bar").classed("dim", function(dd) {
          if (dd.key == highlightkey)
            return false;
          else
            return true;
        })

      })
      .on("dblclick", function(d) {


        chart.onDblClick(d.key);


        d3.selectAll("rect.bar").attr("fill", "teal");

        d3.selectAll("rect.bar").classed("dim", function(dd) {
          return false;

        });


      });

    // add the X Axis
    svg.append("g")
      .attr("class", "axis xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    svg.append("text")
      .attr("x", 320)
      .attr("y", 380)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Country");

    // add the Y Axis
    svg.append("g")
      .attr("class", "axis yaxis")
      .call(yAxis);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -150)
      .attr("y", -80)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("GDP");

    //draw title
    svg.append("text")
      .attr("x", 300)
      .attr("y", -40)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Average GDP Of Different Countries between 1994 - 2014");

  }


  function update(data) {
    yearspercountry = d3.nest()
      .key(function(d) {
        return d['country'];
      })

      .rollup(function(v) {
        return {
          count: v.length,
          total: d3.sum(v, function(d) {
            return d["gdp"];
          }),
          avg: d3.mean(v, function(d) {
            return d["gdp"];
          })
        };
      })
      .entries(data);

    keys = yearspercountry.map(function(d) {
      return d['key'];
    });


    // add the dots with tooltips
    bars = svg.selectAll("rect.bar")
      .data(yearspercountry);

    bars.transition()
      .attr("x", function(d, i) {
        return x(d.key);
      })
      .attr("y", function(d) {
        return y(d.value[yDim]);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.value[yDim]);
      })
      .attr("fill", function(d) {
        return "teal";

      });



    bars.on("click", function(d) {
        var highlightkey = d.key;
        // remove previous selecitons ...
        d3.selectAll("rect.bar").attr("fill", "teal");

        d3.select(this)
          .attr("fill", "orange");

        chart.onClick(highlightkey);

        d3.selectAll("rect.bar").classed("dim", function(dd) {
          if (dd.key == highlightkey)
            return false;
          else
            return true;
        })

      })
      .on("dblclick", function(d) {
        chart.onDblClick(d.key);

        d3.selectAll("rect.bar").attr("fill", "teal");

        d3.selectAll("rect.bar").classed("dim", function(dd) {
          return false;
        });
      });

  }

  function sort(sortValues) {
    // code from the example https://bl.ocks.org/mbostock/3885705
    var sortedKeyByValue = yearspercountry
      .sort(function(a, b) {
        return b.value[yDim] - a.value[yDim];
      })
      .map(function(d) {
        return d['key'];
      });

    if (sortValues) {
      x.domain(sortedKeyByValue)
    } else {
      x.domain(keys);
    }

    bars.sort(function(a, b) {
      return x(a.key) - x(b.key);
    });

    var transition = svg.transition().duration(750),
      delay = function(d, i) {
        return i * 50;
      };

    transition.selectAll("rect.bar")
      .delay(delay)
      .attr("x", function(d) {
        return x(d.key);
      });

    transition.select(".xaxis")
      .call(xAxis)
      .selectAll("g")
      .delay(delay);
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

  chart.onClick = function(selection) {
    console.log(" the default handler of on brush data length of brushed data " + selection);
  };

  chart.onDblClick = function(selection) {
    console.log(" the default handler of on brush data length of brushed data " + selection);
  };

  chart.updateChart = function(newData) {
    update(newData);
  };

  chart.sort = function(sortValue) {
    sort(sortValue);
  }

  return chart;
}