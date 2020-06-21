import { eventChannel, END } from 'redux-saga';
import { call, take, cancelled, put } from 'redux-saga/effects';


function countdown({ value, actionType }) {
  return eventChannel(emitter => {
    const iv = setInterval(() => {
      value -= 1
      if (value > 0) {
        emitter({ type: actionType, payload: value })
      } else {
        emitter(END)
      }
    }, 1000);
    return () => {
      clearInterval(iv)
    }
  })
}

export default function* timerSaga({ value, actionType }) {
  const chan = yield call(countdown, { value, actionType })
  try {
    while (true) {
      const channelAction = yield take(chan)
      yield put(channelAction);
    }
  } finally {
    if (yield cancelled()) {
      chan.close()
    }
  }
}
