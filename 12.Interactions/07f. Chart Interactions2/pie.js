/*
 * pie.js
 * 
 * D3 code to draw a simple pie chart
 */

function drawPie(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const indexCol = parameters['indexCol'] || "index"
    const valueCol = parameters['valueCol'] || "value"
    const innerRadiusPercent = parameters["innerRadiusPercent"] || 0  // percentage of the pie cutout for donut, in range 0 to 1
    const colours = parameters['colours'] || d3.schemeCategory10
    const dispatch = parameters['dispatch'] 

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Create our scales to map data to screen position and colours
    let colourScale = chart.colourScaleOrdinal(indexCol, colours)      // scale to colour each index

    // Generate the required pie angles to be fed to the arc generator
    let pieData = chart.addPieLayout(valueCol)    

    // Arc generator generates the paths 
    let arcGenerator = chart.getPieArcGenerator(innerRadiusPercent)

    // Add the pie group element, shifted to the centre of the pie
    chart.moveOriginToCentre()

    // Get an object representing all the segments in the chart
    let segmentSelection = chart.bind("circle", pieData)

    // Add the segments to the chart
    chart.append(segmentSelection, "path")
        .attr("fill", function(d) { return colourScale(d.data[indexCol]) })
        .attr("d", arcGenerator)
        .on("click", click)
    
    function click(d) {
        console.log(d)
        if (dispatch !== undefined)
            dispatch.call("redraw", this, d.data[indexCol])
    }

}
