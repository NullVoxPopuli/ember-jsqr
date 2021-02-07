# &lbrace;&lbrace;attach-qr-scanner&rbrace;&rbrace; Modifier

The `<JSQRScanner />` component isn't needed, and only provides a very small
wrapper around the `{{attach-qr-scanner}}` modifier.

If you would like to write your own component for scanning QR Codes, this
is the bare minimum you need:

```hbs

{{#if this.cameraStream}}
  <canvas {{attach-qr-scanner this.cameraStream onData=this.handleData}}>
  </canvas>
{{/if}}
```

```js
import Component from '@glimmer/component';

export default class MyComponent extends Component {
  @tracked cameraStream;

  constructor(owner, args) {
    super(owner, args);

    this.start();
  }

  @action
  handleData(data) {
    console.log(data);
  }

  @action
  async start() {
    let options = { video: { facingMode: 'environment' } };
    let stream = await navigator.mediaDevices.getUserMedia(options);

    this.cameraStream = stream;
  }
}
```
