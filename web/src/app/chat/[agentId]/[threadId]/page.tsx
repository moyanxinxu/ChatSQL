"use client";

import React, { useEffect, useState } from "react";
import { Message } from "@/types/chat.types";
import { PromptInput } from "@/components/thread/PromptInput";
import { Thread } from "@/components/thread/Thread";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
    const param = useParams();

    const [agentId, setAgentId] = useState(param.agentId);
    const [threadId, setThreadId] = useState(param.threadId);

    // console.log(" agentId: ", agentId, "threadId: ", threadId);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStream, setIsStream] = useState(false);

    async function fetchThreadMessages(agentId: string, threadId: string) {
        const response = await fetch(
            `http://localhost:5050/api/chat/agent/${agentId}/history?thread_id=${threadId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        if (response.ok) {
            const data = await response.json();
            setMessages(data.history);
        }
    }

    // async function removeAllMessages(agentId: string, threadId: string) {
    //     await fetch(
    //         `http://localhost:5050/api/chat/thread/${threadId}/all?agent_id=${agentId}`,
    //         { method: "DELETE" },
    //     );
    // }

    useEffect(() => {
        if (agentId && threadId) {
            fetchThreadMessages(agentId.toString(), threadId.toString());
        }
    }, [agentId, threadId]);

    // 清空输入框
    const clearInput = () => {
        setInput("");
    };

    const send = (event?: React.FormEvent) => {
        if (event) event.preventDefault();
        const text = input.trim();
        if (!text) {
            return;
        } else {
            clearInput();
            chatStream(text);
            setIsStream(false);
        }
    };

    const handleMessageData = (content: Message) => {
        if (content.type === "ai" && content.content) {
            setMessages((messages) =>
                messages.map((message, i) =>
                    i === messages.length - 1
                        ? {
                              ...message,
                              content: message.content + content.content,
                          }
                        : message,
                ),
            );
        }
    };

    const chatStream = async (query: string) => {
        // 如果正在流式输出，直接返回
        if (isStream) return;
        setIsStream(true);

        // 创建用户消息
        const humanId = uuidv4();
        const humanMessage: Message = {
            id: humanId,
            type: "human",
            content: query,
        };

        // 创建模型的回复消息
        const assistantId = uuidv4();
        const aiMessage: Message = {
            id: assistantId,
            type: "ai",
            content: "",
        };

        setMessages((messages) => [...messages, humanMessage, aiMessage]);

        const response = await fetch(
            `http://localhost:5050/api/chat/agent/${agentId}?agent_id=${agentId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agent_id: agentId,
                    thread_id: threadId,
                    query: query,
                }),
            },
        );
        const reader = response.body?.getReader();
        if (!reader) {
            setIsStream(false);
            return;
        }
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // 按行拆分，最后一行可能不完整，保留到 buffer
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line) continue;
                try {
                    const data = JSON.parse(line);
                    handleMessageData(data);
                } catch (err) {
                    console.error("解析流数据失败：", err, line);
                }
            }
        }

        // 处理剩余的 buffer（如果是完整 JSON）
        if (buffer) {
            try {
                const data = JSON.parse(buffer);
                handleMessageData(data);
            } catch (err) {
                // 忽略不完整或错误的尾部
                console.warn("流尾部解析失败（可能是不完整）：", err);
            }
        }

        reader.cancel();
    };

    return (
        <div className='flex h-full w-full flex-col overflow-y-auto'>
            {/* 消息列表 */}
            <div className='flex-1 overflow-y-auto'>
                <Thread messages={messages} />
            </div>

            {/* 输入框 */}
            <div className=''>
                <PromptInput
                    input={input}
                    setInput={setInput}
                    clickOnSubmit={send}
                    messages={messages}
                    setMessages={setMessages}
                    agentId={agentId.toString()}
                    threadId={threadId.toString()}
                />
            </div>
        </div>
    );
}
