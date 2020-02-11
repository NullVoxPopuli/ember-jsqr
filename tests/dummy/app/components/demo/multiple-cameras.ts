import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MultipleCamerasDemo extends Component {
  @tracked cameraStream?: MediaStream;
  @tracked lastDetectedData?: string;
  @tracked videoDevices?: MediaDeviceInfo[];
  @tracked selectedCamera?: string;

  get isCameraActive() {
    return this.cameraStream !== undefined;
  }

  get isNotReadyToStart() {
    return !this.selectedCamera;
  }

  @action
  async toggleCamera() {
    this.isCameraActive ? this.stop() : await this.start();
  }

  @action
  handleData(data: string) {
    this.lastDetectedData = data;
  }

  // BEGIN-SNIPPET multiple-demo.ts
  @action
  selectCamera(id: string) {
    this.selectedCamera = id;
  }

  @action
  async getDevices() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let videoDevices = devices.filter(device => device.kind === 'videoinput');

    this.videoDevices = videoDevices;
    this.selectedCamera = videoDevices[0].deviceId;
  }

  private async start() {
    let options = {
      video: true,
      deviceId: {
        exact: this.selectedCamera,
      },
    };
    let stream = await navigator.mediaDevices.getUserMedia(options);

    this.cameraStream = stream;
  }
  // END-SNIPPET

  private stop() {
    this.cameraStream?.getTracks().forEach(track => track.stop());
    this.cameraStream = undefined;
  }
}
