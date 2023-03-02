/*
 * bubble.js
 * D3 code to draw a bubble
 */

function drawBubble(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const title = parameters['title'] || ""
    //const width = parameters['width'] || 600
    //const height = parameters['height'] || 400
    //const padding =  parameters['padding'] || 50
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol']
    const bubbleSizeCol = parameters['bubbleSizeCol']
    const colourCol = parameters['colourCol']
    const colours = parameters['colours'] || d3.schemeCategory10

    // Create our chart object
    let chart = new D3SI(container, data, parameters)

    chart.drawTitleTop(title)

    chart.tooltipCreate()

    // Create our scales to map data values to screen position 
    let xScale = chart.xScaleLinear(xCol)
    let yScale = chart.yScaleLinear(yCol)
    let rScale = chart.scaleCircleRadius(bubbleSizeCol, 2, 20)
    let colourScale = chart.colourScaleOrdinal(colourCol, colours) 

    // Get an object representing all the circles in the chart
    let circles = chart.bind("circle", data) 

    // Add the circles to the chart
    circles
        .enter()
        .append("circle")
            .attr("cx",         function (d) { return xScale(d[xCol]) })
            .attr("cy",         function (d) { return yScale(d[yCol]) })
            //.attr("r", 20)
            .attr("r",          function (d) { return rScale(d[bubbleSizeCol]) })
            .style("fill",      function(d) { return colourScale(d[colourCol]) })
            .style("opacity",   0.7)
            // Add the event handlers for the tooltip
            .on('mouseover',  function (d) { chart.tooltipShow(this, tooltipStyleShow) })
            .on('mousemove',  function (d) { chart.tooltipMove(this, getTooltipData(d)) })
            .on('mouseout',   function (d) { chart.tooltipHide(this, tooltipStyleHide) })  

    // Add axes
    chart.drawAxisXBottom(xScale, xCol, 10)
    chart.drawAxisYLeft(yScale, yCol, 10) 

    function tooltipStyleShow(el) {
        d3.select(el)
            .style("stroke", "black")
            .style("opacity", 1)
    }

    function tooltipStyleHide(el) {

        d3.select(el)
            .style("stroke", "none")
            .style("opacity", 0.7)
    }
}


        