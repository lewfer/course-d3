/*
 * chart.js
 * 
 * D3 exit() explained
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 200
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    let data = await d3.csv(dataFile);

    // Convert all the values to integers (by default they could be strings)
    data.forEach(d=>{
        d.value=parseInt(d.value),
        d.pos=parseInt(d.pos)
    });

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Create a linear x scale
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.pos)])
        .range([PLOT.LEFT, PLOT.RIGHT]) 

    // Group the text together
    let g = svg.append("g")

    // Get a selection object representing all the text we want in the chart, one for each item in the data
    let selection = g    
        .selectAll("text")  
        .data(data)  
    //console.log(selection)
    
    // Enter text elements for new data
    let enterSelection = selection
        .enter()
    //console.log(enterSelection)

    enterSelection
        .append("text")
            .style("fill",      "orange")
            .attr("x",          d=>xScale(d.pos))
            .attr("y",          PLOT.TOP+PLOT.HEIGHT/2)
            .text(d=>d.product)
            
    // Add x axis
    let xAxis = d3.axisBottom(xScale)
    svg.append("g")  
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")") 
        .call(xAxis)  

    // On click, update with removed data			
	d3.select("#removeButton")   
        // Take a slice with just the first 3 array items
        .on("click", function() {
            data = data.slice(0,3)

        // Get a selection object representing all the text we want in the chart, one for each item in the data
        let selection = g    
            .selectAll("text")                      // select all the existing chart items (if none exist it returns an empty selection)
            .data(data)                             // bind the data to the chart items
        //console.log(selection)

        // Exit text elements that no longer have data
        selection
            .exit()
            .style("fill", "red")             // show exiting text in red
            .transition().duration(1000)      // delay exit for 1 second
            .remove()   
    })        
}
