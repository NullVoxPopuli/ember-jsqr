import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { setupBrowserFakes } from 'ember-browser-services/test-support';

module('Acceptance | docs', function (hooks) {
  setupApplicationTest(hooks);

  module('camera can be toggled', function (hooks) {
    setupBrowserFakes(hooks, {
      navigator: {
        mediaDevices: {
          getUserMedia: () => Promise.resolve({ getTracks: () => [] }),
        },
      },
    });

    test('visiting /docs', async function (assert) {
      await visit('/docs/single-camera');

      assert.equal(currentURL(), '/docs/single-camera');

      let selector = '[data-test-single-camera-demo] button';

      await click(selector);

      assert.dom(selector).hasText('Stop Camera');

      await click(selector);

      assert.dom(selector).hasText('Start Camera');
    });
  });
});
