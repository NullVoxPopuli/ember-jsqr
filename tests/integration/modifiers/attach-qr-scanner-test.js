import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import td from 'testdouble';

import { scanQR } from 'ember-jsqr/test-support';

module('Integration | Modifier | attach-qr-scanner', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function (assert) {
    await render(hbs`<canvas {{attach-qr-scanner}}></canvas>`);

    assert.ok(true);
  });

  test('can be attached to a vanilla canvas', async function (assert) {
    let data = { foo: 1 };
    let expected = JSON.stringify(data);

    this.fakeCameraStream = {};
    this.receivedData = td.func();

    await render(hbs`
      <canvas {{attach-qr-scanner this.fakeCameraStream onData=this.receivedData}}></canvas>
    `);

    assert.throws(() => td.verify(this.receivedData));

    scanQR(this.owner, data);

    assert.verify(this.receivedData(expected));
  });
});
