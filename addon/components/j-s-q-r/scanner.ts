import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type Args = {
  cameraStream: MediaStream;
  onData: <T>(data: string) => T;
  highlightColor?: string;
};

/**
 * @desc
 * A component that wraps a canvas element, sets up a detached video element,
 * and streams the video content from `cameraStream` to the canvas via the detached video.
 *
 * @class JSQRScanner
 * @extends {Component}
 * @access public
 *
 * @argument cameraStream [MediaStream] the stream data from getUserMedia's video track
 * @argument onData [<T>(data: string) => T] callback function for handling QR Code detections.
 *
 */
export default class JSQRScanner extends Component<Args> {
  @tracked video?: HTMLVideoElement;

  @action
  onPlay(video: HTMLVideoElement) {
    this.video = video;
  }
}
