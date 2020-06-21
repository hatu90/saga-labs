import { take, call, fork, cancel, put, race, all } from 'redux-saga/effects';
import mediaSaga from '../media/saga';
import recorderSaga from '../recorder/saga';
import faceSaga from '../face/saga';
import timerSaga from '../timer/saga';
import visualizerSaga from '../visualization/saga';
import { stopRecording } from '../recorder/actions';
import { FACE_RESULTS, FACE_IMAGE } from '../face/actions';
import { RECORDED } from '../recorder/actions';

import { START_RECORDER_COUNTDOWN, RECORDING_COUNTDOWN } from './actions';
const STOP = '<AAAAAA></AAAAAA>'

function fetchPassPhrase() {
  return new Promise(resolve => {
    setTimeout(() => resolve('sample passphrase'), 1000)
  })
}

function verifyAPI(face, audio) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('passing data to server');
      console.log(face, audio);
    }, 1000)
  })
}

function* verifyRecorder(stream) {
  yield call(fetchPassPhrase);
  yield call(timerSaga, { value: 3, actionType: START_RECORDER_COUNTDOWN });
  yield all([fork(recorderSaga, stream), fork(visualizerSaga, stream)]);
  yield call(timerSaga, { value: 10, actionType: RECORDING_COUNTDOWN });
  yield put(stopRecording());
}

export default function* verifySaga() {
  let faceTask;
  let recorderTask;
  try {
    while (true) {
      const stream = yield call(mediaSaga, { audio: true, video: true });
      faceTask = yield fork(faceSaga, stream);
      yield take(FACE_RESULTS);
      recorderTask = yield fork(verifyRecorder, stream);
      const [faceDetectorAction, recorderAction] = yield all([
        take(FACE_IMAGE),
        take(RECORDED)
      ]);
      const audio = recorderAction.payload;
      const { face } = faceDetectorAction.payload;
      yield call(verifyAPI(face, audio));
      yield take(STOP);
    }
  } finally {
    yield cancel(faceTask);
    yield cancel(recorderTask);
  }
}
