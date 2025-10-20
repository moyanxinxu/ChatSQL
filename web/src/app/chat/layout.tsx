"use client";
import { Agent } from "@/types/chat.types";
import { SideNav } from "@/components/nav/SideNav";
import { TopNav } from "@/components/nav/TopNav";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [selectedAgent, setSelectedAgent] = useState("ChatBotAgent");

    const [agents, setAgents] = useState<Agent[]>([
        {
            id: "ChatBotAgent",
            name: "对话机器人",
            description: "基础的对话机器人",
        },
    ]);

    const [chatThreads, setChatThreads] = useState<
        { id: string; title: string }[]
    >([]);

    const handleChangeThreadsList = async (selectedAgent: string) => {
        const response = await fetch(
            `http://localhost:5050/api/chat/threads?agent_id=${selectedAgent}`,
            { method: "GET" },
        );
        const data = await response.json();
        if (response.ok) {
            setChatThreads(data);
        } else {
            console.log("failed to query chat threads.");
        }
    };

    // 选中的智能体变化时，更新聊天线程列表
    useEffect(() => {
        if (selectedAgent) {
            handleChangeThreadsList(selectedAgent);
        }
    }, [selectedAgent]);

    const handleClickRefresh = async () => {
        console.log("clicked refresh icon button!");
        const response = await fetch("http://localhost:5050/api/chat/agent", {
            method: "GET",
        });
        const data = await response.json();
        // data: { id: string; name?: string; description?: string; }[]
        if (response.ok) {
            // 将数组内的智能体对象字典转化为Agent类型

            if (
                selectedAgent &&
                !data.find((agent) => agent.id === selectedAgent)
            ) {
                setSelectedAgent(data[0].id || null);
            }
            setAgents(data);
        } else {
            console.error("Failed to fetch agents:", data);
        }
    };

    return (
        <div className='agent flex h-full w-full flex-row'>
            <SideNav />
            <div className='agent-body flex h-full w-full flex-col'>
                <TopNav />
                {children}
            </div>
        </div>
    );
}
