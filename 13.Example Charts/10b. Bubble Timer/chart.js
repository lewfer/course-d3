/*
 * animatedBubbleChart.js
 * D3 code to draw a bubble chart
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 800
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

    // Get a consistent list of unique region names
    let regionNames = [...new Set(data.map(d => d["Region"]))]; // unique regions


    // Create an ordinal scale to map region to colours
    let colourScale = d3.scaleOrdinal()
        .domain(regionNames)     
        .range(d3.schemeCategory10)   

        
    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Chart title
    svg.append("text")
        .attr("x", WIDTH/2)
        .attr("y", MARGIN.TOP/2)
        .attr("text-anchor", "middle")
        .attr("class", "title")   
        .style("font-size", "16px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("GDP Per Capita vs Life Exp 2010");

    // X axis title
    svg.append("text")
        .attr("x", WIDTH/2)
        .attr("y", PLOT.BOTTOM+MARGIN.BOTTOM-10)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("GDP per capita");

    // Y axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(HEIGHT/2))
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .text("Life expectancy at birth")

    // create a tooltip
    var tooltip = d3.select(container)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")     

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event, d) {
        console.log("mo")
        tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(event, d) {
        tooltip
        .html(d["CountryName"])
        .style("left", (event.pageX+50) + "px")
        .style("top", (event.pageY) + "px")
    }
    var mouseleave = function(event, d) {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    // Filter the data for the first year
    let filteredData = data.filter(d=>d["Year"] == year)        

    // Draw the curcles for the first year
    update()

    // Set a timer event to trigger every 500ms to draw the next years
    let timer = setInterval(animate, 500) 

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))                                // create the axis
            

    // Legend
    let legendX =550
    let legendY = 350
    svg.selectAll("dots")
    .data(regionNames)
    .enter()
    .append("circle")
        .attr("cx", legendX)
        .attr("cy", (d,i)=>legendY + i*25) 
        .attr("r", 7)
        .style("fill", d=>colourScale(d))       
    svg.selectAll("labels")
        .data(regionNames)
        .enter()
        .append("text")
        .attr("x", legendX+15)
        .attr("y", (d,i)=>legendY + i*25) 
        .style("fill", d=>colourScale(d))
        .text(d=>d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle") 

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
            // Add the event handlers for the tooltip
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)     
            .transition()
            .duration(500)
                .attr("cx",       d=>xScale(d["GDP per capita"]))  
                .attr("cy",       d=>yScale(d["Life expectancy at birth"]))             
                .attr("r",        d=>rScale(d["Population"]))         
                .style("fill",    d=>colourScale(d.Region))    
                .style("opacity", 0.7)         

        svg.select("text.title").text("GDP Per Capita vs Life Exp " + year)  
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
        