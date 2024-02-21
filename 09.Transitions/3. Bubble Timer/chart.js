/*
 * animatedBubbleChart.js
 * D3 code to draw a bubble chart
 */


async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    const data = await d3.csv(dataFile);

    // Convert any numbers to strings
    convertNumbers(data)

    // Get data range across all data so we can set fixed axes that won't change over the animation
    let minX = d3.min(data, d=>d["GDP per capita"])
    let maxX = d3.max(data, d=>d["GDP per capita"])
    let minY = d3.min(data, d=>d["Life expectancy at birth"])
    let maxY = d3.max(data, d=>d["Life expectancy at birth"])
    let minR = d3.min(data, d=>d["Population"])
    let maxR = d3.max(data, d=>d["Population"])

    // Get the range of years we need to animate over
    let year = d3.min(data, d=>d["Year"])
    let maxYear = d3.max(data, d=>d["Year"])

    // Create a square root scale for life expectancy to x axis
    // The square root scale means that smaller values get more space on the axis
    let xScale = d3.scaleSqrt()
        .domain([0, maxX])  
        .range([PLOT.LEFT, PLOT.RIGHT])     
        
    // Create a linear scale for life expectancy to y axis
    let yScale = d3.scaleLinear()
        .domain([0, maxY])  
        .range([PLOT.BOTTOM, PLOT.TOP])     

    // Create a linear scale for polulation to circule radius
    let rScale = d3.scaleLinear()
        .domain([0, maxR])  
        .range([2,50])     

    // Create an ordinal scale to map region to colours
    let colourScale = d3.scaleOrdinal()
        .domain(data.map(d=>d.Region))     
        .range(d3.schemeCategory10)   

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Filter the data for the first year
    let filteredData = data.filter(d=>d["Year"] == year)        

    // Draw the curcles for the first year
    update()

    // Set a timer event to trigger every 500ms to draw the next years
    let timer = setInterval(animate, 500) 

    // Add x axis
    svg.append("g")  
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")") 
        .call(d3.axisBottom(xScale)) 

    // Add y axis
    svg.append("g") 
        .attr("transform", "translate(" + PLOT.TOP + ",0)") 
        .call(d3.axisLeft(yScale)) 
            
    // Update function called when the data changes
    function update() {
        // Get a selection object 
        let selection = svg    
            .selectAll("circle") 
            .data(filteredData)           

        // Add the circles svg elements to the chart
        selection
            .enter()           
            .append("circle")       
            .merge(selection)
            .transition()
            .duration(500)
                .attr("cx",       d=>xScale(d["GDP per capita"]))  
                .attr("cy",       d=>yScale(d["Life expectancy at birth"]))             
                .attr("r",        d=>rScale(d["Population"]))         
                .style("fill",    d=>colourScale(d.Region))    
                .style("opacity", 0.7)                        
    }

    // Animate function called when the timer triggers
    function animate() {
        // Move to the next frame
        year++

        if (year>maxYear)
            // We've reached the end so stop the animation
            clearInterval(timer)
        else {
            // Filter the data for the next year
            filteredData = data.filter(d=>d["Year"] == year)

            // Update the display with that data
            update()
        }
    }     

}


// Function to convert anything that looks like a number to a number
function convertNumbers(data) {
    data.forEach(function(d) {
        for (let key in d) {
          if (+d[key]===+d[key]) {
            d[key] = +d[key]
          }
        }
      });
}
        