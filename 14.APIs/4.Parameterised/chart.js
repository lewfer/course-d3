/*
 * chart.js
 */

async function drawChart(container, dataFile) {

    // Define chart parameters
    const WIDTH = 800
    const HEIGHT = 600
    const MARGIN = {LEFT:50, RIGHT:50, TOP:50, BOTTOM:50}

    // Load the data
    let data = await d3.json("http://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes");

    // Extract the list of episodes
    data = data._embedded.episodes
    console.log(data)

    // Convert any numbers
    convertNumbers(data)

    // Draw chart here
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