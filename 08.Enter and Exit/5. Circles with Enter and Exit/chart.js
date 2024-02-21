/*
 * chart.js
 * 
 * D3 chart illustrating enter/exit
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 200
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

     // Load the data
     const data = await d3.csv(dataFile);
     console.log(data)

    // Convert all the values to integers (by default they could be strings)
    data.forEach(d=>{
        d.value=parseInt(d.value),
        d.pos=parseInt(d.pos)
    });

    // Take just the first 5 data items
    let dataCount = 5
    let currentData = data.slice(0,dataCount)

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Create our y scale to map data values to screen coordinates 
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.pos)])        // domain is 0 to the maximum value in the column
        .range([PLOT.LEFT, PLOT.RIGHT])         // range is the drawing height (top and bottom reversed to make origin at the bottom)

    let circlesG = svg.append("g")

    // Function to update the display
    function update() {    
        console.log(currentData)    
        // Get a selection object representing all the circles we want in the chart, one for each item in the data
        let selection = circlesG    
            .selectAll("g")                        // select all the existing chart items (if none exist it returns an empty selection)
            .data(currentData, d=>d.product)                                 // bind the data to the chart items
        console.log(selection)
        
        // Exit circles that are not in the data any more
        exited = selection
            .exit()

        exited 
            .selectAll("circle")
            .style("fill", "red")
            .transition().duration(1000)

        exited
        .transition().duration(1000)
            .remove()    

        // Update circles that were already there
        selection.selectAll("circle").style("fill", "green")

        // Enter circles for new data
        entered = selection
            .enter()
                .append("g")

        entered
            .append("circle")
                .style("fill",      "blue")
            .merge(selection)
                .attr("cx",         d=>xScale(d.pos))
                .attr("cy",         PLOT.TOP+PLOT.HEIGHT/2)
                .attr("r",          d=>d.value)
                .style("opacity",   0.7)             
        entered
            .append("text")   
                .attr("x",          d=>xScale(d.pos))
                .attr("y",          PLOT.TOP+PLOT.HEIGHT/2)
                .text(d=>d.product)
            
    }

    update()

    // Add x axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                                // create the axis

    // On click, update with new data			
	d3.select("#addButton")
        .on("click", function() {
            // Add another value to the dataset
            dataCount++
            currentData = data.slice(0,dataCount)

            // Update the display
            update()
        })

    // On click, update with removed data			
	d3.select("#removeButton")   
        .on("click", function() {
            // Remove the last value from the dataset
            dataCount--
            currentData = data.slice(0,dataCount)

            // Update the display
            update()
    })

    // On click, update with removed data			
	d3.select("#removeGButton")   
        .on("click", function() {
            // Remove the last value from the dataset
            currentData = data.slice(0,dataCount).filter(item=>item.product!='g')
            dataCount = currentData.length+1
            console.log(currentData)

            // Update the display
            update()
    })    
}
