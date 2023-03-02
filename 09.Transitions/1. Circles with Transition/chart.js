/*
 * chart.js
 * 
 * D3 circles with transition
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 250
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

     // Load the data
     const data = await d3.csv(dataFile);
     console.log(data)

    // Convert all the values to integers (by default they could be strings)
    data.forEach(d=>{
        d["2020"]=parseInt(d["2020"]),
        d["2021"]=parseInt(d["2021"])
    });

    // Create our banded x scale to map data values to screen coordinates 
    let xScale = d3.scaleBand()
        .domain(data.map(d=>d.product))             // domain is the list of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the on-screen coordinates

    let xOffset = xScale.bandwidth()/2

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")
        
    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items

    // Get a selection object
    selection
        .enter()
        .append("circle")
            .attr("cx",         d=>xOffset+xScale(d.product))
            .attr("cy",         PLOT.TOP+PLOT.HEIGHT/2)
            .attr("r",          d=>d.yesterday)
            .style("fill",      "#1f77b4")
            .style("opacity",   0.7)        
        
    // Add x axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")      // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                                // create the axis

    // On click, update with new data			
	d3.select("button")
        .on("click", function() {
            console.log("button")
            // Get a selection object representing all the circles we want in the chart, one for each item in the data
            let selection = svg    
                .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
                .data(data)                                 // bind the data to the chart items
        
            // Change the radius according to the new value
            selection
                .transition()
                .duration(3000)
                //.delay((d,i)=>i*500)
                //.ease(d3.easeBounce)
                //.ease(d3.easeElastic)
                //.ease(d3.easeQuad)
                //.ease(d3.easeCubic)
                //.ease(d3.easeExp)
                .attr("r",    d=>d.today)
                .attr("cy",   PLOT.BOTTOM)
                
            .style("fill",      "red")
        })
}
