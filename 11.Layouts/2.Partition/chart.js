/*
 * chart.js
 * 
 * D3 partition chart
 * 
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
        .attr("text-anchor", "middle")

    // Create a d3 hierarchy, summing up the values at the higher levels in the hierarchy
    var root = d3.hierarchy(data)
        .sum(d=>d.value);
    console.log(root)
    
    // Create a partition function that will work out the coordinates of the partition segments:
    // x0, x1, y0 and y1 
    // https://devdocs.io/d3~7/d3-hierarchy#_partition
    var partition = d3.partition()
        .size([PLOT.WIDTH, PLOT.HEIGHT])
        .padding(1)
    partition(root);
    console.log(root)

    // Create the rects
    g.selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .attr('x',      d=>PLOT.LEFT+d.x0)
        .attr('y',      d=>PLOT.TOP+d.y0)
        .attr('width',  d=>d.x1 - d.x0)
        .attr('height', d=>d.y1 - d.y0)        .style("fill",      d=>colourScale((d.children ? d : d.parent).data.name)); // parent nodes are coloured, child nodes take colour of children
      
    // The abel generator will turn x0, y0, x1, y1 into the transformation coordinates to make the labels
    let labelGenerator = function(d) {
        const y = - (PLOT.LEFT + d.x0 + (d.x1-d.x0) / 2)      // calculate the y position
        const x = PLOT.TOP + d.y0 + (d.y1-d.y0) / 2           // calculate the x position
        return `rotate(90) translate(${x},${y})`            // rotate by 90 degrees and move into position
    }  
    
    // Add the labels to the chart using the label generator to position them
    g.selectAll('text')
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("display",    d=>(d.x1-d.x0<20) ? "none" : "") // hide labels for really small segments
        .attr("class",      "label")
        .attr("transform",  labelGenerator)                  // move the label into position
        .attr("dy",         "0.35em")
        .text(d=>d.data.name)         
}
