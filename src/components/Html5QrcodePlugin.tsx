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

    // 2. Configuración para usar la cámara trasera ("environment")
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0 
    };

    // 3. Iniciar la cámara
    html5QrCode.start(
      { facingMode: "environment" }, // Forzar cámara trasera
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