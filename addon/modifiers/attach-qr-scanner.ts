import Modifier from 'ember-modifier';

import { drawBox } from './graphics/box';

type Args = {
  positional: [HTMLVideoElement];
  named: {
    onData: <T>(data: string) => T;
    highlightColor?: string;
  };
};

const DEFAULT_COLOR = '#FF3B58';

export default class AttachQrScannerModifier extends Modifier<Args> {
  element!: HTMLCanvasElement;
  canvas?: CanvasRenderingContext2D | null;
  _tick: FrameRequestCallback = () => ({});
  jsQR?: Function;

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

  async startScanning() {
    this._tick = this.tick.bind(this);

    this.jsQR = (await import('jsqr')).default;

    requestAnimationFrame(this._tick);
  }

  tick() {
    if (!this.jsQR) return;
    if (!this.video || !this.canvas) return;
    if (this.isDestroyed || this.isDestroying) return;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.element.height = this.video.videoHeight;
      this.element.width = this.video.videoWidth;

      this.canvas.drawImage(this.video, 0, 0, this.element.width, this.element.height);

      let imageData = this.canvas.getImageData(0, 0, this.element.width, this.element.height);
      let code = this.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        drawBox({
          canvas: this.canvas,
          location: code.location,
          color: this.color,
        });

        this.onData(code.data);
      }
    }

    requestAnimationFrame(this._tick);
  }
}
