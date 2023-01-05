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

    // Create our y scale to map data values to screen coordinates 
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.pos)])        // domain is 0 to the maximum value in the column
        .range([PLOT.LEFT, PLOT.RIGHT])         // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Group the text together
    let tg = svg.append("g")

    // Add x axis
    let xAxis = d3.axisBottom(xScale)
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(xAxis)                                // create the axis


    // Function to update the display
    function update() {    
        // Get a selection object representing all the text we want in the chart, one for each item in the data
        let selection = tg    
            .selectAll("text")                        // select all the existing chart items (if none exist it returns an empty selection)
            .data(currentData, d=>d.product)          // bind the data to the chart items
        
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
            //.merge(selection)                 // merge the update and enter selections
                .attr("x",          d=>xScale(d.pos))
                .attr("y",          PLOT.TOP+PLOT.HEIGHT/2)
                .text(d=>d.product)
            
    }

    // Create the chart the first time
    update()

    // Set a timer event to trigger every 2 seconds
    var timer = setInterval(animate, 2000) 


    function animate() {
        // Add another value to the dataset
        dataCount++
        currentData = data.slice(0,dataCount)

        // Update the display
        update()
    }    

}
