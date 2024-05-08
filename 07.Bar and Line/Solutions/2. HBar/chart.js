/*
 * hbar.js
 * 
 * D3 code to draw a simple horizontal bar chart
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

    // Create a linear scale to map player age to a x screen coordinate
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.age)])        // domain is 0 to the maximum value in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the drawing height 

    // Create a banded scale to map player name to an y screen coordinate  
    let yScale = d3.scaleBand()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range([PLOT.TOP, PLOT.BOTTOM])             // range is the on-screen coordinates

    // Create our color scale to map data values to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("rect")                          // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items

    // Add the bars to the chart
    selection
         // Handle 'entered' data items by creating a rect for each one
        .enter()
        .append("rect")
            .attr("x",        d=>xScale(0))
            .attr("y",        d=>yScale(d.player))
            .attr("height",   yScale.bandwidth())
            .attr("width",    d=>xScale(d.age)-xScale(0))
            .style("fill",    d=>colourScale(d.player))
            .style("opacity", 1)

    // Add x axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")      // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                                // create the axis

    // Add y axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")         // move the axis to the left 
        .call(d3.axisLeft(yScale))                                  // create the axis

}
