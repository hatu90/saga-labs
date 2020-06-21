import { eventChannel } from 'redux-saga';
import { cancelled, call, take, put, race } from 'redux-saga/effects';
import { startRecording, recorded, STOP_RECORDING } from './actions';

function recorderChan(audioRecorder) {
  return eventChannel(emitter => {
    let chunks = [];
    let blob = null;
    audioRecorder.onstart = () => {
      emitter(startRecording());
    }
    audioRecorder.onstop = () => {
      blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
      emitter(recorded(blob));
    }
    audioRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    return () => {
      console.log('close')
    }
  });
}

export default function* mediaRecorder(stream) {
  const options = { mimeType: 'audio/webm' };
  const audioRecorder = new window.MediaRecorder(stream, options);
  audioRecorder.start();

  const chan = yield call(recorderChan, audioRecorder);

  try {
    while (true) {
      const { channelAction, stop } = yield race({
        channelAction: take(chan),
        stop: take(STOP_RECORDING)
      })
      if (channelAction) {
        yield put(channelAction)
      }
      if (stop) {
        console.log('stop recording')
        audioRecorder.stop();
        break;
      }
    }
    const channelAction = yield take(chan);
    yield put(channelAction);
  } finally {
    if (yield cancelled()) {
      chan.close()
      audioRecorder.stop();
    }
  }
}
