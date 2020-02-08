import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type Args = {
  cameraStream: MediaStream;
  onData: <T>(data: string) => T;
  highlightColor?: string;
}

export default class JsqrScannerComponent extends Component<Args> {
  @tracked video?: HTMLVideoElement;

  @action
  onPlay(video: HTMLVideoElement) {
    this.video = video;
  }
}
