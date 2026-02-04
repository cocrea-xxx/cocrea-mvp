import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

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
        focusMode: "continuous", // Intento de enfoque continuo
        width: { min: 640, ideal: 1920 }, // Pedir HD
      }
    };

    html5QrCode.start(
      { facingMode: "environment" }, 
      config,
      props.qrCodeSuccessCallback,
      undefined
    ).then(() => {
      // Una vez iniciada la cámara, inspeccionamos sus capacidades (Zoom y Flash)
      // Hack: Acceder al track de video nativo
      // @ts-ignore - Acceso a propiedad interna de la librería o API nativa
      const videoTrack = html5QrCode.getRunningTrackCameraCapabilities(); 
      // Si la librería no expone esto directo, buscamos el elemento video
      const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
      
      if (videoElement && videoElement.srcObject) {
         const stream = videoElement.srcObject as MediaStream;
         const track = stream.getVideoTracks()[0];
         const capabilities = track.getCapabilities();
         const settings = track.getSettings();

         // 1. Configurar Zoom
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
            // Auto-Zoom inicial a 2x si es posible para QRs pequeños
            // @ts-ignore
            if (capabilities.zoom.max >= 2) {
                track.applyConstraints({ advanced: [{ zoom: 2.0 }] });
                setZoomCap(prev => prev ? { ...prev, current: 2.0 } : null);
            }
         }

         // 2. Configurar Flash (Torch)
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
     
     // Actualizamos UI
     setZoomCap(prev => prev ? { ...prev, current: zoomValue } : null);

     // Aplicamos al hardware
     try {
        const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            await track.applyConstraints({ advanced: [{ zoom: zoomValue }] });
        }
     } catch (err) {
         console.error("Error aplicando zoom", err);
     }
  };

  return (
    <div className="w-full h-full relative group">
        {/* VIDEO CONTAINER */}
        <div 
            id={qrcodeRegionId} 
            className="w-full h-full object-cover"
        />

        {/* CONTROLES FLOTANTES */}
        <div className="absolute bottom-32 left-0 w-full px-8 flex flex-col items-center gap-4 z-50">
            
            {/* Slider de Zoom */}
            {zoomCap && (
                <div className="w-full max-w-xs bg-black/50 backdrop-blur-md p-3 rounded-full flex items-center gap-2 animate-in slide-in-from-bottom-5">
                    <span className="text-white font-bold text-xs">1x</span>
                    <input 
                        type="range" 
                        min={zoomCap.min} 
                        max={zoomCap.max} 
                        step={0.1}
                        value={zoomCap.current}
                        onChange={handleZoom}
                        className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-white font-bold text-xs">{(zoomCap.max || 5).toFixed(0)}x</span>
                </div>
            )}

            {/* Botón de Linterna */}
            {hasFlash && (
                <button 
                    onClick={toggleFlash}
                    className={`p-4 rounded-full shadow-xl transition-all ${isFlashOn ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white backdrop-blur-md border border-white/30'}`}
                >
                    {isFlashOn ? '💡 APAGAR LUZ' : '🔦 ENCENDER LUZ'}
                </button>
            )}
        </div>
    </div>
  );
};

export default Html5QrcodePlugin;
