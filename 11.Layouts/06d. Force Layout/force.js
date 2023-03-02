/*
 * force.js
 * 
 * Illustration of a force layout
 */

function drawForce(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol']
    const yCol = parameters['yCol']
    const xGroupCol = parameters['xGroupCol']
    const yGroupCol = parameters['yGroupCol']
    const bubbleSizeCol = parameters['bubbleSizeCol']
    const colourCol = parameters['colourCol']
    const colours = parameters['colours'] || d3.schemeCategory10
    const chargeStrength = parameters['chargeStrength'] || 0.1 // how much bubble attract
    const collisionStrength = parameters['collisionStrength'] || 0.2 // how much bubbles bounce off each other
    const bubbleSizeMin = parameters['bubbleSizeMin'] || 5
    const bubbleSizeMax = parameters['bubbleSizeMax'] || 50

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Set scales for colour and size of bubbles
    let colourScale = chart.colourScaleOrdinal(colourCol, colours) 
    let rScale = chart.scaleCircleRadius(bubbleSizeCol, bubbleSizeMin, bubbleSizeMax)

    // Add circles to the chart, one for each item in data
    // We won't set the position cx, cy.  The force layout will do this for us
    let nodesSelection = chart.bind("circle", data) 
    nodes = nodesSelection
        .enter()
        .append("circle")
            .attr("class",          "node")
            .attr("r",              function(d) { return rScale(d[bubbleSizeCol]) })
            .style("fill",          function(d) { return colourScale(d[colourCol]) })
            .style("fill-opacity",  0.8)
            .attr("stroke",         "black")
            .style("stroke-width",  1)  

    // Define the forces to be applied to the nodes 
    let force = chart.forceSimulation(nodes)
    chart.addForceCentre()
    chart.addForceCharge(chargeStrength)
    chart.addForceCollide(collisionStrength, function(d) { return (rScale(d[bubbleSizeCol])) })
}
