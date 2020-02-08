# Usage

Usage content

```hbs
<h1>ember-jsqr demo</h1>
<button type='button' {{on 'click' this.startCamera}}>Start Camera</button>
<h2>Last Detected Data</h2>
{{this.lastDetectedData}}
<br>

{{#if this.cameraStream}}
  <JsqrScanner
    @cameraStream={{this.cameraStream}}
    @onData={{this.handleData}}
  />
{{/if}}
```
