/*
 * Example showing writing data to a microbit
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    let data = [{x:0,y:1},{x:2,y:2},{x:4,y:0},{x:3,y:4}]
    let xVals = [0,1,2,3,4]
    let yVals = [0,1,2,3,4]

    // Connect to the microbit
    connectMicrobit();

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

   // Create a linear scale mapping the left-right tilt to the x screen coordinate 
   let xScale = d3.scaleBand()
        .domain(xVals)                       // domain is values 0 to 4
        .range([PLOT.LEFT, PLOT.RIGHT])      // range is drawing width 

    // Create a linear scale to mapping front-back tilt to a y screen coordinate
    let yScale = d3.scaleBand()
        .domain(yVals)                       // domain is values 0 to 4
        .range([PLOT.TOP, PLOT.BOTTOM])      // range is the drawing height 


    // Function run when mouse hovers over a cell
    var mouseover = function(event, d) {
        let data = d.x + "," + d.y 
        writeMicrobit(data)
    }

    // Get a selection object representing all the rects we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("rect")                // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                       // bind the data to the chart items, using the index to uniquely identify data points

    // Add the rects svg elements to the chart, one for each item in the selection
    selection
        .enter()                                     
        .append("rect")                                 
        .attr("x", function(d) { return xScale(d.x) })
        .attr("y", function(d) { return yScale(d.y) })
        .attr("width", xScale.bandwidth() )
        .attr("height", yScale.bandwidth() )
        .style("fill", "red" )
        .on("mouseover", mouseover)

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.TOP + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))                                // create the axis

}



        