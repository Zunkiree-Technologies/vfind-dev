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
    <div className="w-full  rounded-lg flex flex-col h-[400px]">
      {/* Toolbar (fixed inside editor box) */}
      <div className="flex flex-wrap gap-2 p-2 border-b sticky top-0 bg-white z-10">
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

      {/* Scrollable Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="flex-1 overflow-y-auto p-3 focus:outline-none"
      />

      {/* Status bar */}
      <div className="flex justify-between items-center px-3 py-1 text-xs text-gray-500 border-t">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
