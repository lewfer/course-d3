/*
 * Heatmap.js
 * D3 code to draw a heatmap
 */

function drawHeatmap(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    //const width = parameters['width'] || 600
    //const height = parameters['height'] || 400
    //const padding =  parameters['padding'] || 50
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol']
    const valueCol = parameters['valueCol']
    const minColour = parameters['minColour'] || '#ffffff'
    const maxColour = parameters['maxColour'] || '#d95f0e'
    getTooltipData = parameters['getTooltipData']

    // Create our chart object
    let chart = new D3SI(container, data, parameters)

    // Load and process the data
    //chart.loadData(data)
    //chart.setIndex(xCol)

    // Create the SVG element in which we will draw the chart
    //let svg = chart.createSvg()

    chart.tooltipCreate()

    // Create our scales to map data values to screen position 
    let xScale = chart.xScaleBand(xCol)
    let yScale = chart.yScaleBand(yCol)
    let colourScale = chart.colourScaleLinear(valueCol, minColour, maxColour) 

    // Compute an offset so our data and xaxis align
    let xOffset = xScale.bandwidth()/2

    // Get an object representing all the circles in the chart
    let rects = chart.bind("rect", data) 

    rects
        .enter()
        .append("rect")
            .attr("x",        function(d) { return xScale(d[xCol]) })
            .attr("y",        function(d) { return yScale(d[yCol]) })
            .attr("width",    xScale.bandwidth())
            .attr("height",   yScale.bandwidth())
            .style("fill", chart.colourMap(valueCol,colourScale))
            .style("opacity", 0.7)
            // Add the event handlers for the tooltip
            .on('mouseover',  function (d) { chart.tooltipShow(this, tooltipStyleShow) })
            .on('mousemove',  function (d) { chart.tooltipMove(this, getTooltipData(d)) })
            .on('mouseout',   function (d) { chart.tooltipHide(this, tooltipStyleHide) })  

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
    
    // Add axes
    chart.drawAxisXBottom(xScale)
    chart.drawAxisYLeft(yScale)         
}


        