"use client";

function renderMarkdown(text: string): React.ReactNode[] {
  // Split by **bold** patterns and render
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "assistant" && (
        <div className="mr-2.5 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500">
          <span className="text-[10px] font-bold text-white">C</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{renderMarkdown(content)}</div>
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-current opacity-70" />
        )}
      </div>
    </div>
  );
}
