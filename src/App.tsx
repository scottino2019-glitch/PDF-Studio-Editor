/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { PdfViewer } from './components/PdfViewer';
import { RichTextEditor } from './components/RichTextEditor';
import { FileText, Github, Heart, Layers } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';

export default function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopyToEditor = (text: string) => {
    setPastedText(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen max-h-screen bg-slate-100 overflow-hidden text-slate-900">
        {/* Header Navigation */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-sm shrink-0">
              L
            </div>
            <h1 className="text-base md:text-lg font-semibold tracking-tight text-slate-800">
              LexiSync <span className="hidden sm:inline text-slate-400 font-normal">PDF Suite</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {pdfFile && (
              <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 uppercase max-w-[150px] md:max-w-[200px] truncate">
                {pdfFile.name}
              </div>
            )}
            
            <label className="relative cursor-pointer">
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all shadow-sm active:scale-95">
                <FileText size={16} />
                <span className="hidden xs:inline">Carica PDF</span>
              </div>
            </label>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="flex-1 overflow-hidden relative">
          <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="h-full">
            <ResizablePanel defaultSize={isMobile ? 40 : 50} minSize={20}>
              <div className="h-full bg-slate-200">
                <PdfViewer file={pdfFile} onCopy={handleCopyToEditor} />
              </div>
            </ResizablePanel>
            <ResizableHandle className={isMobile ? "h-px bg-slate-300" : "w-px bg-slate-300"} />
            <ResizablePanel defaultSize={isMobile ? 60 : 50} minSize={20}>
              <div className="h-full">
                <RichTextEditor pastedText={pastedText} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>

        {/* Footer Status Bar */}
        <footer className="h-8 bg-slate-800 flex items-center justify-between px-6 shrink-0 text-[10px] text-slate-400 font-medium uppercase tracking-wider overflow-hidden">
          <div className="flex gap-4 md:gap-6">
            <span>Status: Ready</span>
            <span className="hidden xs:inline">UTF-8</span>
          </div>
          <div className="flex gap-4 md:gap-6">
            <span className="hidden sm:flex items-center gap-1.5">
              Build with <Heart size={10} className="text-indigo-400 fill-current" /> for productivity
            </span>
            <span className="text-slate-500 font-medium">Versione 1.0.4</span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
