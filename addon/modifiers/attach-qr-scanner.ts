import Modifier from 'ember-modifier';
import jsQR from 'jsqr';

type Point = import('jsqr/dist/locator').Point;
type QRCode = import('jsqr').QRCode;

type Args = {
  positional: [HTMLVideoElement];
  named: { onData: <T>(data: string) => T };
}

export default class AttachQrScannerModifier extends Modifier<Args> {
  element!: HTMLCanvasElement;
  canvas?: CanvasRenderingContext2D | null;
  _tick: FrameRequestCallback = () => {};

  get video() {
    return this.args?.positional[0];
  }

  get onData() {
    return this.args?.named.onData;
  }

  didInstall() {
    this.canvas = this.element.getContext('2d');
  }

  didReceiveArguments() {
    if (this.video) {
      this.startScanning();
    }
  }

  startScanning() {
    this._tick = this.tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  drawLine(begin: Point, end: Point, color: string) {
    if (!this.canvas) return;

    this.canvas.beginPath();
    this.canvas.moveTo(begin.x, begin.y);
    this.canvas.lineTo(end.x, end.y);
    this.canvas.lineWidth = 4;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
  }

  drawBox(location: QRCode['location'], color: string) {
    this.drawLine(location.topLeftCorner, location.topRightCorner, color);
    this.drawLine(location.topRightCorner, location.bottomRightCorner, color);
    this.drawLine(location.bottomRightCorner, location.bottomLeftCorner, color);
    this.drawLine(location.bottomLeftCorner, location.topLeftCorner, color);
  }


  tick() {
    if (!this.video || !this.canvas) return;

      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        this.element.height = this.video.videoHeight;
        this.element.width = this.video.videoWidth;

        this.canvas.drawImage(this.video, 0, 0, this.element.width, this.element.height);

        let imageData = this.canvas.getImageData(0, 0, this.element.width, this.element.height);
        // TODO: add a way to asyncronously load jsQR (it's 40kb min+gzip)
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          this.drawBox(code.location, '#FF3B58');

          this.onData(code.data);
        }
      }

      requestAnimationFrame(this._tick);
  }
}
