import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Service | ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner',
  function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test('it exists', function (assert) {
      let service = this.owner.lookup(
        'service:ember-jsqr/-private/no-really-do-not-directly-access-this-service/scanner'
      );
      assert.ok(service);
    });
  }
);
