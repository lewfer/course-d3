/*
 * forcetransitions.js
 * 
 * Demo to show transitions between different force layouts
 */

function drawForceTransitionsChart(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol']
    const yCol = parameters['yCol']
    const xGroupCol = parameters['xGroupCol']
    const yGroupCol = parameters['yGroupCol']
    const bubbleSizeCol = parameters['bubbleSizeCol']
    const colourCol = parameters['colourCol']
    const colours = parameters['colours'] || d3.schemeCategory10
    const chargeStrength = 0.1 // how much bubble attract
    const collisionStrength = 0.2 // how much bubbles bounce off each other
    const bubbleSizeMin = 5
    const bubbleSizeMax = 50
    getTooltipData = parameters['getTooltipData']

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Create a tooltip
    chart.tooltipCreate()

    // Set scales for colour and size of bubbles
    let colourScale = chart.colourScaleOrdinal(colourCol, colours) 
    let rScale = chart.scaleCircleRadius(bubbleSizeCol, bubbleSizeMin, bubbleSizeMax)

    // This will be the object representing the circles in the chart
    let nodesSelection = undefined

    // Add circles to the chart, one for each item in data
    // We won't set the position cx, cy.  The force layout will do this for us
    nodesSelection = chart.bind("circle", data) 
    nodes = 
        nodesSelection
        .enter()
        .append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return rScale(d[bubbleSizeCol])})
            .style("fill", function(d){ return colourScale(d[colourCol])})
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            // Add the event handlers for the tooltip
            .on('mouseover',  function (d) { chart.tooltipShow(this, ttStyleShow) })
            .on('mousemove',  function (d) { chart.tooltipMove(this, getTooltipData(d)) })
            .on('mouseout',   function (d) { chart.tooltipHide(this, ttStyleHide)  })              
            // Add the event handlers for dragging - https://github.com/d3/d3-drag
            .call(d3.drag() 
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

    // Define the forces to be applied to the nodes 
    let force = chart.forceSimulation(nodes)
    chart.addForceCentre()
    chart.addForceCharge(chargeStrength)
    chart.addForceCollide(collisionStrength, function(d){ return (rScale(d[bubbleSizeCol])) })

    function ttStyleShow(el) {
        d3.select(el)
        .style("stroke-width", 2)
    }

    function ttStyleHide(el) {

        d3.select(el)
        .style("stroke-width", 1)
    }

    // Define handlers for drag events
    function dragstarted(d) {
        // Started dragging, so restart the force simulation and update the circle's position
        if (!d3.event.active) force.alphaTarget(.03).restart()
        d.fx = d.x
        d.fy = d.y
    }
    function dragged(d) {
        // In the middle of dragging, so update the circle's position
        d.fx = d3.event.x
        d.fy = d3.event.y
    }
    function dragended(d) {
        // Dragging stopped
        if (!d3.event.active) force.alphaTarget(.03)
        d.fx = null
        d.fy = null
    }           
  
    // Define handlers for the buttons
    d3.select("#centreButton")
        .on("click", function() {    
            chart.removeAxes()

            let force = chart.forceSimulation(nodes)
            chart.addForceCentre()
            chart.addForceCharge(chargeStrength)
            chart.addForceCollide(collisionStrength, function(d){ return (rScale(d[bubbleSizeCol])) })

            force.alpha(1).restart()  // Reset alpha to 1 to start the simulation.  Will decay towards 0
        })

    d3.select("#xLinearButton")   
        .on("click", function() {
            let xScale = chart.xScaleLinear(xCol)
            chart.removeAxes()
            chart.drawAxisXBottom(xScale, xCol)

            let force = chart.forceSimulation(nodes)
            chart.addForceX(function(d) {return xScale(d[xCol])})
            chart.addForceY(chart.drawingCentreY)            
            chart.addForceCharge(chargeStrength)
            chart.addForceCollide(collisionStrength, function(d){ return (rScale(d[bubbleSizeCol])) })

            force.alpha(1).restart()
        })

    d3.select("#yLinearButton")   
        .on("click", function() {     
            let yScale = chart.yScaleLinear(yCol)       
            chart.removeAxes()
            chart.drawAxisYLeft(yScale, yCol)  

            let force = chart.forceSimulation(nodes)
            chart.addForceY(function(d) {return yScale(d[yCol])})
            chart.addForceX(chart.drawingCentreX)            
            chart.addForceCharge(chargeStrength)
            chart.addForceCollide(collisionStrength, function(d){ return (rScale(d[bubbleSizeCol])) })
            
            force.alpha(1).restart()
        })       

    d3.select("#xGroupButton")   
        .on("click", function() {
            let xScale = chart.xScaleBand(xGroupCol)
            let xOffset = xScale.bandwidth()/2
            chart.removeAxes()
            chart.drawAxisXBottom(xScale, xGroupCol)
            
            let force = chart.forceSimulation(nodes)
            chart.addForceX(function(d) {return xScale(d[xGroupCol])+xOffset})
            chart.addForceY(chart.drawingCentreX)            
            chart.addForceCharge(chargeStrength)
            chart.addForceCollide(collisionStrength, function(d){ return (rScale(d[bubbleSizeCol])) })

            force.alpha(1).restart()
        })

    d3.select("#yGroupButton")   
        .on("click", function() {    
            let yScale = chart.yScaleBand(yGroupCol)   
            let yOffset = yScale.bandwidth()/2
            chart.removeAxes()
            chart.drawAxisYLeft(yScale, yGroupCol)  

            let force = chart.forceSimulation(nodes)
            chart.addForceX(chart.drawingCentreY)         
            chart.addForceY(function(d) {return yScale(d[yGroupCol])+yOffset})
            chart.addForceCharge(chargeStrength)
            chart.addForceCollide(collisionStrength, function(d){ return (rScale(d[bubbleSizeCol])) })   

            force.alpha(1).restart()
        })     
}
