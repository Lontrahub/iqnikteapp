
'use client';

import React from 'react';
import { Bold, Heading1, Pilcrow } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface RichTextEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
    ({ value, onChange, placeholder, ...props }, ref) => {
    const editorRef = React.useRef<HTMLDivElement>(null);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      onChange(e.currentTarget.innerHTML);
    };
    
    const handleCommand = (command: string, valueArg?: string) => {
      document.execCommand(command, false, valueArg);
      if(editorRef.current) {
        onChange(editorRef.current.innerHTML);
        editorRef.current.focus();
      }
    };

    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
      <div className="rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="p-1 border-b">
          <ToggleGroup type="multiple" size="sm">
            <ToggleGroupItem value="bold" aria-label="Toggle bold" onMouseDown={(e) => { e.preventDefault(); handleCommand('bold'); }}>
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="h1" aria-label="Toggle H1" onMouseDown={(e) => { e.preventDefault(); handleCommand('formatBlock', '<h1>'); }}>
              <Heading1 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="p" aria-label="Toggle Paragraph" onMouseDown={(e) => { e.preventDefault(); handleCommand('formatBlock', '<p>'); }}>
              <Pilcrow className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div
          ref={(node) => {
            if (node) {
                editorRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            }
          }}
          onInput={handleInput}
          contentEditable={isMounted}
          suppressContentEditableWarning
          className="min-h-[120px] w-full p-3 text-sm prose-p:my-0 prose-h1:my-1 prose-headings:font-headline dark:prose-invert max-w-none focus:outline-none"
          dangerouslySetInnerHTML={{ __html: isMounted ? (value || '') : '' }}
          data-placeholder={placeholder}
          {...props}
        >
        </div>
      </div>
    );
  }
);
RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
