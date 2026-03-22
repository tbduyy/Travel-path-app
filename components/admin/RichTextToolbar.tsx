"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Type,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

// ─── Markdown → HTML (for loading existing content into editor) ────────────

export function markdownToHtml(md: string): string {
  if (!md) return "<p><br></p>";
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Block elements
  html = html.replace(/^# (.+)$/gm, "%%H2%%$1%%/H2%%");
  html = html.replace(/^## (.+)$/gm, "%%H3%%$1%%/H3%%");
  html = html.replace(/^### (.+)$/gm, "%%H4%%$1%%/H4%%");
  html = html.replace(/^&gt; (.+)$/gm, "%%BQ%%$1%%/BQ%%");
  html = html.replace(/^---$/gm, "%%HR%%");
  html = html.replace(/^- (.+)$/gm, "%%LI%%$1%%/LI%%");
  html = html.replace(/^(\d+)\. (.+)$/gm, "%%OLI%%$2%%/OLI%%");

  // Images (before links!)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" decoding="async" style="max-width:100%;border-radius:12px;margin:8px 0">',
  );
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  // Italic
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<i>$1</i>");
  // Underline
  html = html.replace(/__(.+?)__/g, "<u>$1</u>");
  // Font
  html = html.replace(
    /\{font:([^}]+)\}(.+?)\{\/font\}/g,
    '<span style="font-family:$1">$2</span>',
  );
  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:#2E968C;text-decoration:underline" target="_blank">$1</a>',
  );

  // Now restore block placeholders to real HTML
  html = html.replace(/%%H2%%(.+?)%%\/H2%%/g, "<h2>$1</h2>");
  html = html.replace(/%%H3%%(.+?)%%\/H3%%/g, "<h3>$1</h3>");
  html = html.replace(/%%H4%%(.+?)%%\/H4%%/g, "<h4>$1</h4>");
  html = html.replace(/%%BQ%%(.+?)%%\/BQ%%/g, "<blockquote>$1</blockquote>");
  html = html.replace(/%%HR%%/g, "<hr>");

  // Merge list items into proper lists
  html = html.replace(/(%%LI%%(.+?)%%\/LI%%\n?)+/g, (match) => {
    const items = match.replace(/%%LI%%(.+?)%%\/LI%%\n?/g, "<li>$1</li>");
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/(%%OLI%%(.+?)%%\/OLI%%\n?)+/g, (match) => {
    const items = match.replace(/%%OLI%%(.+?)%%\/OLI%%\n?/g, "<li>$1</li>");
    return `<ol>${items}</ol>`;
  });

  // Split into paragraph blocks by double newline
  const blocks = html.split(/\n{2,}/);
  html = blocks
    .map((b) => {
      const trimmed = b.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|blockquote|hr|ul|ol|img|div)/.test(trimmed))
        return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean)
    .join("");

  return html || "<p><br></p>";
}

// ─── HTML → Markdown (for saving) ──────────────────────────────────────────

export function htmlToMarkdown(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(walk).join("");

    switch (tag) {
      case "b":
      case "strong":
        return `**${children}**`;
      case "i":
      case "em":
        return `*${children}*`;
      case "u":
        return `__${children}__`;
      case "h2":
        return `\n# ${children}\n`;
      case "h3":
        return `\n## ${children}\n`;
      case "h4":
        return `\n### ${children}\n`;
      case "blockquote":
        return `\n${children
          .split("\n")
          .filter(Boolean)
          .map((l) => `> ${l.trim()}`)
          .join("\n")}\n`;
      case "hr":
        return "\n---\n";
      case "ul":
        return (
          "\n" +
          Array.from(el.querySelectorAll(":scope > li"))
            .map((li) => `- ${walk(li)}`)
            .join("\n") +
          "\n"
        );
      case "ol":
        return (
          "\n" +
          Array.from(el.querySelectorAll(":scope > li"))
            .map((li, i) => `${i + 1}. ${walk(li)}`)
            .join("\n") +
          "\n"
        );
      case "li":
        return children;
      case "a": {
        const href = el.getAttribute("href") || "";
        return `[${children}](${href})`;
      }
      case "img": {
        const src = el.getAttribute("src") || "";
        const alt = el.getAttribute("alt") || "image";
        return `\n![${alt}](${src})\n`;
      }
      case "br":
        return "\n";
      case "p":
      case "div":
        return children + "\n\n";
      case "span": {
        const ff = el.style.fontFamily;
        if (ff) return `{font:${ff}}${children}{/font}`;
        // Handle browser's font tag converted to span
        return children;
      }
      case "font": {
        const face = el.getAttribute("face") || "";
        if (face) return `{font:${face}}${children}{/font}`;
        return children;
      }
      default:
        return children;
    }
  }

  let md = Array.from(div.childNodes).map(walk).join("");
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

