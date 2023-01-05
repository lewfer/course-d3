/*
 * circles.js
 * D3 code to draw a simple circles chart.
 * Taking the "Spread along x-axis" chart and
 * making circles vary in size according to the score
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

    // Create our scales to map data values to screen coordinates 
    let xScale = d3.scaleBand()
        .domain(data.map(d=>d.player))             // domain is the list of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])        // range is the on-screen coordinates

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")            // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                     // bind the data to the chart items

    // Add the circles svg elements to the chart, one for each item in the selection
    selection
        .enter()                                // get the 'entered' data items
        .append("circle")                       // create a circle for each one
            .attr("cx", d=>xScale(d.player))    // place the circle on the x axis based on the player
            .attr("cy", HEIGHT / 2)             // place the circle vertically centred
            .attr("r",  d=>d.score);            // fix the radius to 20 pixels
}


        