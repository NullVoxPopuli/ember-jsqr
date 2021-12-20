import type ApplicationInstance from '@ember/application/instance';
import type ScannerService from 'ember-jsqr/services/ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';

const KEY = 'ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';

type HasLookup = Pick<ApplicationInstance, 'lookup'>;

/**
 * @desc
 * manually simulates the activation of a successful scan of jsQR.
 */
export function scanQR(owner: HasLookup, data: unknown) {
  let service = owner.lookup(`service:${KEY}`) as ScannerService;

  let code = JSON.stringify(data);

  service.foundQRCode(code);

  return code;
}
