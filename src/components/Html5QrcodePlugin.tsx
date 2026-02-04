import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
}

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1, 2, 4

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = html5QrCode;

    const config = { 
      fps: 20, 
      qrbox: { width: 280, height: 280 },
      aspectRatio: 1.0,
      videoConstraints: {
        facingMode: "environment",
        focusMode: "continuous",
        width: { min: 640, ideal: 1920 },
      }
    };

    html5QrCode.start(
      { facingMode: "environment" }, 
      config,
      props.qrCodeSuccessCallback,
      undefined
    ).then(() => {
      const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
      if (videoElement && videoElement.srcObject) {
         const stream = videoElement.srcObject as MediaStream;
         const track = stream.getVideoTracks()[0];
         const capabilities = track.getCapabilities();
         
         // @ts-ignore
         if (capabilities.torch) setHasFlash(true);
         
         // Inicializar zoom x1
         // @ts-ignore
         if (capabilities.zoom) {
            setZoomLevel(1);
         }
      }
    }).catch(err => console.error(err));

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFlash = async () => {
     if (!scannerRef.current) return;
     try {
        await scannerRef.current.applyVideoConstraints({
            // @ts-ignore
            advanced: [{ torch: !isFlashOn }]
        });
        setIsFlashOn(!isFlashOn);
     } catch (err) { console.error(err); }
  };

  const cycleZoom = async () => {
    let nextZoom = 1;
    if (zoomLevel === 1) nextZoom = 2;
    else if (zoomLevel === 2) nextZoom = 4;
    else nextZoom = 1;

    setZoomLevel(nextZoom);

    try {
        const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            
            // @ts-ignore - Limitar al máximo del hardware si 4x no es posible
            const finalZoom = Math.min(nextZoom, capabilities.zoom?.max || 1);
            
            // @ts-ignore
            await track.applyConstraints({ advanced: [{ zoom: finalZoom }] });
        }
     } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full h-full relative">
        <div id={qrcodeRegionId} className="w-full h-full object-cover" />
        
        {/* CONTROLES TÁCTICOS */}
        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-between items-center z-50">
            <button 
                onClick={cycleZoom}
                className="btn-matrix w-24 h-24 text-3xl flex flex-col items-center justify-center leading-none"
            >
                <span className="text-sm">ZOOM</span>
                <span>x{zoomLevel}</span>
            </button>

            {hasFlash && (
                <button 
                    onClick={toggleFlash}
                    className={`btn-matrix w-24 h-24 text-3xl flex flex-col items-center justify-center leading-none ${isFlashOn ? 'bg-[#00ff41] text-black' : ''}`}
                >
                    <span className="text-sm">LUZ</span>
                    <span>{isFlashOn ? "ON" : "OFF"}</span>
                </button>
            )}
        </div>
    </div>
  );
};

export default Html5QrcodePlugin;