/*
 * chart.js
 * 
 * D3 hexbin chart 
 * Adapted from here: https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 500
    const HEIGHT = 500
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    const data = await d3.csv(dataFile);

    // Convert any numbers to strings
    convertNumbers(data)

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Create a linear scale to map horizontal value to an x screen coordinate
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.horizontal)])        // domain is 0 to the maximum value in the column
        .range([PLOT.LEFT, PLOT.RIGHT])                    // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Create a linear scale to map vertical value to a y screen coordinate
    console.log(d3.max(data, d=>d.vertical))
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.vertical)])           // domain is 0 to the maximum value in the column
        .range([PLOT.BOTTOM, PLOT.TOP])                     // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Reformat the data: d3.hexbin() needs a specific format
    let inputForHexbinFun = []
    data.forEach(function(d) {
        inputForHexbinFun.push( [xScale(d.horizontal), yScale(d.vertical)] ) 
    })
    
    // Create a function to compute the hexbins
    let hexbin = d3.hexbin()
        .radius(15) // size of the bin in px
        .extent([ [0, 0], [PLOT.WIDTH, PLOT.HEIGHT] ])

    // Get the hexbins with the counts (length)
    let hexData = hexbin(inputForHexbinFun)

    // Get the max length and use it to create a colour scale
    let maxCount = d3.max(hexData, function(d) { return d.length }) 

    var colourScale = d3.scaleSequential()
        .domain([0, maxCount]) // Number of points in the bin
        .interpolator(d3.interpolateOranges)

    // Don't draw outside of the chart drawing area
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", PLOT.LEFT)
        .attr("y", PLOT.TOP)
        .attr("width", PLOT.WIDTH)
        .attr("height", PLOT.HEIGHT)

    // Plot the hexbins
    svg
        .append("g")
            .attr("clip-path", "url(#clip)")
                .selectAll("path")
                .data(hexData)
                    .enter()
                    .append("path")
                        .attr("d", hexbin.hexagon())
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .attr("fill", function(d) { return colourScale(d.length); })
                        .attr("stroke", "black")
                        .attr("stroke-width", "0.2")    

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale).ticks(5))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale).ticks(5))    
}


// Function to convert anything that looks like a number to a number
function convertNumbers(data) {
    data.forEach(function(d) {
        for (let key in d) {
          if (+d[key]===+d[key]) {
            d[key] = +d[key]
          }
        }
      });
}
        