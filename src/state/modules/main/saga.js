import { take, fork, cancel } from 'redux-saga/effects';

import verifySaga from '../verify/saga';
import { SELECT_EMAIL } from '../emails/actions';

import { START } from './actions';


export default function* mainSaga() {
  while (true) {
    yield take(START);

    const verifyTask = yield fork(verifySaga);

    yield take(SELECT_EMAIL);
    yield cancel(verifyTask);
  }
}
