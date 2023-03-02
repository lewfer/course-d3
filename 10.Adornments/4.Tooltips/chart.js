/*
 * circles.js
 * D3 code to draw a simple circles chart.
 * Taking the "Label axes" chart and
 * adding showing categorical colours for the players.
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
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the on-screen coordinates

    // Create a linear scale to map score to a circle radius 
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

    // create a tooltip
    var tooltip = d3.select(container)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")     

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event, d) {
        console.log("mo")
        tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(event, d) {
        tooltip
        .html("Age:" + d.age + "<br/>Score:" + d.score)
        .style("left", (event.pageX+50) + "px")
        .style("top", (event.pageY) + "px")
    }
    var mouseleave = function(event, d) {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }
    
    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items

    // Compute an offset so our data and xaxis align
    let xOffset = xScale.bandwidth()/2

    // Add the circles svg elements to the chart, one for each item in the selection
    selection
        .enter()                                            // get the 'entered' data items
        .append("circle")                                   // create a circle for each one
            .attr("cx",       d=>xScale(d.player)+xOffset)  // place the circle on the x axis based on the player
            .attr("cy",       d=>yScale(d.age))             // place the circle vertically centred
            .attr("r",        d=>rScale(d.score))           // fix the radius to 20 pixels
            .style("fill",    d=>colourScale(d.player))     // set a light blue colour
            .style("opacity", 0.7)                          // set opacity to 0.7
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.TOP + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))                                // create the axis


    // Add one dot in the legend for each name.
    let legendX = 475
    let legendY = 200
    svg.selectAll("dots")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", legendX)
        .attr("cy", (d,i)=>legendY + i*25) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", d=>colourScale(d.player))       
    svg.selectAll("labels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", legendX+15)
        .attr("y", (d,i)=>legendY + i*25) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", d=>colourScale(d.player))
        .text(d=>d.player)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")    

   
}


        