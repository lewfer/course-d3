/*
 * hbar.js
 * 
 * D3 code to draw a horizontal bar chart which can receive redraw requests from other charts
 */

function drawHBar(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const yCol = parameters['yCol'] || data.columns[0]
    const xCol = parameters['xCol'] || data.columns[1]
    const filterCol = parameters['filterCol'] 
    const colours = parameters['colours'] || d3.schemeCategory10
    const dispatch = parameters['dispatch'] 
    const titleTop = parameters['titleTop']

    let filteredData = rollup(data, yCol, xCol)      

    // Create our D3 Simple object
    let chart = new D3SI(container, filteredData, parameters)

    // Create our scales to map data to screen position and colours
    let xScale = chart.xScaleLinear("value") 
    let yScale = chart.yScaleBand("key") 
    let colourScale = chart.colourScaleOrdinal("key", colours) 

    update()
  
    // Add axes
    chart.drawAxisXTop(xScale)
    chart.drawAxisYLeft(yScale) 
    chart.drawTitleTop(titleTop + "all")

    function update() {
        chart.reloadData(filteredData)

        // Get a selection object representing all the bars we want in the chart
        let barSelection = chart.bind('rect')    

        // Add the bars to the chart
        let minx = 0
        barSelection
            // Handle 'entered' items, i.e. new bars
            .enter()
            .append("rect")
            .attr("x",        function(d) { return chart.paddingLeft })
            .attr("y",        function(d) { return yScale(d["key"]) })
            .style("fill",    chart.colourMap("key",colourScale) )
            .style("opacity", 1)
            .attr("height",   yScale.bandwidth())

            // Handle 'entered' and 'updated' items, i.e. new bars and existing bars
            // Merges the original selection with the entered elements            
            .merge(barSelection)
            .transition()
            .duration(3000)
            .attr("width",    function(d) { return xScale(d["value"])-xScale(minx) })  
    }    

    // Create an event listener, waiting to be notified that the linked chart has been requested 
    dispatch.on('redraw', function(filterValue) {
        filteredData = filterByValue(data, filterCol, filterValue) 
        filteredData = rollup(filteredData, yCol, xCol) 
        chart.drawTitleTop(titleTop + filterValue)
        update()
    })      
}
