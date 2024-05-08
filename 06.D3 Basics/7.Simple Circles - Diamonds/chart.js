/*
 * circles.js
 * D3 code to draw a diamonds chart.
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    const data = await d3.csv(dataFile);
    data.forEach(d=>{
        d.score = parseInt(d.score), // convert from string to int
        d.age = parseInt(d.age)      // convert from string to int
    });
    
    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

   // Create a banded scale to map player name to an x screen coordinate 
   let xScale = d3.scaleBand()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the on-screen coordinates

    // Create a linear scale to map score to a square width 
    let rScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.score)])      // domain is 0 to the maximum value in the column
        .range([0, 70])                             // range is the range of radii we want 

    // Create a linear scale to map player age to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.age)])        // domain is 0 to the maximum value in the column
        .range([PLOT.BOTTOM, PLOT.TOP])             // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Create an ordinal scale to map players to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items

    // Compute an offset so our data and xaxis align
    let xOffset = xScale.bandwidth()/2
    
    // Add the rotated rect svg elements to the chart, one for each item in the selection
    // The centre of the rectangle should be at X:d=>xScale(d.player) + xOffset, Y:yScale(d.age)
    // so we rotate around this point
    // The x,y coordinates of the rect need to take into consideration its size, so both
    // are adjusted by -rScale(d.score)/2
    selection
        .enter()  
        .append("rect") 
            .attr("x",         d=>xScale(d.player) + xOffset - rScale(d.score)/2)
            .attr("y",         d=>yScale(d.age) - rScale(d.score)/2)
            .attr("width",     d=>rScale(d.score))
            .attr("height",    d=>rScale(d.score))
            .attr("transform", d=>"rotate(45, " + (xScale(d.player) + xOffset)+", " +  yScale(d.age) + ")")
            .style("fill",     d=>colourScale(d.player)) 
            .style("opacity",  0.7)                          

    // An alternative approach.  Centre the rect at 0,0 then translate to position and rotate
    selection
        .enter()
        .append("rect") 
            .attr("x",        d=>-rScale(d.score)/2)
            .attr("y",        d=>-rScale(d.score)/2)
            .attr("width",    d=>rScale(d.score))
            .attr("height",   d=>rScale(d.score))
            .attr("transform", d=>"translate(" + (xScale(d.player)+xOffset) + "," + yScale(d.age) + ") rotate(45) ")
            .style("fill",    "none") 
            .style('stroke',  "red")                            
    
    // Draw outline unrotated rects for reference
    selection
    .enter() 
    .append("rect") 
        .attr("x",        d=>xScale(d.player) + xOffset-rScale(d.score)/2)
        .attr("y",        d=>yScale(d.age)-rScale(d.score)/2)
        .attr("width",    d=>rScale(d.score))
        .attr("height",   d=>rScale(d.score))
        .style("fill",    "none") 
        .style('stroke',  "black")                        

    // Draw vertical lines for reference
    selection
    .enter() 
    .append("line") 
        .attr("x1",       d=>xScale(d.player) + xOffset)
        .attr("y1",       d=>yScale(0))
        .attr("x2",       d=>xScale(d.player) + xOffset)
        .attr("y2",       d=>yScale(d.age))
        .style('stroke',  "lightgrey")

    // Draw horizontal lines for reference
    selection
    .enter() 
    .append("line")
        .attr("x1",       PLOT.LEFT)
        .attr("y1",       d=>yScale(d.age))
        .attr("x2",       d=>xScale(d.player) + xOffset)
        .attr("y2",       d=>yScale(d.age))
        .style('stroke',  "lightgrey")

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))                                // create the axis
}
