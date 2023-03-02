/*
 * bar.js
 * 
 * D3 bar chart using the D3 Simple library
 * 
 * https://bl.ocks.org/denjn5/e1cdbbe586ac31747b4a304f8f86efa5
 * https://observablehq.com/@d3/sunburst
 */
function drawPartitionChart(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const nameCol = parameters['nameCol'] || data.columns[0]
    const parentCol = parameters['parentCol'] || data.columns[1]
    const valueCol = parameters['valueCol'] || data.columns[2]
    const colours = parameters['colours'] || d3.schemeCategory10

    // Create our D3 Simple object and set 0,0 to the centre of the drawing area
    let chart = new D3SI(container, data, parameters)

    // Build a hierarchy from the data
    let root = chart.buildHierarchy(nameCol, parentCol, valueCol) 

    // Add partition information to the data.  Each node gets attributes x0, y0, x1, y1, representing left, top, right, bottom of rectangle
    let partitionData = chart.addPartitionLayout(root, chart.drawingWidth, chart.drawingHeight, 1)

    // Create a colour scale based on the top level nodes
    let topLevelIds = chart.hierarchyTopLevelIds(root)
    let colourScale = chart.consistentColourScale(topLevelIds, colours)

    // Flatten the hierarchy into a ordered list of all nodes, removing the first node, which is the root
    let flattenedNodes = partitionData.descendants()

    // Get an object representing all the arcs in the chart
    let rectSelection = chart.bind("rect", flattenedNodes)  

    rectSelection
        // Handle 'entered' items, i.e. new rects
        .enter()
        .append("rect")
            .attr('x',      function(d) { return chart.paddingLeft+chart.headerLeft+d.x0; })
            .attr('y',      function(d) { return chart.paddingTop+chart.headerTop+d.y0; })
            .attr('width',  function(d) { return d.x1 - d.x0; })
            .attr('height', function(d) { return d.y1 - d.y0; })
            .attr("fill",   function (d) { while (d.depth > 1) d = d.parent; return colourScale(d.id) }) // colour according to top level parent

    // Centre text in the segment
    let g = chart.svg.append("g")
        .attr("text-anchor", "middle")

    // The arc label generator will turn x0, y0, x1, y1 into the transformation coordinates to make the arc labels
    let labelGenerator = chart.getPartitionLabelGenerator()

    // Get an object representing all the text labels in the chart
    let labelSelection = chart.bindSelection(g, "text", flattenedNodes)  
    
    // Add the labels to the chart
    labelSelection
        // Handle 'entered' items, i.e. new rects
        .enter()
        .append("text")
            .attr("display",    function (d) {if (d.x1-d.x0<20) return "none"; else return ""} )
            .attr("class",      "label")
            .attr("transform",  labelGenerator)
            .attr("dy",         "0.35em")
            .text(function(d) {return d.data.name})        
}
