/*
 * world_chart.js
 *
 * Draw a map of the world and show where earthquakes are happening
 */

async function drawChart(container) {

    // Select the svg
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    // Create map and projection
    const projection = d3.geoMercator()
        .center([0,20])                // GPS of location to zoom on
        .scale(99)                       // This is like the zoom
        .translate([ width/2, height/2 ])
    
    // Load the map and earthquake data 
    // The promise...then just says try to run the "all" part and if it works run then "then" part
    Promise.all([
      d3.json("world.geojson"),
      d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson")
    ]).then(function (initialize) {
    
      // Get the two data items (map and earthquake data)
      let dataGeo = initialize[0]
      let data = initialize[1]
      //console.log(data)

      // Get earthquake features
      data = data.features
      //console.log(data)
      
      // Add a scale for bubble size
      const size = d3.scaleSqrt()
        .domain([0,10])     // What's in the data (earthquake magnitude)
        .range([1, 50])    // Size in pixel
  
      // Draw the map
      svg.append("g")
          .selectAll("path")
          .data(dataGeo.features)
          .join("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
          .style("stroke", "none")
          .style("opacity", .3)

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
          var dt = new Date(+d.properties.time); // The 0 there is the key, which sets the date to the epoch
          tooltip
          .html(d.properties.place + "<br/>" + dt.toLocaleString())
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

      // Group for the circles
      let circles = svg.append("g")
          
      // D3 update function
      function update(currentData) {
        //console.log(currentData)
        // Add circles:
        let selection = circles
          .selectAll("circle")
          .data(currentData, d=>d.id)

        
        // Exit circles elements that no longer have data
        selection
            .exit()
            .remove()  

        // Update circles that were already there
        selection.style("fill", "blue")            

        // Add new circles
        selection
          .enter()
          .append("circle")             
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)    
            .attr("cx", d => projection([+d.geometry.coordinates[0], +d.geometry.coordinates[1]])[0])
            .attr("cy", d => projection([+d.geometry.coordinates[0], +d.geometry.coordinates[1]])[1])
            .transition().duration(500) .ease(d3.easeBounce)
            .attr("r", d => size(+d.properties.mag))           
            .style("fill", "red")
            .attr("stroke", d=> {if (d.properties.mag>2000) {return "black"} else {return "none"}  })
            .attr("stroke-width", 1)
            .attr("fill-opacity", .4)         
      }
    
      update(data)

    // Set a timer event to trigger every 30 seconds
    var timer = setInterval(animate, 30000) 

    // Function called on the timer
    function animate() {
      // Load the map and data 
      Promise.all([
        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson")
        ]).then(function (initialize) {
          // Refresh the data
          //console.log("refresh")
          let data = initialize[0]
          data = data.features
          //console.log(data)

          // Update the display
          update(data)
      })      
    }          

    // --------------- //
    // ADD LEGEND      //
    // --------------- //
  
    // Add legend: circles
    const valuesToShow = [1,4,8]
    const xCircle = 80
    const xLabel = 90

    let legend = svg.append("g")

    legend
      .selectAll("legend")
      .data(valuesToShow)
      .join("circle")
        .attr("cx", xCircle)
        .attr("cy", d => height - size(d)-10)
        .attr("r", d => size(d))
        .style("fill", "none")
        .attr("stroke", "black")
  
    // Add legend: labels
    legend
      .selectAll("legend")
      .data(valuesToShow)
      .join("text")
        .attr('x', xCircle)
        .attr('y', d => height - size(d)*2+2)
        .text(d => d)
        .style("font-size", 14)
        .attr('text-anchor', 'middle')
        //.attr('alignment-baseline', 'text-bottom')
    })    
}