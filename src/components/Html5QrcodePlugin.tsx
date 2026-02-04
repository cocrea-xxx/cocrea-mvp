import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
}

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {
  useEffect(() => {
    // Configuración del escáner
    const config = {
      fps: props.fps || 10,
      qrbox: props.qrbox || 250,
      aspectRatio: 1.0,
      disableFlip: props.disableFlip === undefined ? false : props.disableFlip,
    };

    const verbose = props.verbose === true;

    // Crear instancia del escáner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );

    // Renderizar (iniciar cámara)
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // Limpieza al desmontar el componente (cerrar cámara)
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id={qrcodeRegionId} className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-slate-200" />;
};

export default Html5QrcodePlugin;