// ─── Re-export for blog display page ────────────────────────────────────────
export function parseRichContent(text: string): string {
  return markdownToHtml(text);
}

// ─── Font options ───────────────────────────────────────────────────────────
const FONTS = [
  { label: "Mặc định", value: "" },
  { label: "Serif (Thanh lịch)", value: "Georgia, serif" },
  { label: "Sans-serif (Hiện đại)", value: "Arial, sans-serif" },
  { label: "Monospace (Code)", value: "Courier New, monospace" },
  { label: "Trang trí", value: "Pacifico, cursive" },
  { label: "Playfair (Cổ điển)", value: "Playfair Display, serif" },
];

// ─── Toolbar Button ─────────────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  title,
  children,
  active = false,
  className = "",
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`
                p-1.5 sm:p-2 rounded-lg transition-all duration-150 text-gray-600 cursor-pointer
                hover:bg-secondary hover:text-[#1B4D3E]
                active:scale-95
                ${active ? "bg-secondary text-[#1B4D3E] ring-1 ring-[#2E968C]/40" : ""}
                ${className}
            `}
    >
      {children}
    </button>
  );
}

function Sep() {
  return (
    <div className="w-px h-6 bg-gray-200 mx-0.5 sm:mx-1 self-center shrink-0" />
  );
}

// ─── Main WYSIWYG Editor ────────────────────────────────────────────────────
type Props = {
  initialMarkdown: string;
  onMarkdownChange: (md: string) => void;
  canUpload?: boolean;
};

