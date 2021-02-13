import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { setupBrowserFakes } from 'ember-browser-services';

module('Acceptance | docs', function (hooks) {
  setupApplicationTest(hooks);

  module('camera can be toggled', function (hooks) {
    setupBrowserFakes(hooks, {
      navigator: {
        mediaDevices: {
          getUserMedia: () => ({ getTracks: () => [] }),
        },
      },
    });

    test('visiting /docs', async function (assert) {
      await visit('/docs/single-camera');

      assert.equal(currentURL(), '/docs/single-camera');

      await click('button');
    });
  });
});
