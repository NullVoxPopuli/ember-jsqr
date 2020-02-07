import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class JsqrScannerComponent extends Component {
  @tracked video?: HTMLVideoElement;

  @action
  onPlay(video: HTMLVideoElement) {
    this.video = video;
  }
}
