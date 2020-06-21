import { eventChannel } from 'redux-saga';
import { take, call, cancelled, put } from 'redux-saga/effects';
import { faceImage, faceResults, startDetectingFace, startLoadFaceApi } from './actions';
import * as faceapi from 'face-api.js';

const FACE_API_VERSION = '0.22.2';
const modelsUri = `https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@${FACE_API_VERSION}/weights`

function faceChannel(stream) {
  return eventChannel(function eventHandler(emitter) {
    const inputSize = 480;
    const scoreThreshold = 0.5;
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.muted = true;

    let frameId, captureFrameId;
    videoElement.play().then(() => {

      async function tick() {
        const face = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions({
          inputSize,
          scoreThreshold
        })).withFaceLandmarks(true);
        emitter(faceResults(face));
        frameId = window.requestAnimationFrame(tick);
      }

      function captureTick() {
        const videoHeight = videoElement.videoHeight;
        const videoWidth = videoElement.videoWidth;
        const canvasElement = document.createElement("canvas");
        const canvasContext = canvasElement.getContext("2d");
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;
        canvasContext.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        emitter(faceImage({ face: canvasElement, width: videoWidth, height: videoHeight }));
        captureFrameId = window.requestAnimationFrame(captureTick);
      }

      frameId = window.requestAnimationFrame(tick);
      captureFrameId = window.requestAnimationFrame(captureTick);
    });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(captureFrameId);
    }
  });
}

export default function* faceAPISaga(stream) {
  yield put(startLoadFaceApi())
  yield faceapi.nets.tinyFaceDetector.loadFromUri(modelsUri);
  yield faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelsUri);
  yield faceapi.nets.ssdMobilenetv1.loadFromUri(modelsUri);

  const chan = yield call(faceChannel, stream);
  yield put(startDetectingFace());
  try {
    while (true) {
      const channelAction = yield take(chan);
      yield put(channelAction);
    }
  } finally {
    if (yield cancelled()) {
      chan.close()
    }
  }
}
