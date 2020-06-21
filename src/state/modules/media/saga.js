export default function* mediaSaga(options) {
  const stream = yield window.navigator.mediaDevices.getUserMedia(options);
  return stream;
}
