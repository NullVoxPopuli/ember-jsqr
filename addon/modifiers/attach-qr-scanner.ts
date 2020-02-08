import Modifier from 'ember-modifier';
import jsQR from 'jsqr';

type Point = import('jsqr/dist/locator').Point;
type QRCode = import('jsqr').QRCode;

type Args = {
  positional: [HTMLVideoElement];
  named: {
    onData: <T>(data: string) => T;
    highlightColor?: string;
  };
}

const DEFAULT_COLOR = '#FF3B58';

export default class AttachQrScannerModifier extends Modifier<Args> {
  element!: HTMLCanvasElement;
  canvas?: CanvasRenderingContext2D | null;
  _tick: FrameRequestCallback = () => { };

  get video() {
    return this.args?.positional[0];
  }

  get onData() {
    return this.args?.named.onData;
  }

  get color() {
    return this.args?.named.highlightColor || DEFAULT_COLOR;
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
        drawBox({
          canvas: this.canvas,
          location: code.location,
          color: this.color
        });

        this.onData(code.data);
      }
    }

    requestAnimationFrame(this._tick);
  }
}


function drawBox({
  canvas,
  location,
  color,
}: {
  canvas: CanvasRenderingContext2D,
  location: QRCode['location'],
  color: string,
}) {
  drawLine(canvas, location.topLeftCorner, location.topRightCorner, color);
  drawLine(canvas, location.topRightCorner, location.bottomRightCorner, color);
  drawLine(canvas, location.bottomRightCorner, location.bottomLeftCorner, color);
  drawLine(canvas, location.bottomLeftCorner, location.topLeftCorner, color);
}

function drawLine(canvas: CanvasRenderingContext2D, begin: Point, end: Point, color: string) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}
