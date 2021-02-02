import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import td from 'testdouble';
import installVerifyAssertion from 'testdouble-qunit';

setApplication(Application.create(config.APP));

installVerifyAssertion(QUnit, td);
setup(QUnit.assert);

start();
