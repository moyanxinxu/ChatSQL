import Link from "next/link";
import { BaseChunk, BaseMessage, Thread } from "@/types/chat.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createThread, deleteThread, getChatMessages, getThreads } from "@/api/chat";
import { Delete, MessageSquarePlus, PanelLeftClose, PencilLine, RefreshCcw, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/shadcn-io/icon-button";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { PromptInput, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar } from "@/components/ui/shadcn-io/ai/prompt-input";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { truncateTitle } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ChatThreads = () => {
    const [input, setInput] = useState("");
    const [chatThreads, setChatThreads] = useState<Thread[]>([]);
    const [chatMessages, setChatMessages] = useState<BaseMessage[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();
    const router = useRouter();
    const agentId = params.agentId;
    const threadId = params.threadId;

    const handleCreateThread = async () => {
        const nextThread = new Thread(agentId, "新的对话...");

        const response = await createThread(nextThread);

        if (response) {
            setChatThreads([nextThread, ...chatThreads]);
            router.push(`/chat/${agentId}/${nextThread.id}`);
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
                router.push(`/chat/${agentId}/${filteredChatThreads[0].id}`);
            } else {
                router.push(`/chat`);
            }
            setChatThreads(filteredChatThreads);
        } else {
            console.error("删除线程失败");
        }
    };

    const handleMessageData = (chunk: BaseChunk) => {
        console.log(chunk);
        if (chunk.type === "ai" && chunk.content) {
            setChatMessages((prevMessages) =>
                prevMessages.map((message, i) =>
                    i === prevMessages.length - 1
                        ? {
                              ...message,
                              content: message.content + chunk.content,
                          }
                        : message,
                ),
            );
        }
    };

    const chatStream = async (query: string) => {
        if (isLoading) return;

        const humanMessage = new BaseMessage("human", query);
        const aiMessage = new BaseMessage("ai", "");

        setChatMessages((messages) => [...messages, humanMessage, aiMessage]);

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
        if (agentId) {
            const getAgentThreads = async () => {
                const threads = await getThreads();
                const currThreads = threads.filter(
                    (thread) => thread.agent_id === agentId,
                );

                setChatThreads(currThreads);
            };

            getAgentThreads();
        }
    }, [agentId]);

    useEffect(() => {
        if (agentId && threadId) {
            const fetchMessages = async () => {
                const messages = await getChatMessages(agentId, threadId);
                setChatMessages(messages);
            };
            fetchMessages();
        }
    }, [agentId, threadId]);

    const handleOnSubmit = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        const text = input.trim();
        if (text) {
            setIsLoading(true);
            setInput("");
            chatStream(text).finally(() => {
                setIsLoading(false);
            });
        }
    };

    return (
        <div className='thread-and-chat flex h-full w-full flex-row overflow-y-auto'>
            <div className='thread flex h-full flex-col border-r'>
                {/* 线程列表顶部区域 */}
                <div className='thread-top flex flex-row gap-4 border-b px-2 py-1 text-nowrap'>
                    {/* 创建新对话按钮 */}
                    <div className='next-chat-button flex flex-row gap-1'>
                        <Button onClick={handleCreateThread}>
                            <MessageSquarePlus />
                            <p>创建新对话</p>
                        </Button>
                    </div>

                    {/* 折叠侧边栏按钮 */}
                    <div className='toggle-sidebar flex flex-row'>
                        <Button variant='outline' onClick={() => {}}>
                            <p>折叠</p>
                            <PanelLeftClose />
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

                <div className='thread-bottom border-t px-2 py-1'>
                    {/* 线程底部区域 */}
                    <div className='clear-button flex flex-row items-center justify-between'>
                        <Button onClick={() => {}}>
                            <p>清空</p>
                            <Trash2 />
                        </Button>

                        <Button variant='outline' onClick={() => {}}>
                            <RefreshCcw />
                        </Button>
                    </div>
                </div>
            </div>
            <div className='chat-messages-and-input flex w-full flex-col justify-between'>
                <div className='flex flex-1 overflow-y-scroll'>
                    <div className='mx-auto flex w-[80%] max-w-4xl flex-col p-3'>
                        {chatMessages.map((message) => (
                            <Message
                                key={message.id}
                                from={
                                    message.type === "human"
                                        ? "user"
                                        : "assistant"
                                }>
                                {/* {message.type === "human" ? (
                                        <MessageAvatar
                                            src='https://github.com/dovazencot.png'
                                            name='User'
                                        />
                                    ) : (
                                        <MessageAvatar
                                            src='https://github.com/openai.png'
                                            name='AI'
                                        />
                                    )} */}
                                <MessageContent>
                                    <Response>{message.content}</Response>
                                </MessageContent>
                            </Message>
                        ))}
                    </div>
                </div>

                <div className='input-prompt flex max-w-full px-[10%] pb-2'>
                    <PromptInput onSubmit={handleOnSubmit}>
                        <PromptInputTextarea
                            placeholder='在此输入你的提示...'
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
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
