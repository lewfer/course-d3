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
    
    // Create an ordinal scale to map top level items to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.player))   
        .range(d3.schemeCategory10)      

    // Set scales for size of bubbles
    let rScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d=>d.score)])
            .range([5,50]);

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")            
    
    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")  
        .data(data)           

    // Add circles to the chart, one for each item in data
    // We won't set the position cx, cy.  The force layout will do this for us
    nodes = selection
        .enter()
        .append("circle")
            .attr("class",          "node")
            .attr("r",              d=>rScale(d.score))
            .style("fill",          d=>colourScale(d.player))
            .style("fill-opacity",  0.8)
            .attr("stroke",         "black")
            .style("stroke-width",  1)  

    // Create a simulation based on the data
    // https://devdocs.io/d3~7/d3-force#forcesimulation
    d3.forceSimulation()        
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
}
