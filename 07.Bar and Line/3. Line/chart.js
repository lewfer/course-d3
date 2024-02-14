/*
 * line.js
 *  
 * D3 code to draw a simple line chart
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}
    const colour ="#f02035"

    // Load the data
    const data = await d3.csv(dataFile);
    console.log(data)
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

    // Create a linear scale to map player age to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.age)])        // domain is 0 to the maximum value in the column
        .range([PLOT.BOTTOM, PLOT.TOP])             // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Define the line generator function
    // It will generate an SVG path which plots the player on the x axes and the value on the y axis
    // So a call like this:
    //      linepoints([{player: 'Anna', score: '10', age: '16'}, {player: 'Bernard', score: '60', age: '42'},{player: 'Carla', score: '40', age: '35'}])
    // will return a path something like this:
    //      M50,401.851L133.333,161.111L216.666,225.925
    let linepoints = d3.line()
        .x(d=>xScale(d.player))
        .y(d=>yScale(d.age));
    //console.log(linepoints([{player: 'Anna', score: '10', age: '16'}, {player: 'Bernard', score: '60', age: '42'},{player: 'Carla', score: '40', age: '35'}]))

    // Get an object representing the one line
    let selection = svg.append("path").datum(data)

    // Add the line to the chart
    selection
        .attr("class",      "line")
        .attr("d",          d=>linepoints(d))
        .attr("transform",  "translate(" + xScale.bandwidth()/2 + ",0)")      // move to right to align data points with axis
        .style("stroke",    colour)    


    // Add x axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                                // create the axis

    // Add y axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(" + PLOT.TOP + ",0)")      // move the axis to the left 
        .call(d3.axisLeft(yScale))                                  // create the axis

}
