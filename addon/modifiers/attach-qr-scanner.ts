import Ember from 'ember';
import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';

import Modifier from 'ember-modifier';

import { drawBox } from './graphics/box';

import type ScannerService from 'ember-jsqr/services/ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';
import type JSQR from 'jsqr';
import type { QRCode } from 'jsqr';

interface Named {
  [key: string]: unknown;
  onData: <T>(data: string) => T;
  onReady: <T>() => T;
  highlightColor?: string;
}

type Positional = [MediaStream];

export interface AttachQrScannerModifierSignature {
  Element: HTMLCanvasElement;
  Args: {
    Positional: Positional;
    Named: Named;
  };
}

const DEFAULT_COLOR = '#FF3B58';
const KEY = 'ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';

export default class AttachQrScannerModifier extends Modifier<AttachQrScannerModifierSignature> {
  @service(KEY) declare scanner: ScannerService;

  declare video?: HTMLVideoElement;
  declare canvas?: CanvasRenderingContext2D | null;
  declare element: HTMLCanvasElement;
  declare named: Named;
  declare positional: Positional;

  _tick: FrameRequestCallback = () => ({});

  get videoStream() {
    return this.positional?.[0];
  }

  get onData() {
    return this.named?.onData;
  }

  get onReady() {
    return this.named?.onReady;
  }

  get color() {
    return this.named?.highlightColor || DEFAULT_COLOR;
  }

  modify(element: HTMLCanvasElement, positional: Positional, named: Named): void {
    if (!this.element) {
      this.element = element;
      this.canvas = this.element.getContext('2d');
    }

    this.named = named;
    this.positional = positional;

    if (this.videoStream && !this.video) {
      this.video = document.createElement('video');

      if (!Ember?.testing) {
        this.video.srcObject = this.videoStream;
        this.video.setAttribute('playsInline', 'true');
        this.video.play();
      }

      this.startScanning();
    }

    registerDestructor(this, () => this.willRemove());
  }

  willRemove() {
    this.scanner.cleanup();
    this.video?.remove();
  }

  async startScanning() {
    this._tick = this.tick.bind(this);

    await this.scanner.start({ onData: this.onData });
    this.onReady?.();

    requestAnimationFrame(this._tick);
  }

  tick() {
    if (!this.scanner.jsQR) return;
    if (!this.video || !this.canvas) return;

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.element.height = this.video.videoHeight;
      this.element.width = this.video.videoWidth;

      this.canvas.drawImage(this.video, 0, 0, this.element.width, this.element.height);

      scan({
        jsQR: this.scanner.jsQR,
        canvas: this.canvas,
        element: this.element,
        scanner: this.scanner,
        onScan: (code) => {
          if (!this.canvas) return;

          drawBox({
            canvas: this.canvas,
            location: code.location,
            color: this.color,
          });
        },
      });
    }

    requestAnimationFrame(this._tick);
  }
}

type ScanArgs = {
  canvas: CanvasRenderingContext2D;
  jsQR: typeof JSQR;
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
    scanner.foundQRCode(code.data);
  }

  return code;
}
