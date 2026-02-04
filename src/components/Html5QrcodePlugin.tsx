import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

export interface ScannerHandle {
  toggleFlash: (isOn: boolean) => Promise<boolean>;
  applyZoom: (level: number) => Promise<void>;
  hasFlash: boolean;
}

interface Html5QrcodePluginProps {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  defaultZoom?: number;
  autoFlash?: boolean;
}

const Html5QrcodePlugin = forwardRef<ScannerHandle, Html5QrcodePluginProps>((props, ref) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [flashAvailable, setFlashAvailable] = useState(false);

  useImperativeHandle(ref, () => ({
    hasFlash: flashAvailable,
    toggleFlash: async (isOn: boolean) => {
      if (!scannerRef.current) return false;
      try {
        // @ts-ignore
        await scannerRef.current.applyVideoConstraints({ advanced: [{ torch: isOn }] });
        return true;
      } catch (e) {
        return false;
      }
    },
    applyZoom: async (level: number) => {
      try {
        const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
          const track = (videoElement.srcObject as MediaStream).getVideoTracks()[0];
          // @ts-ignore
          const caps = track.getCapabilities();
          // @ts-ignore
          const finalZoom = Math.min(level, caps.zoom?.max || 1);
          // @ts-ignore
          await track.applyConstraints({ advanced: [{ zoom: finalZoom }] });
        }
      } catch (e) {
        console.error("Zoom error", e);
      }
    }
  }));

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      { 
        fps: 25, // Un poco más de fluidez ayuda a la detección nativa
        qrbox: { width: 320, height: 320 }, // Área más amplia para evitar efecto macro
        aspectRatio: 1.0,
        videoConstraints: {
            facingMode: "environment",
            width: { min: 640, ideal: 1920, max: 2560 },
            // @ts-ignore
            focusMode: "continuous" // Intentar mantener enfoque automático constante
        },
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true // USO DE API NATIVA (Clave para QR denso)
        }
      },
      props.qrCodeSuccessCallback,
      undefined
    ).then(async () => {
      const videoElement = document.querySelector(`#${qrcodeRegionId} video`) as HTMLVideoElement;
      if (videoElement && videoElement.srcObject) {
        const track = (videoElement.srcObject as MediaStream).getVideoTracks()[0];
        const caps = track.getCapabilities();

        // 1. Verificar y Auto-encender Flash si se solicita
        // @ts-ignore
        if (caps.torch) {
          setFlashAvailable(true);
          if (props.autoFlash) {
             // @ts-ignore
             await track.applyConstraints({ advanced: [{ torch: true }] });
          }
        }

        // 2. Aplicar Zoom por defecto (ej: x2)
        // @ts-ignore
        if (caps.zoom && props.defaultZoom) {
           // @ts-ignore
           const finalZoom = Math.min(props.defaultZoom, caps.zoom.max || 1);
           // @ts-ignore
           await track.applyConstraints({ advanced: [{ zoom: finalZoom }] });
        }
      }
    }).catch(console.error);

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id={qrcodeRegionId} className="w-full h-full object-cover" />;
});

Html5QrcodePlugin.displayName = "Html5QrcodePlugin";
export default Html5QrcodePlugin;