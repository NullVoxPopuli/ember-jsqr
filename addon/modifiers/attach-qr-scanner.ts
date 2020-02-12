import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

type QRCode = import('jsqr').QRCode;

import { drawBox } from './graphics/box';

import ScannerService from 'ember-jsqr/services/ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';

type Args = {
  positional: [HTMLVideoElement];
  named: {
    onData: <T>(data: string) => T;
    highlightColor?: string;
  };
};

const DEFAULT_COLOR = '#FF3B58';
const KEY = 'ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';

export default class AttachQrScannerModifier extends Modifier<Args> {
  @service(KEY) scanner!: ScannerService;

  element!: HTMLCanvasElement;
  canvas?: CanvasRenderingContext2D | null;
  _tick: FrameRequestCallback = () => ({});

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

  willRemove() {
    this.scanner.cleanup();
  }

  async startScanning() {
    this._tick = this.tick.bind(this);

    await this.scanner.start({ onData: this.onData });

    requestAnimationFrame(this._tick);
  }

  tick() {
    if (!this.scanner.jsQR) return;
    if (!this.video || !this.canvas) return;
    if (this.isDestroyed || this.isDestroying) return;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.element.height = this.video.videoHeight;
      this.element.width = this.video.videoWidth;

      this.canvas.drawImage(this.video, 0, 0, this.element.width, this.element.height);

      scan({
        jsQR: this.scanner.jsQR,
        canvas: this.canvas,
        element: this.element,
        scanner: this.scanner,
        onScan: code =>
          drawBox({
            canvas: this.canvas!, // TS, huh?
            location: code.location,
            color: this.color,
          }),
      });
    }

    requestAnimationFrame(this._tick);
  }
}

type ScanArgs = {
  canvas: CanvasRenderingContext2D;
  jsQR: Function;
  element: HTMLCanvasElement;
  scanner: ScannerService;
  onScan: (code: QRCode) => void;
};

/**
 * @note
 * See the service about why this is the way it is.
 */
function scan({ canvas, jsQR, element, scanner, onScan }: ScanArgs) {
  let imageData = canvas.getImageData(0, 0, element.width, element.height);
  let code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  if (code) {
    onScan(code);

    // calls the modifier's passed 'onData' method.
    scanner.foundQRCode(code);
  }

  return code;
}
