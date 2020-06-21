import { START_RECORDER_COUNTDOWN, RECORDING_COUNTDOWN } from './actions';
import { RECORDED } from '../recorder/actions';
import { FACE_IMAGE, FACE_RESULTS, START_LOAD_FACEAPI, START_DETECTING_FACE } from '../face/actions';
import { AUDIO_DATA } from '../visualization/actions';
const numberOfTicks = 40;


export default function reducer(state = { currentMs: null, ticks: Array(numberOfTicks).fill(0) }, action) {
  switch (action.type) {
    case START_LOAD_FACEAPI:
      return {
        ...state,
        faceDetectorStatus: 'loading'
      }
    case START_DETECTING_FACE:
      return {
        ...state,
        faceDetectorStatus: 'detecting'
      }
    case FACE_IMAGE:
      return {
        ...state,
        ...action.payload
      }
    case FACE_RESULTS:
      return {
        ...state,
        faceDetectorStatus: 'detected',
        faceData: action.payload
      }
    case RECORDED:
      return {
        ...state,
        audio: action.payload,
        audioUrl: URL.createObjectURL(action.payload)
      }
    case START_RECORDER_COUNTDOWN:
      return {
        ...state,
        recorderStatus: 'initiating',
        recorderCoundown: action.payload
      }
    case RECORDING_COUNTDOWN:
      return {
        ...state,
        recorderStatus: 'recording',
        recorderCoundown: action.payload
      }
    case AUDIO_DATA:
      if (state.currentMs === null) {
        return {
          ...state,
          currentMs: action.payload.currentMs
        };
      }
      const revolutionTimeMs = 1000; //1 second
      const decayPerMs = 100 / revolutionTimeMs; // 100 to 0 in one revolution
      const baseline = 110;
      const { dataArray, currentMs } = action.payload;
      // const amp = (dataArray[1] + dataArray[2]) / 2; //speech range is in lower frequencies
      let { ticks } = state;
      if (!ticks) {
        ticks = Array(numberOfTicks).fill(0);
      }

      const elapsedTimeMs = currentMs - state.currentMs;
      //add decay based on elapsed time
      ticks = ticks.map(value => {
        return Math.max(0, value - decayPerMs * elapsedTimeMs);
      });

      const arr2 = [];
      function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const randomNumberLocation = getRndInteger(2, 3);
      const tickValueAgv = [
        Math.max(0, (dataArray[1] + dataArray[2]) / 2 - baseline)
      ];

      for (let index = 0; index < randomNumberLocation; index++) {
        const randomLocation = getRndInteger(3, 28);
        arr2.push(randomLocation);
        tickValueAgv.push(
          Math.max(
            0,
            (dataArray[getRndInteger(0, 15)] +
              dataArray[getRndInteger(0, 15)]) /
            2 -
            baseline
          )
        );
      }

      for (let index = 0; index < ticks.length; index++) {
        ticks[index] = (Math.random() * tickValueAgv[0]) / 10;
      }
      for (let index = 0; index < arr2.length; index++) {
        const value = arr2[index];
        ticks[value] = tickValueAgv[index];
        ticks[value - 1] = tickValueAgv[index] / 2;
        ticks[value + 1] = tickValueAgv[index] / 2;
        ticks[value - 2] = tickValueAgv[index] / 4;
        ticks[value + 2] = tickValueAgv[index] / 4;
      }
      return {
        ...state,
        currentMs,
        ticks: [...ticks]
      };
    default:
      return state;
  }
}

export const getVerifyState = (state) => state.verify;
