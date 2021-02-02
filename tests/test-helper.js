import Application from 'dummy/app';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import QUnit from 'qunit';

import td from 'testdouble';
import installVerifyAssertion from 'testdouble-qunit';

setApplication(Application.create(config.APP));

installVerifyAssertion(QUnit, td);
setup(QUnit.assert);

start();
