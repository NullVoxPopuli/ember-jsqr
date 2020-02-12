import Service from '@ember/service';
import { assert } from '@ember/debug';

interface ScannerOptions {
  onData: <T>(data: string) => T;
}

/**
 * @private
 *
 * @desc
 * Why is a service involved at all with this addon?
 * For testing.
 *
 * Interacting with media devices is a non-trival, especially when
 * they may not even be connected.
 *
 * The assumption we're making is that browser vendors are doing their job
 * to ensure that all the existing JS APIs work, and that we don't need to
 * test them.
 *
 * But aside from pretending that the media devices don't exist, this service,
 * when in testing, allows us to use the `scanQR` test-helper
 * to simulate when we scanned a QR Code... and because TestHelpers can't
 * interact with instances of components and because the type of interaction is
 * private-api and components are blackboxes when it comes to testing,
 * we have this service.
 *
 * It does so happen that by using a service, it allows easier management of
 * loading async dependencies (jsqr itself), and that we don't need to worry
 * about multiple instance of jsqr floating around.
 *
 */
export default class ScannerService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  /**
   * @desc
   * passed in .start() as the callback for when data is detected from jsQR
   *
   * this cannot be set more than once without first being cleared.
   */
  onData?: ScannerOptions['onData'];

  /**
   * @desc
   * the jsQR module.
   */
  jsQR?: Function;

  /**
   * @desc
   * Registration from the attach-qr-scanner modifier.
   */
  async start(options: ScannerOptions) {
    assert(
      `ember-jsqr's Scanner may only be used once on the page at a time. This is because only one application can connect to a camera at a time.`,
      !this.onData
    );

    this.onData = options.onData;

    if (!this.jsQR) {
      this.jsQR = (await import('jsqr')).default;
    }

    assert(`jsQR was unable to load`, this.jsQR);
  }

  foundQRCode(code: string) {
    this.onData?.(code);
  }

  /**
   * @note
   * jsqr is not cleared, because it's a big enough package where
   * we shouldn't have to pay the cost of downloading it more than once.
   */
  cleanup() {
    this.onData = undefined;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner': ScannerService;
  }
}