export default function WysiwygEditor({
  initialMarkdown,
  onMarkdownChange,
  canUpload = false,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const linkUrlRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const initDone = useRef(false);

  // Active formatting states
  const [fmt, setFmt] = useState({
    bold: false,
    italic: false,
    underline: false,
    h2: false,
    h3: false,
    h4: false,
    unorderedList: false,
    orderedList: false,
    quote: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
  });

  const getCurrentBlockTag = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return "";
    }

    let node = selection.anchorNode;

    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node as HTMLElement).tagName.toLowerCase();
        if (["h2", "h3", "h4", "p", "blockquote"].includes(tag)) {
          return tag;
        }
      }
      node = node.parentNode;
    }

    return "";
  }, []);

  // ── Init editor HTML from markdown ──────────
  useEffect(() => {
    if (editorRef.current && !initDone.current) {
      editorRef.current.innerHTML = markdownToHtml(initialMarkdown);
      initDone.current = true;
    }
  }, [initialMarkdown]);

  // ── Close dropdown on outside click ─────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        fontMenuRef.current &&
        !fontMenuRef.current.contains(e.target as Node)
      )
        setShowFontMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Sync editor HTML → markdown string ──────
  const sync = useCallback(() => {
    if (editorRef.current) {
      onMarkdownChange(htmlToMarkdown(editorRef.current.innerHTML));
    }
  }, [onMarkdownChange]);

  // ── Save / Restore selection (for modals) ───
  const saveSel = useCallback(() => {
    const s = window.getSelection();
    if (s && s.rangeCount > 0)
      savedRange.current = s.getRangeAt(0).cloneRange();
  }, []);
  const restoreSel = useCallback(() => {
    if (savedRange.current) {
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(savedRange.current);
    }
  }, []);

  const updateFmt = useCallback(() => {
    const blockTag = getCurrentBlockTag();
    const isCenter = document.queryCommandState("justifyCenter");
    const isRight = document.queryCommandState("justifyRight");

    setFmt({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      h2: blockTag === "h2",
      h3: blockTag === "h3",
      h4: blockTag === "h4",
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      quote: blockTag === "blockquote",
      alignLeft: !isCenter && !isRight,
      alignCenter: isCenter,
      alignRight: isRight,
    });
  }, [getCurrentBlockTag]);

  // ── execCommand helper ──────────────────────
  const exec = useCallback(
    (cmd: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val);
      sync();
      updateFmt();
    },
    [sync, updateFmt],
  );

  const toggleBlock = useCallback(
    (target: "h2" | "h3" | "h4" | "blockquote") => {
      const currentBlock = getCurrentBlockTag();
      if (currentBlock === target) {
        exec("formatBlock", "P");
        return;
      }

      const tag = target === "blockquote" ? "BLOCKQUOTE" : target.toUpperCase();
      exec("formatBlock", tag);
    },
    [exec, getCurrentBlockTag],
  );

  // ── Toolbar actions ─────────────────────────
  const handleLink = () => {
    saveSel();
    const s = window.getSelection();
    setLinkText(s?.toString() || "");
    setLinkUrl("");
    setShowLinkModal(true);
    setTimeout(() => linkUrlRef.current?.focus(), 100);
  };

  const confirmLink = () => {
    if (!linkUrl) return;
    restoreSel();
    const display = linkText || linkUrl;
    const sel = window.getSelection();

    if (sel && sel.toString()) {
      exec("createLink", linkUrl);
    } else {
      const a = document.createElement("a");
      a.href = linkUrl;
      a.textContent = display;
      a.style.color = "#2E968C";
      a.style.textDecoration = "underline";
      a.target = "_blank";
      if (savedRange.current) {
        savedRange.current.deleteContents();
        savedRange.current.insertNode(a);
        const r = document.createRange();
        r.setStartAfter(a);
        r.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
      sync();
    }
    setShowLinkModal(false);
  };

  const handleImage = (url: string) => {
    editorRef.current?.focus();
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Ảnh bài viết";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "12px";
    img.style.margin = "12px 0";
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      const r = document.createRange();
      r.setStartAfter(img);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    } else {
      editorRef.current?.appendChild(img);
    }
    // Add a new paragraph after image so user can continue typing
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    img.parentNode?.insertBefore(p, img.nextSibling);
    sync();
  };

  const handleFont = (ff: string) => {
    if (!ff) {
      setShowFontMenu(false);
      return;
    }
    exec("fontName", ff);
    setShowFontMenu(false);
  };

  // ── Keyboard shortcuts in editor ────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        exec("bold");
      }
      if (e.key === "i") {
        e.preventDefault();
        exec("italic");
      }
      if (e.key === "u") {
        e.preventDefault();
        exec("underline");
      }
    }
  };

  return (
    <div className="space-y-0">
      {/* ─── Toolbar ──────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 sm:p-2 bg-gray-50 border border-gray-200 rounded-t-xl sticky top-0 z-20">
        <ToolbarBtn onClick={() => exec("undo")} title="Hoàn tác (Ctrl+Z)">
          <Undo2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("redo")} title="Làm lại (Ctrl+Y)">
          <Redo2 size={16} />
        </ToolbarBtn>

        <Sep />

        {/* Font */}
        <div className="relative" ref={fontMenuRef}>
          <ToolbarBtn
            onClick={() => setShowFontMenu(!showFontMenu)}
            title="Đổi font chữ"
            active={showFontMenu}
          >
            <div className="flex items-center gap-1">
              <Type size={16} />
              <span className="text-[11px] hidden sm:inline font-medium">
                Font
              </span>
            </div>
          </ToolbarBtn>
          {showFontMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 w-56 animate-in fade-in slide-in-from-top-2 duration-150">
              {FONTS.map((f) => (
                <button
                  key={f.value || "default"}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleFont(f.value);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-secondary text-sm transition-colors flex items-center gap-3"
                >
                  <span
                    className="text-base w-8 text-center"
                    style={{ fontFamily: f.value || "inherit" }}
                  >
                    Aa
                  </span>
                  <span style={{ fontFamily: f.value || "inherit" }}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Sep />

        {/* Format */}
        <ToolbarBtn
          onClick={() => exec("bold")}
          title="In đậm (Ctrl+B)"
          active={fmt.bold}
        >
          <Bold size={16} strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("italic")}
          title="In nghiêng (Ctrl+I)"
          active={fmt.italic}
        >
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("underline")}
          title="Gạch chân (Ctrl+U)"
          active={fmt.underline}
        >
          <Underline size={16} />
        </ToolbarBtn>

        <Sep />

        {/* Headings */}
        <ToolbarBtn
          onClick={() => toggleBlock("h2")}
          title="Tiêu đề lớn"
          active={fmt.h2}
        >
          <Heading1 size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => toggleBlock("h3")}
          title="Tiêu đề phụ"
          active={fmt.h3}
        >
          <Heading2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => toggleBlock("h4")}
          title="Tiêu đề nhỏ"
          active={fmt.h4}
        >
          <span className="text-[11px] font-bold leading-none">H3</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("formatBlock", "P")}
          title="Đoạn văn bình thường"
        >
          <span className="text-[11px] font-bold leading-none">¶</span>
        </ToolbarBtn>

        <Sep />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => exec("insertUnorderedList")}
          title="Danh sách chấm"
          active={fmt.unorderedList}
        >
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("insertOrderedList")}
          title="Danh sách số"
          active={fmt.orderedList}
        >
          <ListOrdered size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => toggleBlock("blockquote")}
          title="Trích dẫn"
          active={fmt.quote}
        >
          <Quote size={16} />
        </ToolbarBtn>

        <Sep />

        {/* Align */}
        <ToolbarBtn
          onClick={() => exec("justifyLeft")}
          title="Căn trái"
          active={fmt.alignLeft}
        >
          <AlignLeft size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("justifyCenter")}
          title="Căn giữa"
          active={fmt.alignCenter}
        >
          <AlignCenter size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec("justifyRight")}
          title="Căn phải"
          active={fmt.alignRight}
        >
          <AlignRight size={16} />
        </ToolbarBtn>

        <Sep />

        {/* Insert */}
        <ToolbarBtn
          onClick={() => exec("insertHorizontalRule")}
          title="Đường kẻ ngang"
        >
          <Minus size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={handleLink} title="Chèn liên kết">
          <Link2 size={16} />
        </ToolbarBtn>

        {canUpload && (
          <div className="flex items-center scale-90 origin-left ml-auto">
            <ImageUpload onUpload={handleImage} label="Thêm ảnh" />
          </div>
        )}
      </div>

      {/* ─── Editor ───────────────────── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onKeyDown={onKeyDown}
        onMouseUp={updateFmt}
        onKeyUp={updateFmt}
        className="
                    w-full min-h-120 px-6 py-4
                    border border-t-0 border-gray-200 rounded-b-xl
                    bg-white
                    text-base leading-relaxed text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-[#00B14F]/40 focus:ring-inset
                    overflow-y-auto resize-y
                    [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#1B4D3E] [&_h2]:mt-5 [&_h2]:mb-2
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1B4D3E] [&_h3]:mt-3 [&_h3]:mb-1
                    [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#1B4D3E] [&_h4]:mt-2.5 [&_h4]:mb-1
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#2E968C] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-3
                    [&_a]:text-[#2E968C] [&_a]:underline [&_a]:cursor-pointer
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
                    [&_li]:my-1
                    [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full [&_img]:shadow-md [&_img]:cursor-pointer
                    [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-6
                    [&_p]:my-1.5
                "
        data-placeholder="Bắt đầu viết bài tại đây..."
        role="textbox"
        aria-label="Nội dung bài viết"
      />
      <style>{`
                [data-placeholder]:empty::before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    font-style: italic;
                }
            `}</style>

      {/* Shortcut hints */}
      <p className="text-xs text-gray-400 mt-1.5 flex gap-3 flex-wrap">
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">
            Ctrl+B
          </kbd>{" "}
          Đậm
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">
            Ctrl+I
          </kbd>{" "}
          Nghiêng
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">
            Ctrl+U
          </kbd>{" "}
          Gạch chân
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">
            Ctrl+Z
          </kbd>{" "}
          Hoàn tác
        </span>
      </p>

      {/* ─── Link Modal ──────────────── */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1B4D3E] flex items-center gap-2">
              <Link2 size={20} />
              Chèn liên kết
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Văn bản hiển thị
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Ví dụ: Xem chi tiết tại đây"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ URL
              </label>
              <input
                ref={linkUrlRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
                onKeyDown={(e) => e.key === "Enter" && confirmLink()}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmLink}
                disabled={!linkUrl}
                className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] text-white font-bold hover:bg-[#153a2f] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Link2 size={16} />
                Chèn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
