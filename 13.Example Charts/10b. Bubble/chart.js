/*
 * chart.js
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

    // Convert columns from string to number where required
    convertNumbers(data)

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")    

    // Create a linear scale to map GDP to x screen coordinate
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d["GDP per capita"])])        // domain is 0 to the maximum value in the column
        .range([PLOT.LEFT, PLOT.RIGHT])                           // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Create a linear scale to map life exp to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d["Life expectancy at birth"])])     // domain is 0 to the maximum value in the column
        .range([PLOT.BOTTOM, PLOT.TOP])                                  // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Create a square root scale to map the square root of population to circle area
    // (because area is proportional to r squared)
    let rScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d=>d["Population"])])
        .range([2, 20]);        

    // Get a consistent list of unique region names
    let regionNames = [...new Set(data.map(d => d["Region"]))]; // unique regions

    // Create an ordinal scale to map regions to colours
    let colourScale = d3.scaleOrdinal()
        .domain(regionNames)              // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale
        
    // Chart title
    svg.append("text")
        .attr("x", WIDTH/2)
        .attr("y", MARGIN.TOP/2)
        .attr("text-anchor", "middle")
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
        .text("Life expectancy at birth");

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

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("circle")                        // select all the existing chart items (if none exist it returns an empty selection)
        .data(data) 

    // Add the circles to the chart
    selection
        .enter()
        .append("circle")
            .attr("cx",         d=>xScale(d["GDP per capita"]))
            .attr("cy",         d=>yScale(d["Life expectancy at birth"]))
            .attr("r",          d=>rScale(d["Population"]))
            .style("fill",      d=>colourScale(d["Region"]))
            .style("opacity",   0.7)
            // Add the event handlers for the tooltip
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

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
                