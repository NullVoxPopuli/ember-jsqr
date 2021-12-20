import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import ScannerService from 'ember-jsqr/services/ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';
import { scanQR } from 'ember-jsqr/test-support';
import RSVP from 'rsvp';

module('Component | jsqr-scanner', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(1);

    let data = { foo: 1 };
    let expected = JSON.stringify(data);

    this.setProperties({
      fakeStream: {},
      receivedData: (qrCode: string) => {
        assert.strictEqual(qrCode, expected);
      },
    });

    await render(hbs`
      <JSQR::Scanner
        @onData={{this.receivedData}}
        @cameraStream={{this.fakeStream}}
      />
    `);

    scanQR(this.owner, data);
  });

  test('does not pre-emptively call onData', async function (assert) {
    assert.expect(2);

    let data = { foo: 1 };
    let expected = JSON.stringify(data);
    let actual: string | undefined;

    this.setProperties({
      fakeStream: {},
      receivedData: (data: string) => {
        actual = data;
        assert.ok(true, 'onData called once');
      },
    });

    await render(hbs`
      <JSQR::Scanner
        @onData={{this.receivedData}}
        @cameraStream={{this.fakeStream}}
      />
    `);

    scanQR(this.owner, data);

    assert.deepEqual(actual, expected);
  });

  module('Unfortunately implementation-aware tests... :(', function (hooks) {
    let fakeModuleLoader: RSVP.Deferred<void>;

    hooks.beforeEach(function () {
      fakeModuleLoader = RSVP.defer();

      // It's unfortunate that this service key has to be copied around places,
      // but I don't want people importing this as some sort of way to access
      // the private bits of this addon.
      const key = 'ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner';

      this.owner.register(
        `service:${key}`,
        class extends ScannerService {
          start() {
            return fakeModuleLoader.promise;
          }
        }
      );
    });

    test('Block params can be used for loading', async function (assert) {
      this.setProperties({
        fakeStream: {},
        receivedData: () => null,
      });

      await render(hbs`
        <JSQR::Scanner
          @onData={{this.receivedData}}
          @cameraStream={{this.fakeStream}}
        >
          <span>Loading</span>
        </JSQR::Scanner>
      `);

      assert.dom().containsText('Loading');

      fakeModuleLoader.resolve();

      await settled();

      assert.dom().doesNotContainText('Loading');

      await settled();
    });
  });
});
