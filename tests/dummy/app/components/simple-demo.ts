import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SimpleDemo extends Component {
  @tracked cameraStream?: MediaStream;
  @tracked lastDetectedData?: string;

  @action
  async toggleCamera() {
    if (!this.cameraStream) {
      return await this.start();
    }

    this.stop();
  }

  @action
  handleData(data: string) {
    this.lastDetectedData = data;
  }

  private async start() {
    // Use facingMode: environment to attemt to get the front camera on phones
    let options = { video: { facingMode: 'environment' } };
    let stream = await navigator.mediaDevices.getUserMedia(options);

    this.cameraStream = stream;
  }

  private stop() {
    this.cameraStream = undefined;
  }
}
