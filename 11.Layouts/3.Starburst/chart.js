/*
 * bar.js
 * 
 * D3 starburst chart
 * 
 */
async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}
    PLOT.RADIUS = Math.min(PLOT.WIDTH, PLOT.HEIGHT) / 2
    PLOT.CENTREX = PLOT.LEFT + PLOT.WIDTH/2
    PLOT.CENTREY = PLOT.TOP + PLOT.HEIGHT/2

    // Load the data
    const data = await d3.json(dataFile);
    console.log(data)

    // Create an ordinal scale to map top level items to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.children.map(d=>d.name))   
        .range(d3.schemeCategory10)  
        
        
    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Add a g centred in the middle of the plot area
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + PLOT.CENTREX + ',' + PLOT.CENTREY + ')')
        .attr("text-anchor", "middle")

    // Create a d3 hierarchy, summing up the values at the higher levels in the hierarchy
    var root = d3.hierarchy(data)
        .sum(d=>d.value);
    console.log(root)
    
    // Create a partition function that will work out the coordinates of the starburst segments:
    // x0, x1, y0 and y1 
    // https://devdocs.io/d3~7/d3-hierarchy#_partition
    var partition = d3.partition()
        .size([2 * Math.PI, PLOT.RADIUS]);
    partition(root);
    console.log(root)

    // Create an arc generator
    // https://devdocs.io/d3~7/d3-shape#arc
    var arc = d3.arc()
        .startAngle(d=>d.x0)
        .endAngle(d=>d.x1)
        .innerRadius(d=>d.y0)
        .outerRadius(d=>d.y1);

    // Create the paths
    g.selectAll('path')
        .data(root.descendants())
        .enter()
        .append('path')
        .attr("display",    d=>d.depth ? null : "none") // root will have depth 0 and will be hidden
        .attr("d",          arc)
        .style('stroke',    '#fff')
        .style("fill",      d=>colourScale((d.children ? d : d.parent).data.name)); // parent nodes are coloured, child nodes take colour of children
        
    // The arc label generator will turn x0, y0, x1, y1 into the transformation coordinates to make the arc labels
    let labelGenerator = function(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI          // calculate the y position
        const y = (d.y0 + d.y1) / 2                          // calculate the x position
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`       // rotate by the required amount and move into position
    }        

    // Add the labels to the chart using the label generator to position them
    g.selectAll('text')
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("display",    d=>(d.x1-d.x0<0.07) ? "none" : "") // hide labels for really small segments
        .attr("class",      "label")
        .attr("transform",  labelGenerator)                    // move the label into position
        .attr("dy",         "0.35em")
        .text(d=>d.data.name)        
}
