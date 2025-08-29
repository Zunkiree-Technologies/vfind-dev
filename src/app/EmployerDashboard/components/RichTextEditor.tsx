"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const updateCounts = useCallback((html: string) => {
    const text = html.replace(/<[^>]+>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    setCharCount(text.length);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML.trim() === "" && value) {
      editorRef.current.innerHTML = value;
      updateCounts(value);
    }
  }, [value, updateCounts]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateCounts(html);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);

    // Apply proper list styling
    if (editorRef.current) {
      editorRef.current.querySelectorAll("ul").forEach((ul) => {
        (ul as HTMLUListElement).style.listStyleType = "disc";
        (ul as HTMLUListElement).style.margin = "0.5em 0";
        (ul as HTMLUListElement).style.paddingLeft = "1.5em";
      });
      editorRef.current.querySelectorAll("ol").forEach((ol) => {
        (ol as HTMLOListElement).style.listStyleType = "decimal";
        (ol as HTMLOListElement).style.margin = "0.5em 0";
        (ol as HTMLOListElement).style.paddingLeft = "1.5em";
      });

      const html = editorRef.current.innerHTML;
      onChange(html);
      updateCounts(html);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md h-150">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 border-b pb-2">
        <button onClick={() => execCommand("bold")} className="p-2 hover:bg-gray-100 rounded-lg">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("italic")} className="p-2 hover:bg-gray-100 rounded-lg">
          <Italic className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("underline")} className="p-2 hover:bg-gray-100 rounded-lg">
          <Underline className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("strikeThrough")} className="p-2 hover:bg-gray-100 rounded-lg">
          <Strikethrough className="w-4 h-4" />
        </button>

        <button onClick={() => execCommand("insertUnorderedList")} className="p-2 hover:bg-gray-100 rounded-lg">
          <List className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("insertOrderedList")} className="p-2 hover:bg-gray-100 rounded-lg">
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Alignments */}
        <button onClick={() => execCommand("justifyLeft")} className="p-2 hover:bg-gray-100 rounded-lg">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("justifyCenter")} className="p-2 hover:bg-gray-100 rounded-lg">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("justifyRight")} className="p-2 hover:bg-gray-100 rounded-lg">
          <AlignRight className="w-4 h-4" />
        </button>
        <button onClick={() => execCommand("justifyFull")} className="p-2 hover:bg-gray-100 rounded-lg">
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[450px] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Status */}
      <div className="flex justify-between items-center mt-3 text-sm text-gray-500 border-t pt-2">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
