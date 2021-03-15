// BEGIN-SNIPPET single-demo.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import type { NavigatorService } from 'ember-browser-services/types';

export default class SingleDemo extends Component {
  @service('browser/navigator') declare navigator: NavigatorService;

  @tracked cameraStream?: MediaStream;
  @tracked lastDetectedData?: string;

  get isCameraActive() {
    return this.cameraStream !== undefined;
  }

  @action
  async toggleCamera() {
    this.isCameraActive ? this.stop() : await this.start();
  }

  @action
  handleData(data: string) {
    this.lastDetectedData = data;
  }

  private async start() {
    let options = { video: { facingMode: 'environment' } };
    let stream = await this.navigator.mediaDevices.getUserMedia(options);

    this.cameraStream = stream;
  }

  private stop() {
    this.cameraStream?.getTracks().forEach((track) => track.stop());
    this.cameraStream = undefined;
  }
}
// END-SNIPPET
