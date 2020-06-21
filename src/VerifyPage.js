import React from 'react';
import { useSelector } from 'react-redux';
import { getVerifyState } from './state/modules/verify';


export default function VerifyPage() {
  const { face, faceData = {}, audioUrl, ticks = [] } = useSelector(getVerifyState);
  console.log(audioUrl, faceData, ticks);
  return (
    <div>
      {face && <img height={450} width={600} src={face.toDataURL()} alt="face" />}
      <button>Select email</button>
    </div>
  )
}
