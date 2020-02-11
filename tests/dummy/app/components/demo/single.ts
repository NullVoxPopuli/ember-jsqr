// BEGIN-SNIPPET single-demo.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SingleDemo extends Component {
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
    let stream = await navigator.mediaDevices.getUserMedia(options);

    this.cameraStream = stream;
  }

  private stop() {
    this.cameraStream?.getTracks().forEach(track => track.stop());
    this.cameraStream = undefined;
  }
}
// END-SNIPPET
