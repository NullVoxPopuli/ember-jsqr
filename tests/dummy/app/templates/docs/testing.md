# Testing

Mocking media devices in testing is almost impossible.
We make the assumption we're making is that browser vendors are doing their job
to ensure that all the existing JS APIs work, and that we don't need to
test them.

`scanQR` (the test-helper below) trigger's the component's `@onData`
callback function so you, as an app developer, can test the scenarios where
you scan valid/invalid data or scan multiple times, or whatever your usecase is.

Here is an example test (a test that is used for the CI for this addon):

```ts
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

    this.fakeCameraStream = td.object();

    this.receivedData = (qrCode: string) => {
      assert.equal(qrCode, expected);
    };

    await render(hbs`
      <JsqrScanner
        @onData={{this.receivedData}}
        @cameraStream={{this.fakeCameraStream}}
      />
    `);

    scanQR(this.owner, data);
  });
});
```
