import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { scanQR } from 'ember-jsqr/test-support';
import hbs from 'htmlbars-inline-precompile';

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
    let actual: string | undefined;

    this.setProperties({
      fakeStream: {},
      receivedData: (data: string) => (actual = data),
    });

    await render(hbs`
      <canvas {{attach-qr-scanner this.fakeStream onData=this.receivedData}}></canvas>
    `);

    scanQR(this.owner, data);

    assert.deepEqual(actual, expected);
  });
});
