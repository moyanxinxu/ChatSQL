import Link from "next/link";
import { BaseChunk, BaseMessage, Thread } from "@/types/chat.types";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Delete,
    MessageSquarePlus,
    PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    createThread,
    deleteThread,
    getChatMessages,
    getThreads,
} from "@/app/api/chat";
import { IconButton } from "@/components/ui/shadcn-io/icon-button";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import {
    PromptInput,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { truncateTitle } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tool } from "@/components/tools/Tool";

const ChatThreads = () => {
    const [chatThreads, setChatThreads] = useState<Thread[]>([]);
    const [chatMessages, setChatMessages] = useState<BaseMessage[]>([]);
    const [isThreadListHidden, setIsThreadListHidden] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();
    const router = useRouter();
    const [agentId] = useState(params.agentId);
    const [threadId] = useState(params.threadId);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleCreateThread = async () => {
        const nextThread = new Thread(agentId, "新的对话...");

        const response = await createThread(nextThread);

        if (response) {
            setChatThreads([nextThread, ...chatThreads]);
            router.replace(`/chat/${agentId}/${nextThread.id}`);
        } else {
            console.error("创建线程失败");
        }
    };
    const handleDeleteThread = async (threadId: string) => {
        const response = await deleteThread(threadId);

        if (response) {
            const filteredChatThreads = chatThreads.filter(
                (thread) => thread.id !== threadId,
            );
            if (filteredChatThreads.length > 0) {
                router.replace(`/chat/${agentId}/${filteredChatThreads[0].id}`);
            } else {
                router.replace(`/chat/${agentId}`);
            }
            setChatThreads(filteredChatThreads);
        } else {
            console.error("删除线程失败");
        }
    };
    const handleMessageData = (chunk: BaseChunk) => {
        setChatMessages((prev) => {
            const updatedMessages = [...prev];

            if (chunk.type === "human") {
                updatedMessages.push(new BaseMessage("human", chunk.content));
            }

            if (chunk.type === "tool") {
                updatedMessages.push(
                    new BaseMessage("tool", chunk.content, chunk.name),
                );
            }

            if (chunk.type === "ai") {
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (!lastMessage || lastMessage.type !== "ai") {
                    updatedMessages.push(new BaseMessage("ai", chunk.content));
                } else {
                    // 创建一个新的消息对象，而不是直接修改旧消息对象
                    const updatedLastMessage = new BaseMessage(
                        lastMessage.type,
                        lastMessage.content + chunk.content,
                    );
                    updatedMessages[updatedMessages.length - 1] =
                        updatedLastMessage;
                }
            }
            console.log("更新后的消息列表:", updatedMessages);
            return updatedMessages;
        });
    };

    const handlePanelToggle = () => {
        setIsThreadListHidden(!isThreadListHidden);
    };

    const chatStream = async (query: string) => {
        if (isLoading) return;

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
            // setIsLoading(false);
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

    useEffect(() => {
        const fetchData = async () => {
            if (agentId) {
                const threads = await getThreads();
                const currThreads = threads.filter(
                    (thread) => thread.agent_id === agentId,
                );
                setChatThreads(currThreads);

                if (
                    threads.length > 0 &&
                    threads.find((t) => t.id === threadId)
                ) {
                    const messages = await getChatMessages(agentId, threadId);
                    setChatMessages(messages);
                }
            }
        };

        fetchData();
    }, [agentId, threadId]);

    return (
        <div className='thread-and-chat flex h-full w-full flex-row overflow-y-auto'>
            <div
                className={cn(
                    "thread flex h-full flex-col border-r transition-all duration-300",
                    isThreadListHidden
                        ? "w-0 overflow-hidden opacity-0"
                        : "w-64 opacity-100",
                )}>
                {/* 线程列表顶部区域 */}
                <div className='thread-top flex flex-row justify-end gap-4 border-b px-2 py-1 text-nowrap'>
                    {/* 创建新对话按钮 */}
                    <div className='next-chat-button flex flex-row'>
                        <Button onClick={handleCreateThread}>
                            <MessageSquarePlus />
                            <p>创建新对话</p>
                        </Button>
                    </div>
                </div>

                <div className='thread-list flex h-full flex-col overflow-y-scroll p-1'>
                    {chatThreads.map((thread) => (
                        <div
                            className={cn(
                                "thread-item flex flex-row items-center justify-between px-2 py-1 text-nowrap",
                                {
                                    "border-r-2 border-teal-500 bg-teal-500/20":
                                        thread.id === threadId,
                                },
                            )}
                            key={thread.id}>
                            <Link
                                href={`/chat/${agentId}/${thread.id}`}
                                className='w-full'
                                onClick={(e) => {
                                    if (thread.id === threadId) {
                                        e.preventDefault(); // 阻止导航
                                    }
                                }}>
                                {truncateTitle(thread.title, 10)}
                            </Link>

                            <div className='flex flex-row opacity-0 transition-opacity duration-200 hover:opacity-100'>
                                {/* 蓝色修改标题按钮 */}
                                <IconButton
                                    icon={PencilLine}
                                    size='sm'
                                    onClick={() => {}}
                                />

                                {/* 红色删除按钮 */}
                                <IconButton
                                    icon={Delete}
                                    color={[255, 0, 0]}
                                    onClick={() =>
                                        handleDeleteThread(thread.id)
                                    }
                                    size='sm'
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={cn(
                    "panel flex items-center justify-center",
                    !isThreadListHidden && "hidden",
                )}>
                <ChevronRight onClick={handlePanelToggle} />
            </div>

            <div
                className={cn(
                    "panel flex items-center justify-center",
                    isThreadListHidden && "hidden",
                )}>
                <ChevronLeft onClick={handlePanelToggle} />
            </div>

            <div className='chat-messages-and-input flex w-full flex-col justify-between'>
                <div className='flex flex-1 overflow-y-scroll'>
                    <div className='mx-auto flex w-[80%] max-w-4xl flex-col p-3'>
                        {chatMessages.map((message) => {
                            switch (message.type) {
                                case "human":
                                    return (
                                        <Message key={message.id} from='user'>
                                            <MessageContent>
                                                <Response>
                                                    {message.content}
                                                </Response>
                                            </MessageContent>
                                        </Message>
                                    );

                                case "ai":
                                    if (
                                        !message.tool_calls ||
                                        message.tool_calls.length === 0
                                    ) {
                                        return (
                                            <Message
                                                key={message.id}
                                                from='assistant'>
                                                <MessageContent>
                                                    <Response>
                                                        {message.content}
                                                    </Response>
                                                </MessageContent>
                                            </Message>
                                        );
                                    }
                                    return null;

                                case "tool":
                                    return (
                                        <div
                                            className='tool p-1'
                                            key={message.id}>
                                            <Tool
                                                tool_name={message.name}
                                                tool_content={message.content}
                                            />
                                        </div>
                                    );

                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div>

                <div className='input-prompt flex max-w-full px-[10%] pb-2'>
                    <PromptInput
                        onSubmit={(event) => {
                            event.preventDefault();
                            const inputValue = inputRef.current?.value.trim();
                            if (inputValue) {
                                setIsLoading(true);
                                inputRef.current.value = ""; // 清空输入框
                                chatStream(inputValue).finally(() => {
                                    setIsLoading(false);
                                });
                            }
                        }}>
                        <PromptInputTextarea
                            placeholder='在此输入你的提示...'
                            ref={inputRef}
                        />
                        <PromptInputToolbar>
                            <div></div>
                            <PromptInputSubmit disabled={isLoading} />
                        </PromptInputToolbar>
                    </PromptInput>
                </div>
            </div>
        </div>
    );
};

export { ChatThreads };
