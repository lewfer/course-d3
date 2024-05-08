/*
 * force.js
 * 
 * Illustration of a force layout
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}
    PLOT.CENTREX = PLOT.LEFT + PLOT.WIDTH/2
    PLOT.CENTREY = PLOT.TOP + PLOT.HEIGHT/2

    // Load the data
    const data = await d3.csv(dataFile);

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Create an ordinal scale for colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.level))              // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale

    // Create a linear scale to map score to a circle radius 
    let rScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.score)])      // domain is 0 to the maximum value in the column
        .range([5, 40])                             // range is the range of radii we want 

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items


    // Add circles to the chart, one for each item in data
    // We won't set the position cx, cy.  The force layout will do this for us
    nodes = selection
        .enter()
        .append("circle")
            .attr("class",          "node")
            .attr("r",              d=>rScale(d.score))
            .style("fill",          d=>colourScale(d.level))
            .style("fill-opacity",  0.8)
            .attr("stroke",         "black")
            .style("stroke-width",  1)      


    // Define the forces to be applied to the nodes 
    // https://devdocs.io/d3~7/d3-force#forcesimulation
    let force = d3.forceSimulation()        
        .nodes(data)
        .on("tick", d=>nodes
            .attr("cx", d=>d.x)
            .attr("cy", d=>d.y)
        )

        // Add a position for the force to focus on
        .force("x", d3.forceX(PLOT.CENTREX)) 
        .force("y", d3.forceY(PLOT.CENTREY))

        // Define the characteristics of the force
        .force("charge", d3.forceManyBody().strength(0.1)) 
        .force("collide", d3.forceCollide().strength(0.2).radius(d=>rScale(d.score)))

    // Set up the drag/drop
    nodes
        .call(d3.drag() 
            .on("start", function (event, d) {
                // Started dragging, so restart the force simulation and update the circle's position
                if (!event.active) force.alphaTarget(.03).restart()
                d.fx = d.x
                d.fy = d.y
                })
            .on("drag", function (event, d) {
                // In the middle of dragging, so update the circle's position
                d.fx = event.x
                d.fy = event.y
                })
            .on("end", function (event, d) {
                // Dragging stopped
                if (!event.active) force.alphaTarget(.03)
                d.fx = null
                d.fy = null
                }))      
}
