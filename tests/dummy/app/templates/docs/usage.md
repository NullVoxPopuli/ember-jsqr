# Usage

The component invocation is as follows

<DocsSnippet @name="simple-demo-scanner.hbs"/>

## Args

- `cameraStream` - video stream from [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- `onData` - callback function that receives the decoded QR Code
- `highlightColor` - optional - the color to highlight the detected QR Code

