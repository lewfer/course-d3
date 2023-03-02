/*
 * pie.js
 * 
 * D3 code to draw a simple pie chart
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}
    const innerRadiusPercent = 0
    const drawingRadius = Math.min(PLOT.WIDTH, PLOT.HEIGHT) / 2
    PLOT.CENTREX = PLOT.LEFT + PLOT.WIDTH/2
    PLOT.CENTREY = PLOT.TOP + PLOT.HEIGHT/2

    // Load the data
    const data = await d3.csv(dataFile);
    console.log(data)

    // Create an ordinal scale to map players to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range(d3.schemeCategory10) 

    let pie = d3.pie()
        .value(d => d.score)
    let pieData = pie(data);  
    console.log(pieData)

    let innerRadius = innerRadiusPercent * drawingRadius
    let arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(drawingRadius) 

        // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Add the pie group element, shifted to the centre of the pie
    let g = svg.append('g')
        .attr('transform', "translate(" + PLOT.CENTREX + "," + PLOT.CENTREY + ")")

    // Get an object representing all the segments in the chart
    let selection = g    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(pieData)  

    // Add the segments to the chart
    selection
        .enter()
        .append("path")
            .attr("fill", d=>colourScale(d.data.player))
            .attr("d", arcGenerator)
}
