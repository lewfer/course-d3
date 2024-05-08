/*
 * line.js
 *  
 * D3 code to draw a multi line chart
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}
    const colour ="#f02035"

    // Load the data
    // After this, data will look like this:
    //  [
    //      {product: 'cheese', uk: 10, france: 5, italy: 16}
    //      {product: 'ham', uk: 60, france: 10, italy: 12}
    //      {product: 'wine', uk: 40, france: 20, italy: 9}
    //      {product: 'fruit', uk: 5, france: 25, italy: 7}
    //      {product: 'cake', uk: 30, france: 27, italy: 6}
    //  ]
    const data = await d3.csv(dataFile);

    // Get the series from the data
    let countries = data.columns.slice(1)          // ['uk', 'france', 'italy']      

    // Get the groups from the data
    // "map each d in data to d.product"
    var products = data.map(d=>d.product)     // ['cheese', 'ham', 'wine', 'fruit', 'cake']
        
    // Convert all the series values to integers (by default they could be strings)
    data.forEach(function(d) {
        countries.forEach(country=>d[country]=parseInt(d[country]))
        // Equivalent to:
        //d['uk']=parseInt(d['uk'])
        //d['france']=parseInt(d['france'])
        //d['italy']=parseInt(d['italy'])        
      });

    // Rehape our data so it looks like this
    // [
    //  {country:uk,     values:[{product:'cheese',value:'10'}, {product:'ham',value:'60'},...]},
    //  {country:france, values:[{product:'cheese',value:'5'},  {product:'ham',value:'10'},...]},
    //  {country:italy,  values:[{product:'cheese',value:'16'}, {product:'ham',value:'12'},...]}
    // ]
    let groupByCountry = countries.map(s=>({
        country: s,
        values: data.map(d=>({product: d.product, value: d[s]}))  // extract the data from the column
        }
    ))
    console.log(groupByCountry)  

    // Get the max value across all the data
    maxValue = d3.max(data,d=>d3.max(countries, country=>d[country]))

    // Create our x scale to map group values to screen coordinates 
    let xScale = d3.scaleBand()
        .domain(products)                     // domain is the list of products
        .range([PLOT.LEFT, PLOT.RIGHT])     // range is the on-screen coordinates where each group will go

    // Create our y scale to map data values to screen coordinates 
    let yScale = d3.scaleLinear()
        .domain([0, maxValue])        // domain is 0 to the maximum value in the column
        .range([PLOT.BOTTOM, PLOT.TOP])         // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Create our color scale to map series values to colours
    let colourScale = d3.scaleOrdinal()
        .domain(countries)              // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale

    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .style('border', "1px solid black")

    // Define the line generator function
    // It will generate an SVG path which plots the product on the x axes and the value on the y axis
    // So a call like this:
    //      linepoints([{product:'cheese',value:'10'}, {product:'ham',value:'60'}, {product:'wine',value:'40'},{product:'fruit',value:'5'},{product:'cake',value:'30'}])
    // will return a path like this:
    //      M50,466.66L150,50L250,216.666L350,508.333L450,300
    let linepoints = d3.line()
        .x(d=>xScale(d.product))
        .y(d=>yScale(d.value));


    // Get a selection object representing all the countries we want in the chart
    // When this is run, countriesSelect will contain 3 enter selections, one for each country
    // [
    //  {country:uk,     values:[{product:'cheese',value:'10'}, {product:'ham',value:'60'}, {product:'wine',value:'40'},{product:'fruit',value:'5'},{product:'cake',value:'30'}]},
    //  {country:france, values:[{product:'cheese',value:'5'},  {product:'ham',value:'10'},...]},
    //  {country:italy,  values:[{product:'cheese',value:'16'}, {product:'ham',value:'12'},...]}
    // ]    
    let countriesSelection = svg    
        .selectAll("path")                 // create a selection of path elements
        .data(groupByCountry)              // bind the data to path elements
    console.log(countriesSelection)
    
    // For each country, draw the line with the values for that country
    countriesSelection
      .enter()
      .append("path")
      .attr("class",          "line")
      .attr("d",              d=>linepoints(d.values))
      .attr("transform",      "translate(" + xScale.bandwidth()/2 + ",0)")    
      .style("stroke",        d=>colourScale(d.country))

    // Add x axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")    // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                              // create the axis

    // Add y axis
    svg.append("g")                                               // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")       // move the axis to the left 
        .call(d3.axisLeft(yScale))                                // create the axis
}
