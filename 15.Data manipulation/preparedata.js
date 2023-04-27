/*
 * preparedata.js
 * 
 * Lodash documentation: https://lodash.com/docs/4.17.15
 * 
 * Find latest version here: https://www.jsdelivr.com/package/npm/lodash 
 */

async function prepareData() {

  // Get some data (using the fetch api (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) )
  const api_url = "https://data.nasa.gov/resource/y77d-th95.json";
  const response = await fetch(api_url);
  var data = await response.json();
  //console.log(data);

  // Manipulate it

  // Get list of names
  let names = _.map(data,'name')
  console.log(names) 

  // Sort by mass ascending
  let sorted = _.orderBy(data,'mass')
  console.log(sorted)

  // Sort by mass descending
  let sortedDescending = _.orderBy(data, 'mass', 'desc')
  console.log(sortedDescending)

  // Sort first by longitude then latitude
  let sortedMultiple = _.orderBy(data, ['reclong','reclat'])
  console.log(sortedMultiple)

  // Group by recclass
  let grouped = _.groupBy(data, 'recclass')
  console.log(grouped)

  // Filter by class H
  let classH = _.filter(data, { recclass: 'H' });
  console.log(classH)

  // Choose one at random
  let random = _.sample(data)
  console.log(random)

  // Download the result of a manipulation as a new file
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {
      type: 'text/plain'
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  download(classH, 'data.json'); 
}


