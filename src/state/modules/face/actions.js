export const FACE_IMAGE = 'FACE_IMAGE';
export const FACE_RESULTS = 'FACE_RESULTS';
export const START_LOAD_FACEAPI = 'START_LOAD_FACEAPI';
export const START_DETECTING_FACE = 'START_DETECTING_FACE';

export const faceImage = (image) => ({
  type: FACE_IMAGE,
  payload: image
});

export const faceResults = (results) => ({
  type: FACE_RESULTS,
  payload: results
})

export const loadFaceApi = () => ({
  type: START_LOAD_FACEAPI
})

export const startDetectingFace = () => ({
  type: START_DETECTING_FACE
})

export const startLoadFaceApi = () => ({
  type: START_LOAD_FACEAPI
})
