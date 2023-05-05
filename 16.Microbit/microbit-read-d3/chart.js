/*
 * Example showing reading from a microbit accelerometer
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    let data = []
    let index = 0

    // Start reading data from the microbit serial port, calling the gotMicrobitData function when each line is received
    readMicrobit(gotMicrobitData);

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

   // Create a linear scale mapping the left-right tilt to the x screen coordinate 
   let xScale = d3.scaleLinear()
        .domain([-2048,2048])                       // domain is the range of values from the microbit accelerometer x axis
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is drawing width 

    // Create a linear scale to mapping front-back tilt to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([-2048,2048])                       // domain is the range of values from the microbit accelerometer y axis
        .range([PLOT.BOTTOM, PLOT.TOP])             // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // D3 update function
    function update() {
        // Get a selection object representing all the circles we want in the chart, one for each item in the data
        let selection = svg    
            .selectAll("circle")                    // select all the existing chart items (if none exist it returns an empty selection)
            .data(data, d=>d.index)                 // bind the data to the chart items, using the index to uniquely identify data points

        // Exit circles that no longer have data
        selection
            .exit()
            .transition().duration(300)              
            .style("opacity", 0) 
            .remove()    

        // Add the circles svg elements to the chart, one for each item in the selection
        selection
            .enter()                                             // get the 'entered' data items
            .append("circle")                                    // create a circle for each one
                .attr("cx",       d=>xScale(d.x))                // place the circle on the x axis based on the left-right tilt
                .attr("cy",       d=>yScale(d.y))                // place the circle on the y axis based on the front-back tilt
                .attr("r",        20)                            // fix the radius to 20 pixels
                .style("fill",    "red")                         // set the colour
                .style("opacity", 0.7)                           // set opacity 
    }

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.TOP + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))                                // create the axis

    // Draw the initial chart
    update()

    // This function is called when data is received from the microbit
    // The data is in the form: button,x,y
    // E.g. "A,56,34"
    function gotMicrobitData(microbitData) {
        //console.log(microbitData)

        // Split out the string from the microbit.  E.g."A,56,34" -> ["A","56","34"]
        let d = microbitData.split(",")

        // Clear the data if the A button is pressed
        if (d[0]=="A") 
            data = []

        // Add the received data as a new data item, adding an index to uniquely identify it
        data.push({index:index, button:"",x:parseInt(d[1],10),y:parseInt(d[2],10)})
        index++
        //console.log(data)

        // Update the D3 visualisation with the new data
        update()
    }
}



        