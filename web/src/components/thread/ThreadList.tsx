"use client";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Delete,
    MessageSquarePlus,
    PanelLeftClose,
    PencilLine,
} from "lucide-react";
import { IconButton } from "@/components/ui/shadcn-io/icon-button";
import { Thread } from "@/types/chat.types";
import { useParams, useRouter } from "next/navigation";

interface ThreadListProps {
    selectedAgent: string;
    chatThreads: Thread[];
    setChatThreads: (threads: Thread[]) => void;
}

const ThreadList = ({
    selectedAgent,
    chatThreads,
    setChatThreads,
}: ThreadListProps) => {
    const router = useRouter();
    const params = useParams();

    const handleCreateThread = async () => {
        const newThread = new Thread(selectedAgent, "新的对话...", "描述", 1);

        const response = await fetch("http://localhost:5050/api/chat/thread", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newThread),
        });

        if (response.ok) {
            const createdThread = await response.json();
            setChatThreads([createdThread, ...chatThreads]);
            router.push(`/chat/${selectedAgent}/${createdThread.id}`);
        } else {
            console.error("创建线程失败");
        }
    };

    const handlePanelToggle = () => {
        console.log("用户点击了侧边栏的折叠按钮");
    };

    const truncateTitle = (title: string, maxLength: number) => {
        if (title.length <= maxLength) return title;
        return title.slice(0, maxLength) + "...";
    };

    const handleDeleteThread = async (threadId: string) => {
        await fetch(`http://localhost:5050/api/chat/thread/${threadId}`, {
            method: "DELETE",
        });

        const filteredChatThreads = chatThreads.filter(
            (thread) => thread.id !== threadId,
        );
        if (filteredChatThreads.length > 0) {
            router.push(`/chat/${selectedAgent}/${filteredChatThreads[0].id}`);
        } else {
            router.push(`/chat`);
        }
        setChatThreads(filteredChatThreads);
    };

    return (
        <div className='conversation-list flex flex-col border-r'>
            {/* 线程列表顶部区域 */}
            <div className='conversation-top flex flex-row gap-4 border-b px-2 py-1'>
                {/* 创建新对话按钮 */}
                <div className='new-chat-button flex flex-row text-nowrap'>
                    <Button onClick={handleCreateThread}>
                        <MessageSquarePlus />
                        创建新对话
                    </Button>
                </div>

                {/* 折叠侧边栏按钮 */}
                <div className='toggle-sidebar flex flex-row text-nowrap'>
                    <Button variant='outline' onClick={handlePanelToggle}>
                        折叠
                        <PanelLeftClose />
                    </Button>
                </div>
            </div>

            {/* 线程列表区域 */}
            <div className='thread-list flex flex-col overflow-y-scroll p-1'>
                {chatThreads.map((thread) => (
                    <Link
                        href={`/chat/${selectedAgent}/${thread.id}`}
                        className={clsx(
                            "thread-item flex flex-row items-center justify-between px-2 py-1 text-nowrap",
                            thread.id === params.threadId &&
                                "rounded-lg border border-dashed border-blue-500",
                        )}
                        key={thread.id}>
                        {truncateTitle(thread.title, 10)}

                        <div className='flex flex-row opacity-0 transition-opacity duration-200 hover:opacity-100'>
                            {/* 蓝色修改标题按钮 */}
                            <IconButton icon={PencilLine} size='sm' />

                            {/* 红色删除按钮 */}
                            <IconButton
                                icon={Delete}
                                color={[255, 0, 0]}
                                onClick={() => handleDeleteThread(thread.id)}
                                size='sm'
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export { ThreadList };