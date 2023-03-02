/*
 * bar.js
 * 
 * D3 code to draw a simple bar chart
 */

function drawBar(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol'] || data.columns[1]
    const colours = parameters['colours'] || d3.schemeCategory10
    let miny = 0

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Create our scales to map data to screen position and colours
    let xScale = chart.xScaleBand(xCol) 
    let yScale = chart.yScaleLinear(yCol) 
    let colourScale = chart.colourScaleOrdinal(xCol, colours) 

    // Get a selection object representing all the bars we want in the chart
    let barSelection = chart.bind('rect')

    // Add the bars to the chart
    barSelection
         // Handle 'entered' data items by creating a rect for each one
        .enter()
        .append("rect")
            .attr("x",        function(d) { return xScale(d[xCol]) })
            .attr("y",        function(d) { return yScale(d[yCol]) })
            .attr("width",    xScale.bandwidth())
            .attr("height",   function(d) { return yScale(miny)-yScale(d[yCol]) })    
            .style("fill",    chart.colourMap(xCol,colourScale))
            .style("opacity", 1)        
        
    // Add axes
    chart.drawAxisXBottom(xScale, xCol)
    chart.drawAxisYLeft(yScale, yCol) 
}
