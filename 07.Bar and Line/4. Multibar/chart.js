/*
 * multibar.js
 * 
 * D3 code to draw a simple grouped bar chart
 * 
 */

async function drawChart(container, dataFile) {
    // Define chart parameters
    const WIDTH = 600
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}
    const PLOT = {LEFT:MARGIN.LEFT, RIGHT:WIDTH-MARGIN.RIGHT, TOP:MARGIN.TOP, BOTTOM:HEIGHT-MARGIN.BOTTOM, WIDTH:WIDTH-MARGIN.LEFT-MARGIN.RIGHT, HEIGHT:HEIGHT-MARGIN.TOP-MARGIN.BOTTOM}

    // Load the data
    // After this, data will look like this:
    //  [
    //      {product: 'cheese', uk: 10, france: 5, italy: 16}
    //      {product: 'ham',    uk: 60, france: 10, italy: 12}
    //      {product: 'wine',   uk: 40, france: 20, italy: 9}
    //      {product: 'fruit',  uk: 5, france: 25, italy: 7}
    //      {product: 'cake',   uk: 30, france: 27, italy: 6}
    //  ]
    const data = await d3.csv(dataFile);

    // Get the series from the data
    let countries = data.columns.slice(1)           // ['uk', 'france', 'italy']  
    console.log(data)    
    console.log(data.columns)

    // Get the groups from the data
    // "map each d in data to d.product"
    var products = data.map(d=>d.product)       // ['cheese', 'ham', 'wine', 'fruit', 'cake']
    console.log(products)
    
    // Convert all the series values to integers (by default they could be strings)
    data.forEach(function(d) {
        countries.forEach(country=>d[country]=parseInt(d[country]))
        // Equivalent to:
        //d['uk']=parseInt(d['uk'])
        //d['france']=parseInt(d['france'])
        //d['italy']=parseInt(d['italy'])
      });
  
    // Get the max value across all the data
    maxValue = d3.max(data,d=>d3.max(countries, country=>d[country]))

    // Reshape our data so it looks like this
    // [
    //  {product: 'cheese', values:[{country:'uk', value:10}, {country:'france',value:5},  {country:'italy',value:16}]},
    //  {product: 'ham',    values:[{country:'uk', value:60}, {country:'france',value:10}, {country:'italy',value:12}]},
    //  {product: 'wine',   values:[{country:'uk', value:40}, {country:'france',value:20}, {country:'italy',value:9}]},
    //  {product: 'fruit',  values:[{country:'uk', value:5},  {country:'france',value:25}, {country:'italy',value:7}]},
    //  {product: 'cake',   values:[{country:'uk', value:30}, {country:'france',value:27}, {country:'italy',value:6}]},
    // ]
    let groupByProduct = data.map(d=>({product:d.product,values:countries.map(country=>({country: country, value: d[country]}))}))
    console.log(groupByProduct)

    // Create a banded scale to map product name to an x screen coordinate 
    let xScale = d3.scaleBand()
        .domain(products)                           // domain is the list of products
        .range([PLOT.LEFT, PLOT.RIGHT])             // range is the on-screen coordinates where each group will go

    // Create a linear scale to map data values to a y screen coordinate
    let yScale = d3.scaleLinear()
        .domain([0, maxValue])                      // domain is 0 to the maximum value in the column
        .range([PLOT.BOTTOM, PLOT.TOP])             // range is the drawing height (top and bottom reversed to make origin at the bottom)

    // Create a banded scale to map countries to an x screen coordinate 
    let xSeriesScale = d3.scaleBand()
        .domain(countries)                          // domain is the list of values in the column
        .rangeRound([0, xScale.bandwidth()])        // range is the width of a single band in the xScale.  RangeRound to make sure all output values are rounded to whole numbers
        //.padding(0.05)                            // padding between each band, as % of band width
        .paddingOuter(0.1)  

    // Create our color scale to map series values to colours
    let colourScale = d3.scaleOrdinal()
        .domain(countries)                          // domain is the list of values in the column
        .range(d3.schemeCategory10)                 // select the colour scale


    // Add the svg element, in which we will draw the chart
    let svg = d3.select(container).append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .style('border', "1px solid black")

    // Get a selection object representing all the groups of bars we want in the chart
    // At the end, groupsSelection will contain 5 enter selections:
    // [
    //  {product: 'cheese', values:[{country:'uk', value:10}, {country:'france',value:5},  {country:'italy',value:16}]},
    //  {product: 'ham',    values:[{country:'uk', value:60}, {country:'france',value:10}, {country:'italy',value:12}]},
    //  {product: 'wine',   values:[{country:'uk', value:40}, {country:'france',value:20}, {country:'italy',value:9}]},
    //  {product: 'fruit',  values:[{country:'uk', value:5},  {country:'france',value:25}, {country:'italy',value:7}]},
    //  {product: 'cake',   values:[{country:'uk', value:30}, {country:'france',value:27}, {country:'italy',value:6}]},
    // ]    
    let productsSelection = svg    
        .selectAll("g")                             // create a selection of g (group) elements
        .data(groupByProduct)                       // bind the data to g elements
    console.log(productsSelection)

    // Get a selection object representing all the products we want in the chart
    // In the .data() call each d looks like this (coming from the productsSelection):
    //     {product: 'cheese', values:[{country:'uk', value:10}, {country:'france',value:5},  {country:'italy',value:16}]}
    // From this we take the values part to build the selection for all the rects, which is a list of lists:
    // [
    //  [{country:'uk', value:10}, {country:'france',value:5},  {country:'italy',value:16}],
    //  [{country:'uk', value:60}, {country:'france',value:10}, {country:'italy',value:12}],
    //  [{country:'uk', value:40}, {country:'france',value:20}, {country:'italy',value:9}],
    //  [{country:'uk', value:5},  {country:'france',value:25}, {country:'italy',value:7}],
    //  [{country:'uk', value:30}, {country:'france',value:27}, {country:'italy',value:6}]
    // ]    
    let selection = productsSelection
        .enter()                                                                // get the "entered" items
        .append("g")                                                            // create the group
            .attr("transform", d=>"translate(" + xScale(d.product) + ",0)")     // move to correct position on x axis
        .selectAll("rect")                                                      // create a selection of rects
        .data(d=>d.values)                                                      // bind the values to the rects, one for each country
    console.log(selection)

    // Draw the bars, one for each item in selection
    selection
        .enter()
        .append("rect")
            .attr("x",      d=>xSeriesScale(d.country))
            .attr("y",      d=>yScale(d.value))
            .attr("width",  xSeriesScale.bandwidth())
            .attr("height", d=>yScale(0) - yScale(d.value))
            .attr("fill",   d=>colourScale(d.country)); 
        
    // Add x axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(0," + PLOT.BOTTOM + ")")      // move down to the bottom of the drawing area
        .call(d3.axisBottom(xScale))                                // create the axis

    // Add y axis
    svg.append("g")                                                 // group the axis svg elements
        .attr("transform", "translate(" + PLOT.LEFT + ",0)")         // move the axis to the left 
        .call(d3.axisLeft(yScale))                                  // create the axis
   
}
