/*
 * chart.js
 * D3 code to draw a heatmap
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}



    // Load the data
    const data = await d3.csv(dataFile);


   // chart.tooltipCreate()

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

   // Create a banded scale to map player name to an x screen coordinate 
   let xScale = d3.scaleBand()
        .domain(data.map(d=>d.player))              // domain is the list of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the on-screen coordinates

   // Create a banded scale to map year to a y screen coordinate 
   let yScale = d3.scaleBand()
        .domain(data.map(d=>d.year))                // domain is the list of values in the column
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the on-screen coordinates


    // Create a linear scale to map value to a colour
    let colourScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.score)])        // domain is 0 to the maximum value in the column
        .range(['#ffffff','#d95f0e'])



    // Compute an offset so our data and xaxis align
    let xOffset = xScale.bandwidth()/2

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let selection = svg    
        .selectAll("rect")                          // select all the existing chart items (if none exist it returns an empty selection)
        .data(data)                                 // bind the data to the chart items


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
        tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(event, d) {
        tooltip
        .html(d.player + "<br/>Score: " + d.score + "<br/>Year: " + d.year)
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

    // Add the rects
    selection
        .enter()
        .append("rect")
            .attr("x",        d=>xScale(d.player))
            .attr("y",        d=>yScale(d.year))
            .attr("width",    xScale.bandwidth())
            .attr("height",   yScale.bandwidth())
            .style("fill",    d=>colourScale(d.score))
            .style("opacity", 0.7)
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
            
     
}


        