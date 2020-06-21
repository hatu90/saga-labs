export const START = 'START';
export const STOP = 'STOP';
export const CANCEL = 'CANCEL';
export const START_RECORDER_COUNTDOWN = 'START_RECORDER_COUNTDOWN';
export const RECORDING_COUNTDOWN = 'RECORDING_COUNTDOWN';

export const start = () => ({ type: START });
export const stop = () => ({ type: STOP });
export const cancel = () => ({ type: CANCEL });
