import React, { useState, useEffect, forwardRef } from "react";
import Webcam from "react-webcam";

const WebcamFeed = forwardRef<Webcam>((props, ref) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
      }
    }
    checkPermission();
  }, []);

  if (hasPermission === null) {
    return <div>Requesting camera permission...</div>;
  }

  if (hasPermission === false) {
    return (
      <div>
        <p>
          Camera access denied. Please enable camera access and refresh the
          page.
        </p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full w-full bg-muted">
      <Webcam
        audio={false}
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          // width: 720,
          // height: 480,

          // height: "100%",
          facingMode: "user",
        }}
      />
    </div>
  );
});

WebcamFeed.displayName = "WebcamFeed";

export default WebcamFeed;
