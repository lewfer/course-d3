/*
 * bar.js
 * 
 * D3 code to draw a bar chart which can receive redraw requests from other charts
 */
function drawBar(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol'] || data.columns[1]
    const filterCol = parameters['filterCol'] 
    const colours = parameters['colours'] || d3.schemeCategory10
    const dispatch = parameters['dispatch'] 
    const titleTop = parameters['titleTop']

    let filteredData = rollup(data, xCol, yCol)

    // Create our D3 Simple object
    let chart = new D3SI(container, filteredData, parameters)

    // Create our scales to map data to screen position and colours
    let xScale = chart.xScaleBand("key") 
    let yScale = chart.yScaleLinear("value") 
    let colourScale = chart.colourScaleOrdinal('key', colours) 
    let miny = 0

    update()

    // Add axes
    chart.drawAxisXBottom(xScale)
    chart.drawAxisYLeft(yScale) 
    chart.drawTitleTop(titleTop + "all")

    function update() {
        chart.reloadData(filteredData)

        // Get an object representing all the circles in the chart
        let barSelection = chart.bind('rect')

        // Add the bars to the chart
        barSelection
            // Handle 'entered' data items by creating a rect for each one
            .enter()
            .append("rect")
                .attr("x",        function(d) { return xScale(d["key"]) })
                .attr("y",        function(d) { return yScale(d["value"]) })
                .attr("width",    xScale.bandwidth())
                .attr("height",   function(d) { return yScale(miny)-yScale(d["value"]) })    
                .style("fill",    chart.colourMap("key",colourScale))
                .style("opacity", 1)    

        // Add the bars to the chart
        //chart.bars(bars, "key", "value", xScale, yScale)
        //.style("fill", chart.colourMap('key',colourScale))
        //.style("opacity", 1)

        // Remove old bars from the chart
        chart.remove(barSelection)
    }

    // Create an event listener, waiting to be notified that the linked chart has been requested 
    dispatch.on('redraw.bar', function(filterValue) {
        filteredData = filterByValue(data, filterCol, filterValue) 
        filteredData = rollup(filteredData, xCol, yCol)
        chart.drawTitleTop(titleTop + filterValue)
        update()
    })         
}
