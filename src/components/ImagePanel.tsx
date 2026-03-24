
import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, FileImage, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImagePanelProps {
  selectedImage: any;
  onSelect: (img: any) => void;
  samples: any[];
  isProcessing: boolean;
}

export default function ImagePanel({ selectedImage, onSelect, samples, isProcessing }: ImagePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(1);

  // Reset zoom when image changes
  React.useEffect(() => {
    setZoom(1);
  }, [selectedImage?.id]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onSelect({
        id: `upload-${Date.now()}`,
        name: file.name,
        code: 'print(10 + 10)', // Default code for uploaded images
        url: imageUrl,
        isCustom: true,
        color: 'bg-indigo-600'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Upload Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Input Source
        </h2>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full aspect-video border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
          </div>
          <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300">Upload Custom Image</span>
        </button>
      </div>

      {/* Sample Library */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex-1 flex flex-col overflow-hidden">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Sample Library
        </h2>
        <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {samples.map((sample) => (
            <button
              key={sample.id}
              disabled={isProcessing}
              onClick={() => onSelect(sample)}
              className={`relative group p-3 rounded-lg border transition-all flex items-center gap-3 ${
                selectedImage?.id === sample.id 
                ? 'bg-indigo-500/10 border-indigo-500/50' 
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className={`w-12 h-12 rounded-md ${sample.color} flex items-center justify-center shadow-inner`}>
                <ImageIcon className="text-white/80 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">{sample.name}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase">LSB Encoded</p>
              </div>
              {selectedImage?.id === sample.id && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Preview</h2>
          {selectedImage && (
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
              <button 
                onClick={handleZoomOut}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleResetZoom}
                className="px-2 text-[10px] font-mono font-bold text-slate-500 hover:text-indigo-400 transition-colors"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button 
                onClick={handleZoomIn}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <div className="aspect-square rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group cursor-crosshair">
          {selectedImage ? (
            <>
              <div className={`absolute inset-0 opacity-20 blur-2xl ${selectedImage.color}`} />
              {selectedImage.url ? (
                <div 
                  className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <img 
                    src={selectedImage.url} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className={`w-32 h-32 rounded-xl ${selectedImage.color} shadow-2xl flex items-center justify-center relative z-10 transition-transform duration-200`}
                  style={{ transform: `scale(${zoom})` }}
                >
                  <ImageIcon className="text-white w-16 h-16" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded p-2 z-20 pointer-events-none">
                <p className="text-[10px] font-mono text-slate-300 truncate">{selectedImage.name}</p>
                <p className="text-[9px] text-slate-500">Dimensions: 1024 x 1024</p>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <ImageIcon className="w-12 h-12 text-slate-800 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No image selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
