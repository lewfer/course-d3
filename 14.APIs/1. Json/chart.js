/*
 * chart.js
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600

    // Create the data
    data =  [
      {
        name: "British Museum",
        location: "London",
        founded: 1759,
        hours: {open: "09:00", close: "18:00"}
      },
      {
        name: "Musée d'Orsay",
        location: "Paris",
        founded: 1986,
        hours: {open: "09:30", close: "18:00"}
      },
      {
        name: "Gallerie degli Uffizi",
        location: "Florence",
        founded: 1581,
        hours: {open: "08:15", close: "18:50"}
      },
    ]

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .style('border', "1px solid black")

    // Get a selection object 
    let selection = svg    
        .selectAll("text") 
        .data(data)   
        
        
    // Add the text
    selection
        .enter()                                            // get the 'entered' data items
        .append("text")   
            .attr("x",       10)  
            .attr("y",       (d,i)=>50+i*20)
            .text(d=>d.name + ": " + d.hours.open + " to " + d.hours.close)
}

