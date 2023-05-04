/*
 * Read lines from microbit serial port.
 * 
 * When a line is received, the function fn is called with the data.
 * Lines must end with CR LF ("\x0d\x0a")
 * This code must run in respose to a user event, hence the use of the button event listener.
 * 
 * See https://developer.chrome.com/en/articles/serial/ 
 */
async function readMicrobit(fn) {
  // Create event handler for button
  document.querySelector('button').addEventListener('click', async () => {

    // Filters for microbit devices
    const filters = [
      { usbVendorId: 0x0d28, usbProductId: 0x0204 }
    ];

    // Prompt user to select any serial port with a relevant device attached
    const port = await navigator.serial.requestPort({ filters });

    // Wait for the serial port to open.
    await port.open({ baudRate: 9600,dataBits:8, stopBits:1, parity:"none", bufferSize:255, flowControl:"none"});
 
    document.querySelector('#message').innerHTML = "Connected!"

    // Get a reader on the data
    const reader = port.readable.getReader();

    // Listen to data coming from the serial device.
    // Build up a string, s, containing the data read
    let s = "";
    while (true) {
      // Read from the serial port
      const { value, done } = await reader.read();

      // If comms complete
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }

      // value is a Uint8Array.

      // Convert value to text and add to the string buffer
      let receivedStr = new TextDecoder().decode(value)
      s += receivedStr

      // Split string on lines
      let lines = s.split("\x0d\x0a")

      // Call back on fn with complete lines
      for (let i=0; i<lines.length-1; i++) {
        //console.log(lines[i])
        fn(lines[i])
      }

      // Set string buffer to the incomplete line at the end and loop to continue reading
      s = lines[lines.length-1]
    }
  });
}

// Handle case when microbit is reconnected
navigator.serial.addEventListener("connect", (event) => {
  document.querySelector('#message').innerHTML = "Connected!"
});

// Handle case when microbit is disconnected
navigator.serial.addEventListener("disconnect", (event) => {
  document.querySelector('#message').innerHTML = "Not connected"
});