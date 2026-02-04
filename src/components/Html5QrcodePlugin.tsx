import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
}

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // 1. Instanciamos el lector
    const html5QrCode = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = html5QrCode;

    // 2. Configuración para usar la cámara trasera con ALTA RESOLUCIÓN (HD)
    // Esto es crítico para leer el QR pequeño del carnet chileno
    const config = { 
      fps: 10, 
      qrbox: { width: 300, height: 300 }, // Área de escaneo más grande
      aspectRatio: 1.0,
      videoConstraints: {
        facingMode: "environment",
        width: { min: 640, ideal: 1920, max: 3840 },
        height: { min: 480, ideal: 1080, max: 2160 },
        focusMode: "continuous" // Intentar forzar auto-enfoque continuo
      }
    };

    // 3. Iniciar la cámara
    html5QrCode.start(
      { facingMode: "environment" }, 
      config,
      props.qrCodeSuccessCallback,
      (errorMessage) => {
        // Ignoramos errores de "no code found" para no ensuciar la consola
        // Solo llamamos al callback si es crítico
        if (props.qrCodeErrorCallback) {
            // props.qrCodeErrorCallback(errorMessage);
        }
      }
    ).catch((err) => {
      console.error("Error al iniciar cámara:", err);
    });

    // 4. Limpieza al salir
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => console.error("Error al detener cámara", err));
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div 
        id={qrcodeRegionId} 
        className="w-full h-full object-cover"
        style={{ width: "100%" }}
    />
  );
};

export default Html5QrcodePlugin;