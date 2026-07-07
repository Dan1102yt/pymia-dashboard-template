import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ExtractedReceipt {
  proveedor?: string;
  fecha?: string;
  total?: number;
  categoria?: string;
  items?: { descripcion: string; valor: number }[];
  notas?: string;
}

interface ReceiptUploaderProps {
  onExtracted?: (data: ExtractedReceipt) => void;
}

export function ReceiptUploader({ onExtracted }: ReceiptUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractedReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const analyze = async () => {
    if (!image) return;
    const workerUrl = import.meta.env.VITE_WORKER_URL;
    if (!workerUrl) {
      setError('VITE_WORKER_URL no está configurado. Agrega la variable de entorno apuntando a tu proxy de Claude.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64 = image.split(',')[1];
      const mediaType = image.split(';')[0].split(':')[1];

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: `Analiza este recibo/factura y extrae la información en formato JSON con esta estructura exacta:
{
  "proveedor": "nombre del proveedor o tienda",
  "fecha": "YYYY-MM-DD",
  "total": número_sin_puntos_ni_comas,
  "categoria": "una de: Materia prima, Nómina, Servicios, Mantenimiento, Transporte, Alimentación, Papelería, Otros",
  "items": [{"descripcion": "...", "valor": número}],
  "notas": "observación breve si aplica"
}
Responde ÚNICAMENTE con el JSON, sin texto adicional.`,
              },
            ],
          }],
        }),
      });

      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

      const data = await response.json();
      const text = data.content?.[0]?.text ?? data.choices?.[0]?.message?.content ?? '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No se pudo extraer el JSON de la respuesta.');

      const extracted: ExtractedReceipt = JSON.parse(jsonMatch[0]);
      setResult(extracted);
      onExtracted?.(extracted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al analizar el recibo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!image ? (
        <div
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Camera size={22} className="text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Sube o arrastra la foto del recibo</p>
              <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP · Máx. 5MB</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Upload size={13} /> Seleccionar archivo
              </Button>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-slate-200">
            <img src={image} alt="Recibo" className="w-full max-h-48 object-contain bg-slate-50" />
            <button
              onClick={reset}
              className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {!result && !loading && (
            <Button onClick={analyze} className="w-full justify-center">
              <Camera size={15} /> Analizar con IA
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-600">
              <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
              Analizando el recibo...
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-green-800">Recibo analizado</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {result.proveedor && (
                  <div><p className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Proveedor</p><p className="font-medium text-slate-800">{result.proveedor}</p></div>
                )}
                {result.fecha && (
                  <div><p className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Fecha</p><p className="font-medium text-slate-800">{result.fecha}</p></div>
                )}
                {result.total && (
                  <div><p className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Total</p><p className="font-medium text-slate-800">${result.total.toLocaleString('es-CO')}</p></div>
                )}
                {result.categoria && (
                  <div><p className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Categoría</p><p className="font-medium text-slate-800">{result.categoria}</p></div>
                )}
              </div>
              {result.items && result.items.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-green-600 uppercase tracking-wide mb-1.5">Ítems</p>
                  <div className="space-y-1">
                    {result.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-slate-700">{item.descripcion}</span>
                        <span className="font-medium text-slate-800">${item.valor.toLocaleString('es-CO')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.notas && <p className="text-xs text-slate-600 italic">{result.notas}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
