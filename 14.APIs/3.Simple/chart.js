/*
 * chart.js
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 800
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    const data = await d3.json("https://data.nasa.gov/resource/y77d-th95.json");

    // Convert any numeric columns to numbers
    convertNumbers(data)

    console.log(data)

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

   // Create a banded scale to map player name to an x screen coordinate 
   let xScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.reclong), d3.max(data, d=>d.reclong)])   // domain is the range of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])                                     // range is the range of on-screen coordinates

    // Create a linear scale to map player age to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.reclat), d3.max(data, d=>d.reclat)])     // domain is the range of values in the column
        .range([PLOT.BOTTOM, PLOT.TOP])                                     // range is the range of on-screen coordinates

    // Create a linear scale to map score to a circle radius 
    let rScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.mass), d3.max(data, d=>d.mass)])         // domain is the range of values in the column
        .range([2, 100])                                                     // range is the range of radii we want 

    // Get a selection object 
    let selection = svg    
        .selectAll("circle") 
        .data(data) 

    // Add the circles svg elements to the chart, one for each item in the selection
    selection
        .enter()  
        .append("circle")
            .attr("cx",       d=>xScale(d.reclong))
            .attr("cy",       d=>yScale(d.reclat))
            .attr("r",        d=>rScale(d.mass)) 
            .style("fill",    "red") 
            .style("opacity", 0.7) 
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