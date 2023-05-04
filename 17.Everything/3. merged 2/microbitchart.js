/*
 * Example showing reading from a microbit accelerometer
 */

async function drawMicrobitChart(container, dataFile) {

    // Define chart parameters


    // Load the data
    let data = [{index:0, button:"",x:0,y:0}]
    let index = 0
    const NUMREADINGS = 300

    // Start reading data from the microbit serial port, calling the gotMicrobitData function when each line is received
    readMicrobit(gotMicrobitData);

    // Add the svg element, in which we will draw the chart
    let svg = d3.select("#righthere")

    let WIDTH = +svg.attr("width");
    let HEIGHT = +svg.attr("height");
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

   // Create a linear scale mapping the left-right tilt to the x screen coordinate 
   let xScale = d3.scaleLinear()
        .domain([-NUMREADINGS,0])                       // domain is the range of values from the microbit accelerometer x axis
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is drawing width 

    // Create a linear scale to mapping front-back tilt to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([-512,512])                       // domain is the range of values from the microbit accelerometer y axis
        .range([PLOT.BOTTOM, PLOT.TOP])             // range is the drawing height (top and bottom reversed to make origin at the bottom)


    let happening = svg.append("g")

    // D3 update function
    function update() {

        console.log(data)
        // Select lines
        let lineSelection = happening    
            .selectAll("line") 
            .data(data, d=>d.index)              // bind the data to the chart items, using the index to uniquely identify data points

        // Move lines that still have data
        lineSelection
            .attr("x1", (d,i)=>xScale(d.index-index))
            .attr("x2", (d,i)=>xScale(d.index-1-index))

        // Move then exit lines that no longer have data
        lineSelection
            .exit()
            .attr("x1", (d,i)=>xScale(d.index-index))
            .attr("x2", (d,i)=>xScale(d.index-1-index))
            .transition().duration(300)              
            .style("opacity", 0) 
            .remove()    

        // Add new lines
        lineSelection
            .enter()
            .append("line")
            .attr("x1", (d,i)=>xScale(d.index-index))
            .attr("x2", (d,i)=>xScale(d.index-1-index))
            .attr("y1", (d,i)=>yScale(d.y))
            .attr("y2", (d,i)=>yScale(i>0?data[i-1].y : 0))
            .attr("stroke","red")

            
        // Select circles
        let selection = happening    
            .selectAll("circle")     
            .data(data, d=>d.index)   

        // Move then exit circles that no longer have data
        selection
            .exit()
            .attr("cx",       (d,i)=>{return xScale(d.index-index)}) 
            .transition().duration(300)              
            .style("opacity", 0) 
            .remove()    

        // Move circles that still have data
        selection.attr("cx",       (d,i)=>{return xScale(d.index-index)})   

        // Add new circles
        selection
            .enter()                                             // get the 'entered' data items
            .append("circle")                                    // create a circle for each one
            //.merge(selection)
                //.attr("cx",       (d,i)=>{console.log(i);return xScale(i-100)})                // place the circle on the x axis based on the left-right tilt
                .attr("cx",       (d,i)=>{return xScale(d.index-index)})  
                .attr("cy",       d=>yScale(d.y)) 
                .attr("r",        2)   
                .style("fill",    "red") 
                .style("opacity", 0.7) 
    }

    svg.append("g").append("line")
        .attr("x1", d=>xScale(-NUMREADINGS))
        .attr("x2", d=>xScale(0))
        .attr("y1", d=>yScale(0))
        .attr("y2", d=>yScale(0))
        .attr("stroke","lightgrey")

    // Draw the initial chart
    update()

    // This function is called when data is received from the microbit
    // The data is in the form: button,x,y
    // E.g. "A,56,34"
    function gotMicrobitData(microbitData) {
        console.log(microbitData)

        // Split out the string from the microbit.  E.g."A,56,34" -> ["A","56","34"]
        let d = microbitData.split(",")

        // Clear the data if the A button is pressed
        if (d[0]=="A") 
            data = []

        data = data.slice(-NUMREADINGS+10)
        console.log(data)
        //console.log(data.length)

        // Add the received data as a new data item, adding an index to uniquely identify it
        data.push({index:index, button:"",x:parseInt(d[1],10),y:parseInt(d[2],10)})
        index++
        //console.log(data)

        // Update the D3 visualisation with the new data
        update()
    }
}



        