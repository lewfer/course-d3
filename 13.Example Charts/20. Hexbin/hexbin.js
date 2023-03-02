/*
 * hexbin.js
 * 
 * D3 hexbin chart using the D3SI library
 * Adapted from here: https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
 */

function drawHexbin(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol'] || data.columns[1]
    const colours = parameters['colours'] || d3.interpolateOranges
    const stroke = parameters['stroke'] || "black"
    const strokeWidth = parameters['strokeWidth'] || 0.1

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Create our scales to map data to screen position and colours
    let xScale = chart.xScaleLinear(xCol)
    let yScale = chart.yScaleLinear(yCol) 

    // Reformat the data: d3.hexbin() needs a specific format
    let inputForHexbinFun = []
    data.forEach(function(d) {
        inputForHexbinFun.push( [xScale(d[xCol]), yScale(d[yCol])] ) 
    })

    // Create a function to compute the hexbins
    let hexbin = d3.hexbin()
        .radius(15) // size of the bin in px
        .extent([ [0, 0], [chart.drawingWidth, chart.drawingWidth] ])

    // Get the hexbins with the counts (length)
    let hexData = hexbin(inputForHexbinFun)

    // Get the max length and use it to create a colour scale
    let maxCount = getMaxValue(hexData, 'length')
    let colourScale = chart.colourScaleSequential([0,maxCount], colours)

    // Don't draw outside of the chart drawing area
    chart.clipDrawingArea()

    // Plot the hexbins
    chart.svg
        .append("g")
            .attr("clip-path", "url(#clip)")
                .selectAll("path")
                .data(hexData)
                    .enter()
                    .append("path")
                        .attr("d", hexbin.hexagon())
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .attr("fill", function(d) { return colourScale(d.length); })
                        .attr("stroke", stroke)
                        .attr("stroke-width", strokeWidth)    

    // Add axes
    chart.drawAxisXBottom(xScale, xCol,5)
    chart.drawAxisYLeft(yScale, yCol, 5) 
}


