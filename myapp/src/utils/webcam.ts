import { RefObject } from 'react';
import Webcam from 'react-webcam';

export const captureWebcamImage = (webcamRef: RefObject<Webcam>): Promise<string | null> => {
  return new Promise((resolve) => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      resolve(imageSrc);
    } else {
      resolve(null);
    }
  });
};