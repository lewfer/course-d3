/*
 * chart.js
 * 
 * D3 circles with transition
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

     // Load the data
     const data = await d3.csv(dataFile);

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

    // Create a placeholder for the x scale and x axis.  We will create them in the update() function
    let xScale 
    let xAxis
    
    // Add a group for the text to be placed
    let tg = svg.append("g")

    // Add a group for the x axis to be placed
    let xg = svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area

    // Function to update the display
    function update() {    
        // Get a selection object representing all the text we want in the chart, one for each item in the data
        let selection = tg    
            .selectAll("text")                        // select all the existing chart items (if none exist it returns an empty selection)
            .data(currentData, d=>d.product)          // bind the data to the chart items
        
        // Create the scale based on the current data
        xScale = d3.scaleLinear()
            .domain([0, d3.max(currentData, d=>d.pos)])        // domain is 0 to the maximum value in the column
            .range([PLOT.LEFT, PLOT.RIGHT])         // range is the drawing height (top and bottom reversed to make origin at the bottom)
        
        // Exit text elements that no longer have data
        selection
            .exit()
            //.style("fill", "red")             // show exiting text in red
            //.transition().duration(1000)      // delay exit for 1 second
            .remove()    

        // Update text elements that were already there
        selection.style("fill", "green")

        // Enter text elements for new data
        selection
            .enter()
            .append("text")
                .style("fill",      "orange")
            .merge(selection)                 // merge the update and enter selections
            .transition()
            .duration(500)
                .attr("x",          d=>xScale(d.pos))
                .attr("y",          PLOT.TOP+PLOT.HEIGHT/2)
                .text(d=>d.product)

        // Redraw the axis
        xAxis = d3.axisBottom(xScale)
        xg
            .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
            .transition()
            .duration(1000)
            .call(xAxis)                  
    }

    // Create the chart the first time
    update()

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
            // Remove the "g" value from the dataset
            currentData = data.slice(0,dataCount).filter(item=>item.product!='g')
            dataCount = currentData.length+1
            console.log(currentData)

            // Update the display
            update()
    })    
}
