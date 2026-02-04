import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
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
      fps: 10, 
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
            // @ts-ignore
            if (capabilities.zoom.max >= 2) {
                // @ts-ignore
                track.applyConstraints({ advanced: [{ zoom: 2.0 }] });
                setZoomCap(prev => prev ? { ...prev, current: 2.0 } : null);
            }
         }

         // @ts-ignore
         if (capabilities.torch) {
            setHasFlash(true);
         }
      }
    }).catch((err) => {
      console.error("Error al iniciar cámara:", err);
    });

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
     } catch (err) {
        console.error("Error cambiando flash", err);
     }
  };

  const handleZoom = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const zoomValue = Number(e.target.value);
     if (!scannerRef.current) return;
     
     setZoomCap(prev => prev ? { ...prev, current: zoomValue } : null);

     try {
        const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            // @ts-ignore
            await track.applyConstraints({ advanced: [{ zoom: zoomValue }] });
        }
     } catch (err) {
         console.error("Error aplicando zoom", err);
     }
  };

  return (
    <div className="w-full h-full relative group">
        <div id={qrcodeRegionId} className="w-full h-full object-cover" />
        <div className="absolute bottom-32 left-0 w-full px-8 flex flex-col items-center gap-4 z-50">
            {zoomCap && (
                <div className="w-full max-w-xs bg-black/50 backdrop-blur-md p-3 rounded-full flex items-center gap-2 animate-in slide-in-from-bottom-5">
                    <span className="text-[#00FF41] font-bold text-xs font-mono">1x</span>
                    <input 
                        type="range" 
                        min={zoomCap.min} 
                        max={zoomCap.max} 
                        step={0.1}
                        value={zoomCap.current}
                        onChange={handleZoom}
                        className="w-full h-2 bg-green-900/30 rounded-lg appearance-none cursor-pointer accent-[#00FF41]"
                    />
                    <span className="text-[#00FF41] font-bold text-xs font-mono">{(zoomCap.max || 5).toFixed(0)}x</span>
                </div>
            )}
            {hasFlash && (
                <button 
                    onClick={toggleFlash}
                    className={`px-6 py-3 rounded-none font-bold transition-all border-2 ${isFlashOn ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'bg-black text-[#00FF41] border-[#00FF41] shadow-[0_0_10px_#00FF41]'}`}
                >
                    {isFlashOn ? '[ LUZ: ON ]' : '[ LUZ: OFF ]'}
                </button>
            )}
        </div>
    </div>
  );
};

export default Html5QrcodePlugin;