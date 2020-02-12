# Loading

On slow connections / devices, it may be desirable to show some loading
indication while the jsQR dependency is loaded and the camera starts.

```hbs
<JSQR::Scanner
  @onData={{this.handleData}}
  @cameraStream={{this.selectedCamearStream}}
>
  <div class='my-loader'>
    Loading...
  </div>
</JSQR::Scanner>
```
