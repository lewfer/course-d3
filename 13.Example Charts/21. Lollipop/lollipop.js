/*
 * lollipop.js
 * 
 * D3 lollipop chart using the D3SI library
 * Adapted from here: https://www.d3-graph-gallery.com/graph/lollipop_horizontal.html
 */

function drawLollipop(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol'] || data.columns[1]
    const colours = parameters['colours'] || d3.schemeCategory10
    const stroke = parameters['stroke'] || "black"
    const strokeWidth = parameters['strokeWidth'] || 3

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Create our scales to map data to screen position and colours
    let xScale = chart.xScaleLinear(xCol)
    let yScale = chart.yScaleBand(yCol).padding(1)
    let colourScale = chart.colourScaleOrdinal(yCol, colours) 

    // Lines
    lineSelection = chart.bind("line", data)

    lineSelection
        .enter()
        .append("line")
            .attr("x1", function(d) { return xScale(d[xCol]); })
            .attr("x2", xScale(0))
            .attr("y1", function(d) { return yScale(d[yCol]); })
            .attr("y2", function(d) { return yScale(d[yCol]); })
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)

    // Circles
    circleSelection = chart.bind("circle", data)
    circleSelection
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d[xCol]); }) 
            .attr("cy", function(d) { return yScale(d[yCol]); })
            .attr("r", "7")
            .style("fill", chart.colourMap(yCol,colourScale))
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)

    // Add axes
    chart.drawAxisXBottom(xScale, xCol)
    chart.drawAxisYLeft(yScale, yCol)
}


