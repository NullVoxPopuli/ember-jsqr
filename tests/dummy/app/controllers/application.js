import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AppController extends Controller {
  @tracked cameraStream = undefined;
  @tracked lastDetectedData = undefined;

  @action
  startCamera() {
    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      this.cameraStream = stream;
    });
  }

  @action
  handleData(data) {
    this.lastDetectedData = data;
  }
}
