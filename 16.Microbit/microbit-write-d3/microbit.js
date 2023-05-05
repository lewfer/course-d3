/*
 * Write lines to microbit serial port.
 * 
 * This code must run in respose to a user event, hence the use of the button event listener.
 * 
 * See https://developer.chrome.com/en/articles/serial/ 
 */

let port;

// Connection
async function connectMicrobit() {
  // Create event handler for button
  document.querySelector('#connect').addEventListener('click', async () => {

    // Filters for microbit devices
    const filters = [
      { usbVendorId: 0x0d28, usbProductId: 0x0204 }
    ];

    // Prompt user to select any serial port with a relevant device attached
    port = await navigator.serial.requestPort({ filters });

    // Wait for the serial port to open.
    await port.open({ baudRate: 9600,dataBits:8, stopBits:1, parity:"none", bufferSize:255, flowControl:"none"});

    document.querySelector('#message').innerHTML = "Connected!"
  });
}

// Write
async function writeMicrobit(data) {
  try {
    const writer = port.writable.getWriter();

    // Convert the data to bytes and send to microbit
    // Add a CR LF to indicate end of line
    let bytes = new TextEncoder().encode(data + "\x0d\x0a")
    await writer.write(bytes);

    // Allow the serial port to be closed later.
    writer.releaseLock();
  }
  catch(error) {

  }
}

// Handle case when microbit is reconnected
navigator.serial.addEventListener("connect", (event) => {
  document.querySelector('#message').innerHTML = "Connected!"
});

// Handle case when microbit is disconnected
navigator.serial.addEventListener("disconnect", (event) => {
  document.querySelector('#message').innerHTML = "Not connected"
});