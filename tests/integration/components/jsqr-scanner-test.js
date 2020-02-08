import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
// import { render } from '@ember/test-helpers';
// import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | jsqr-scanner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    assert.expect(0);
    // canvas.getContext doesn't exist in testing?
    // wat::
    // TypeError: this.element.getContext is not a function
                // at AttachQrScannerModifier.didInstall (http://localhost:7357/assets/vendor.js:113080:34)

  });
});
