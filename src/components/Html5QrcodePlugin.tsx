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
  const [zoomCap, setZoomCap] = useState<{ min: number; max: number; current: number } | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = html5QrCode;

    const config = { 
      fps: 15, 
      qrbox: { width: 300, height: 300 },
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
         const settings = track.getSettings();

         // @ts-ignore
         if (capabilities.zoom) {
            setZoomCap({
                // @ts-ignore
                min: capabilities.zoom.min,
                // @ts-ignore
                max: capabilities.zoom.max,
                // @ts-ignore
                current: settings.zoom || capabilities.zoom.min
            });
            // Auto-zoom 2x para QRs pequeños
            // @ts-ignore
            if (capabilities.zoom.max >= 2) {
                // @ts-ignore
                track.applyConstraints({ advanced: [{ zoom: 2.0 }] });
            }
         }
         // @ts-ignore
         if (capabilities.torch) setHasFlash(true);
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

  const handleZoom = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const zoomValue = Number(e.target.value);
     setZoomCap(prev => prev ? { ...prev, current: zoomValue } : null);
     try {
        const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            // @ts-ignore
            await track.applyConstraints({ advanced: [{ zoom: zoomValue }] });
        }
     } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full h-full relative">
        <div id={qrcodeRegionId} className="w-full h-full object-cover" />
        
        {/* CONTROLES MINIMALISTAS */}
        <div className="absolute bottom-10 left-0 w-full px-8 flex flex-col items-center gap-6 z-50">
            {zoomCap && (
                <div className="w-full flex items-center gap-4 bg-black border-2 border-[#00ff41] p-2">
                    <span className="font-bold">ZOOM</span>
                    <input 
                        type="range" 
                        min={zoomCap.min} max={zoomCap.max} step={0.1}
                        value={zoomCap.current}
                        onChange={handleZoom}
                        className="flex-1 accent-[#00ff41]"
                    />
                </div>
            )}
            {hasFlash && (
                <button 
                    onClick={toggleFlash}
                    className="btn-matrix w-full py-4 text-xl"
                >
                    {isFlashOn ? "APAGAR LUZ" : "ENCENDER LUZ"}
                </button>
            )}
        </div>
    </div>
  );
};

export default Html5QrcodePlugin;
