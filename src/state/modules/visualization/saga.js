import { eventChannel } from 'redux-saga';
import { call, take, put, cancelled } from 'redux-saga/effects';

import { setAudioData } from './actions';

function audioContextChan(stream) {
  const audioContext = new (window.AudioContext ||
    window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 32;
  analyser.smoothingTimeConstant = 0.2; //default is 0.8
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  return eventChannel(emitter => {
    emitter(setAudioData({ currentMs: window.performance.now(), dataArray }));
    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      emitter(setAudioData({ currentMs: window.performance.now(), dataArray }));
    };
    const animationFrameRef = setInterval(tick, 10);
    return () => {
      clearInterval(animationFrameRef);
      analyser && analyser.disconnect();
      source && source.disconnect();
    }
  });
}

export default function* visualizationSaga(stream) {
  const chan = yield call(audioContextChan, stream);

  try {
    while (true) {
      const channelAction = yield take(chan);
      yield put(channelAction);
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}
