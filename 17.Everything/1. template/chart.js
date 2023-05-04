/*
 * chart.js
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


}


        