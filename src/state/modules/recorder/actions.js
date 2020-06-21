export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const RECORDED = 'RECORDED';

export const startRecording = () => ({ type: START_RECORDING });
export const stopRecording = () => ({ type: STOP_RECORDING });
export const recorded = (audio) => ({ type: RECORDED, payload: audio })