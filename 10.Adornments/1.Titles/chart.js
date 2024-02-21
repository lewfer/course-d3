/*
 * circles.js
 * D3 code illustrating titles
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    const data = await d3.csv(dataFile);

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

   // Create a banded scale to map player name to an x screen coordinate 
   let xScale = d3.scaleBand()
        .domain(data.map(d=>d.player))
        .range([PLOT.LEFT, PLOT.RIGHT]) 

    // Create a linear scale to map score to a circle radius 
    let rScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.score)])
        .range([0, 70]) 

    // Create a linear scale to map player age to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.age)])
        .range([PLOT.BOTTOM, PLOT.TOP])

    // Create an ordinal scale to map players to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.player)) 
        .range(d3.schemeCategory10) 

    // Chart title
    svg.append("text")
        .attr("x", WIDTH/2)
        .attr("y", MARGIN.TOP/2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("Player Score Chart");

    // X axis title
    svg.append("text")
        .attr("x", WIDTH/2)
        .attr("y", PLOT.BOTTOM+MARGIN.BOTTOM-10)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("Player");

    // Y axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(HEIGHT/2))
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("Age");

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle") 
        .data(data)

    // Compute an offset so our data and xaxis align
    let xOffset = xScale.bandwidth()/2

    // Add the circles svg elements to the chart, one for each item in the selection
    selection
        .enter() 
        .append("circle")
            .attr("cx",       d=>xScale(d.player)+xOffset) 
            .attr("cy",       d=>yScale(d.age))
            .attr("r",        d=>rScale(d.score)) 
            .style("fill",    d=>colourScale(d.player))
            .style("opacity", 0.7)

    // Add x axis
    svg.append("g") 
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")
        .call(d3.axisBottom(xScale)) 

    // Add y axis
    svg.append("g")
        .attr("transform", "translate(" + PLOT.TOP + ",0)") 
        .call(d3.axisLeft(yScale)) 
}


        