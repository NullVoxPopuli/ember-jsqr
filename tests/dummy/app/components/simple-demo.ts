import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SimpleDemo extends Component {
  @tracked cameraStream?: MediaStream;
  @tracked lastDetectedData?: string;

  get isCameraActive() {
    return this.cameraStream !== undefined;
  }

  // BEGIN-SNIPPET simple-demo-scanner.ts
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
    let stream = await navigator.mediaDevices.getUserMedia(options);

    this.cameraStream = stream;
  }

  private stop() {
    this.cameraStream = undefined;
  }
  // END-SNIPPET
}
