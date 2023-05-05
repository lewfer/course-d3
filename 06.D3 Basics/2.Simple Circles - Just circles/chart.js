/*
 * circles.js
 * D3 code to draw a simple circles chart.
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600

    // Load the data
    const data = await d3.csv(dataFile);

    // Add the svg element, in which we will draw the chart, to the container
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")            // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                     // bind the data to the chart items

    // Add the circles svg elements to the chart, one for each item in the selection
    selection
        .enter()                        // get the 'entered' data items
        .append("circle")               // create a circle for each one
            .attr("cx", WIDTH / 2)      // place the circle horizontally centred
            .attr("cy", HEIGHT / 2)     // place the circle vertically centred
            .attr("r",  20);            // fix the radius to 20 pixels
}


        