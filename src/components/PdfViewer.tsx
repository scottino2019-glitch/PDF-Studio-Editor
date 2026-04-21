import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileUp, Loader2, ArrowRightToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Using CDN worker for simplicity
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | string | null;
  onCopy?: (text: string) => void;
}

export function PdfViewer({ file, onCopy }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const handleCopy = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      if (onCopy) onCopy(selection.toString());
    } else {
      alert("Seleziona prima del testo dal PDF per copiarlo nell'editor.");
    }
  };

  useEffect(() => {
    // Smaller default scale on mobile
    if (window.innerWidth < 768) {
      setScale(0.7);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPageNumber => {
      const next = prevPageNumber + offset;
      if (next < 1 || (numPages && next > numPages)) return prevPageNumber;
      return next;
    });
  }, [numPages]);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-muted rounded-xl p-12 bg-white/50">
        <FileUp size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">Carica un PDF per iniziare</p>
        <p className="text-xs mt-1">Puoi copiare il testo direttamente dal PDF</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-500 overflow-hidden">
      {/* PDF Toolbar */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-2 md:px-4 shrink-0 z-10 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 md:gap-4 text-slate-500 shrink-0">
          <div className="flex items-center border rounded border-slate-300 overflow-hidden bg-white shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-none hover:bg-slate-100"
              onClick={() => changePage(-1)} 
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[10px] font-bold tabular-nums min-w-[50px] md:min-w-[60px] text-center text-slate-700">
              {pageNumber} / {numPages || '--'}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-none hover:bg-slate-100"
              onClick={() => changePage(1)} 
              disabled={!!numPages && pageNumber >= numPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <div className="flex items-center border rounded border-slate-300 overflow-hidden bg-white shadow-sm">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-slate-100" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
              <ZoomOut className="h-3.5 w-3.5 text-slate-500" />
            </Button>
            <span className="text-[10px] font-bold w-10 md:w-12 text-center text-slate-700">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-slate-100" onClick={() => setScale(s => Math.min(3, s + 0.1))}>
              <ZoomIn className="h-3.5 w-3.5 text-slate-500" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-[10px] font-bold gap-1 md:gap-2 bg-white hover:border-indigo-400 text-indigo-600 border-slate-300 px-2 md:px-3 shadow-sm active:bg-indigo-50"
            onClick={handleCopy}
            title="Copia il testo selezionato nell'editor sottostante"
          >
            <ArrowRightToLine className="h-3 w-3" />
            <span className="hidden xs:inline">Copia nell'Editor</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center scrollbar-thin scrollbar-thumb-slate-600/50">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground animate-in fade-in duration-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-xs">Caricamento documento...</p>
            </div>
          }
          className="shadow-2xl border-white border-[8px] rounded-sm"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="max-w-full"
          />
        </Document>
      </div>
    </div>
  );
}
