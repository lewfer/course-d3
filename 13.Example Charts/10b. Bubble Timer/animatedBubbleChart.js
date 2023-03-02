/*
 * animatedBubbleChart.js
 * D3 code to draw a bubble
 */

function drawAnimatedBubbleChart(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const title = parameters['title'] || ""
    const xCol = parameters['xCol'] || data.columns[0]              // column which will appear on the x axis
    const yCol = parameters['yCol']                                 // column which will appear on the y axis
    const bubbleSizeCol = parameters['bubbleSizeCol']               // column which will be used for the bubble size
    const colourCol = parameters['colourCol']                       // column which will be used for the bubble colour
    const colourColNames = parameters['colourColNames']             // unique names from the column used for bubble colour, to ensure consistent colours
    const animateCol = parameters['animateCol']                     // column which will be used for the animation
    const colours = parameters['colours'] || d3.schemeCategory10    // colour scheme to use
    const opacity = parameters['opacity'] || 0.7                    // opacity of the circles
    const interval = parameters['interval'] || 1000                 // animation frame interval in milliseconds

    // Get data range across all data so we can set fixed axes that won't change over the animation
    let minX = getMinValue(data, xCol)
    let maxX = getMaxValue(data, xCol)
    let minY = getMinValue(data, yCol)
    let maxY = getMaxValue(data, yCol)

    // Get the range of values we need to animate over
    let animateValue = getMinValue(data, animateCol)
    let animateValueMax = getMaxValue(data, animateCol)

    // Filter data to just that required by the first frame of the animation
    let filteredData = filterByValue(data, animateCol, animateValue) 

    // Create our chart object
    let chart = new D3SI(container, data, parameters) 

    // Create the tooltip
    chart.tooltipCreate()

    // Draw the title, appending the animation value
    chart.drawTitleTop(title + " " + animateValue)

    // Create our scales to map data values to screen position 
    let xScale = chart.xScaleLinearMinMax(0,maxX)
    let yScale = chart.yScaleLinearMinMax(0, maxY)
    let rScale = chart.scaleCircleRadius(bubbleSizeCol, 2, 50)
    let colourScale = chart.consistentColourScale(colourColNames, colours) 

    // Define a function to draw or update the circles
    function update() {
        // Load and process the filtered data for the frame
        chart.reloadData(filteredData)

        // Get an object representing all the circles in the chart
        let circles = chart.bind("circle", filteredData) 

        // Add the circles to the chart
        circles
            // Handle 'entered' items, i.e. new circles
            .enter()
            .append("circle")
            
            // Handle 'entered' and 'updated' items, i.e. new circles and existing circles
            // Merges the original selection with the entered elements
            .merge(circles)
                .attr("cx",         function (d) { return xScale(d[xCol]) })
                .attr("cy",         function (d) { return yScale(d[yCol]) })
                .attr("r",          function (d) { return rScale(d[bubbleSizeCol]) })
                .style("fill",      function (d) { return colourScale(d[colourCol]) })
                .style("opacity",   opacity)
                // Add the event handlers for the tooltip
                .on('mouseover',    function (d) { chart.tooltipShow(this, tooltipStyleShow) })
                .on('mousemove',    function (d) { chart.tooltipMove(this, getTooltipData(d)) })
                .on('mouseout',     function (d) { chart.tooltipHide(this, tooltipStyleHide) })  

        // Remove old circles from the chart
        chart.remove(circles)     
            
        // Update the title with the animation value
        chart.updateTitle(title + " " + animateValue)             

    }

    // Add axes
    chart.drawAxisXBottom(xScale, xCol, 10)
    chart.drawAxisYLeft(yScale, yCol, 10) 

    // Draw the chart for the first time
    update()

    // Define a function to respond to the timer event
    function animate() {
        // Move to the next frame
        animateValue++

        if (animateValue>animateValueMax)
            // We've reached the end so stop the animation
            clearInterval(timer)
        else {
            // Filter the data for the next frame
            filteredData = filterByValue(data, animateCol, animateValue)  

            // Update the display with that data
            update()
        }
    }  

    // Set a timer event to trigger every interval milliseconds
    let timer = setInterval(animate, interval) 

    function tooltipStyleShow(el) {
        d3.select(el)
            .style("stroke", "black")
            .style("opacity", 1)
    }

    function tooltipStyleHide(el) {

        d3.select(el)
            .style("stroke", "none")
            .style("opacity", opacity)
    }        
}


        