import { all } from 'redux-saga/effects';
import mainSaga from './modules/main/saga';
import emailSaga from './modules/emails/saga';
import logSaga from './modules/logSaga';


export default function* rootSaga() {
  yield all([
    mainSaga(),
    emailSaga(),
    logSaga()
  ])
}
