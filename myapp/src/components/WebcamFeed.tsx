import React, { useState, useEffect, forwardRef } from "react";
import Webcam from "react-webcam";

const WebcamFeed = forwardRef<Webcam>((props, ref) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);


  useEffect(() => {
    async function getDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        setSelectedDevice(videoDevices[1]?.deviceId);
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setHasPermission(false);
      }
    }
    getDevices();
  }, []);


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
    <div className="flex flex-col items-center justify-center h-full w-full bg-muted">
      <select 
        className="mb-4 p-2 border rounded"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${devices.indexOf(device) + 1}`}
          </option>
        ))}
      </select>
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
          deviceId: selectedDevice,
          facingMode: "user",
        }}
      />
    </div>
  );
});

WebcamFeed.displayName = "WebcamFeed";

export default WebcamFeed;
