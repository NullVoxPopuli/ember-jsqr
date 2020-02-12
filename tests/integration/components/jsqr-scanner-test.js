import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import td from 'testdouble';

import { scanQR } from 'ember-jsqr/test-support';

module('Component | jsqr-scanner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    let data = { foo: 1 };
    let expected = JSON.stringify(data);

    this.fakeCameraStream = {};
    this.receivedData = qrCode => {
      assert.equal(qrCode, expected);
    };

    await render(hbs`
      <JSQR::Scanner
        @onData={{this.receivedData}}
        @cameraStream={{this.fakeCameraStream}}
      />
    `);

    scanQR(this.owner, data);
  });

  test('does not pre-emptively call onData', async function(assert) {
    let data = { foo: 1 };
    let expected = JSON.stringify(data);

    this.fakeCameraStream = {};
    this.receivedData = td.func();

    await render(hbs`
      <JSQR::Scanner
        @onData={{this.receivedData}}
        @cameraStream={{this.fakeCameraStream}}
      />
    `);

    assert.throws(() => td.verify(this.receivedData));

    scanQR(this.owner, data);

    assert.verify(this.receivedData(expected));
  });
});
