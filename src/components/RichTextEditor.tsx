import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, AlignLeft, AlignCenter, 
  AlignRight, Heading1, Heading2, Download,
  Type
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const FONT_FAMILIES = [
  { label: 'Sans Serif', value: 'Inter, sans-serif' },
  { label: 'Display (Serif)', value: 'Playfair Display, serif' },
  { label: 'Monospace', value: 'JetBrains Mono, monospace' },
  { label: 'Classic Serif', value: 'Libre Baskerville, serif' },
];

interface RichTextEditorProps {
  pastedText?: string;
}

export function RichTextEditor({ pastedText }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<h2 style="text-align: center">Il Tuo Documento</h2><p>Inizia a scrivere qui o incolla il testo copiato dal PDF sopra...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] p-8 font-sans',
      },
    },
  });

  // Handle incoming pasted text from PDF
  useEffect(() => {
    if (editor && pastedText) {
      editor.chain().focus().insertContent(`<p>${pastedText}</p>`).run();
    }
  }, [editor, pastedText]);

  const exportToPdf = async () => {
    if (!editor) return;
    
    const element = document.querySelector('.tiptap') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('documento_esportato.pdf');
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Editor Toolbar */}
      <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-2 md:px-4 gap-2 shrink-0 z-10 shadow-sm overflow-x-auto no-scrollbar">
        <Select 
          onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
          defaultValue="Inter, sans-serif"
        >
          <SelectTrigger className="h-8 w-[100px] md:w-[140px] text-xs bg-white border-slate-300 shrink-0">
            <Type className="h-3.5 w-3.5 mr-1 md:mr-2 text-slate-500" />
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.value} value={font.value} className="text-xs">
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-6 w-px bg-slate-300 mx-1 shrink-0"></div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Toggle
            className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
            size="sm"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
            size="sm"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4 italic" />
          </Toggle>
          <Toggle
            className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
            size="sm"
            pressed={editor.isActive('underline')}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4 underline" />
          </Toggle>
        </div>

        <div className="h-6 w-px bg-slate-300 mx-1 shrink-0"></div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Toggle
            className="h-8 w-8 hover:bg-slate-200"
            size="sm"
            pressed={editor.isActive({ textAlign: 'left' })}
            onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            className="h-8 w-8 hover:bg-slate-200"
            size="sm"
            pressed={editor.isActive({ textAlign: 'center' })}
            onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            className="h-8 w-8 hover:bg-slate-200"
            size="sm"
            pressed={editor.isActive({ textAlign: 'right' })}
            onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </div>

        <div className="flex-1 min-w-[20px]"></div>

        <Button 
          size="sm" 
          className="h-8 gap-1 md:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-2 md:px-4 shadow-sm shrink-0" 
          onClick={exportToPdf}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Esporta Note</span>
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-white scrollbar-thin scrollbar-thumb-slate-200">
        <div className="max-w-2xl mx-auto py-4 md:py-12 px-2 md:px-4 shadow-inner min-h-full">
          <div className="border border-dashed border-slate-200 bg-[#FDFDFD] min-h-[400px] md:min-h-[800px] shadow-sm p-4 md:p-12">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
