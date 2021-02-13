'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // ember-try optionally adds the embroider dependencies
  if ('@embroider/webpack' in app.dependencies()) {
    return (
      // eslint-disable-next-line node/no-missing-require
      require('@embroider/compat')
        // eslint-disable-next-line node/no-missing-require
        .compatBuild(app, require('@embroider/webpack').Webpack, {
          staticAddonTestSupportTrees: true,
          staticAddonTrees: true,
          staticHelpers: true,
          staticComponents: true,
        })
    );
  }

  return app.toTree();
};
