async function readMicrobit(fn) {
  // Create event handler for button
  document.querySelector('button').addEventListener('click', async () => {
    // Filters for microbit
    const filters = [
      { usbVendorId: 0x0d28, usbProductId: 0x0204 }
    ];

    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort({ filters });

    // Wait for the serial port to open.
    await port.open({ baudRate: 9600,dataBits:8, stopBits:1, parity:"none", bufferSize:255, flowControl:"none"});
 
    // Get a reader on the data
    const reader = port.readable.getReader();

    // Listen to data coming from the serial device.
    let s = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      // value is a Uint8Array.

      // Convert to text and add to string buffer
      let receivedStr = new TextDecoder().decode(value)
      s += receivedStr

      // Split string on lines
      let lines = s.split("\x0d\x0a")

      // Print out complete lines
      for (let i=0; i<lines.length-1; i++) {
        //console.log(lines[i])
        fn(lines[i])
      }

      // Set string buffer to the incomplete line
      s = lines[lines.length-1]
      //console.log("Leftover"+s+"<");
      //console.log(value.toString('utf8'));
      //
    }

  });
}