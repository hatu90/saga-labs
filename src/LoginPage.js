import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getVerifyState } from './state/modules/verify';

import { start } from './state/modules/main/actions';

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { faceDetectorStatus } = useSelector(getVerifyState);
  React.useEffect(() => {
    if (faceDetectorStatus === 'detected') {
      history.push('/verify');
    }
  }, [faceDetectorStatus]);

  return <button onClick={() => dispatch(start())}>Login with Verify</button>
}
