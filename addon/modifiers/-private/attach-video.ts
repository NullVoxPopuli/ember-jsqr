import Modifier from 'ember-modifier';
import Ember from 'ember';

type Args = {
  positional: [MediaStream, <T>(video: HTMLVideoElement) => T];
  named: {};
};

export default class AttachVideoModifier extends Modifier<Args> {
  video?: HTMLVideoElement;

  get videoStream() {
    return this.args.positional[0];
  }

  get onPlay() {
    return this.args.positional[1];
  }

  didReceiveArguments() {
    if (this.videoStream && this.onPlay) {
      this.video = document.createElement('video');

      if (!Ember?.testing) {
        this.video.srcObject = this.videoStream;
        this.video.setAttribute('playsInline', 'true');
        this.video.play();
      }

      this.onPlay(this.video);
    }
  }

  willRemove() {
    this.video?.remove();
  }
}
