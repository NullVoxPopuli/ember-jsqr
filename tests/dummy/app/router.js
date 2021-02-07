import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from 'dummy/config/environment';

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  docsRoute(this, function () {
    /* Your docs routes go here */
    this.route('usage');
    this.route('single-camera');
    this.route('multiple-cameras');
    this.route('testing');
    this.route('loading');
    this.route('attach-qr-scanner');
  });

  this.route('not-found', { path: '/*path' });
});
