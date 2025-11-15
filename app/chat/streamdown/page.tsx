"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Streamdown } from "streamdown";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

export default function StreamdownChatPage() {
  const [text, setText] = useState("");

  // Using AI SDK to talk to the backend with streamdown markdown rendering
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/agent/ai-sdk/responses",
    }),
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="border-b p-4">
        <h1 className="font-semibold text-xl">Streamdown Chat</h1>
        <p className="text-muted-foreground text-sm">
          Chat with markdown rendering powered by Streamdown
        </p>
      </div>

      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <Streamdown
                      key={index}
                      parseIncompleteMarkdown={true}
                      isAnimating={status !== "ready"}
                    >
                      {part.text}
                    </Streamdown>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
        {status !== "ready" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
              <p className="text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <PromptInput
          onSubmit={(message) => {
            const hasText = Boolean(message.text);
            if (!hasText) return;

            sendMessage({ text: message.text });
            setText("");
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {/* Future: Add action buttons here */}
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
