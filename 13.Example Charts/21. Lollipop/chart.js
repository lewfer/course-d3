/*
 * chart.js
 * 
 * D3 lollipop chart
 * Adapted from here: https://www.d3-graph-gallery.com/graph/lollipop_horizontal.html
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:75, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    const data = await d3.csv(dataFile);

    
    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Create a linear scale to score to an x screen coordinate
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.score)])        // domain is 0 to the maximum value in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the drawing height (top and bottom reversed to make origin at the bottom)

   // Create a banded scale to map player name to ay screen coordinate 
   let yScale = d3.scaleBand()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range([PLOT.TOP, PLOT.BOTTOM])             // range is the on-screen coordinates
        .padding(1)

    // Create an ordinal scale to map players to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale

    // X axis title
    svg.append("text")
        .attr("x", WIDTH/2)
        .attr("y", PLOT.BOTTOM+MARGIN.BOTTOM-10)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("Score");

    // Y axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(HEIGHT/2))
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("Player");

    // Get a selection object representing all the lines we want in the chart, one for each item in the data
    let lineSelection = svg    
        .selectAll("line")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items

    lineSelection
        .enter()
        .append("line")
            .attr("x1", function(d) { return xScale(d.score); })
            .attr("x2", xScale(0))
            .attr("y1", function(d) { return yScale(d.player); })
            .attr("y2", function(d) { return yScale(d.player); })
            .attr("stroke", "black")
            .attr("stroke-width", 3)

    // Get a selection object representing all the lines we want in the chart, one for each item in the data
    let circleSelection = svg    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items

    circleSelection
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.score); }) 
            .attr("cy", function(d) { return yScale(d.player); })
            .attr("r", "7")
            .style("fill", d=>colourScale(d.player))
            .attr("stroke", "black")
            .attr("stroke-width", 3)

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))             

}


