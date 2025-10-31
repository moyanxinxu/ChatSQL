import { Thread } from "@/types/chat.types";
import { v4 as uuid } from "uuid";

const chat_router = "http://localhost:5050/api/chat";

const getAgents = async () => {
    const resp = await fetch(`${chat_router}/agent`);
    if (resp.ok) {
        const data = await resp.json();
        return data;
    } else {
        console.error("获取智能体列表失败啦，你知不知道~");
        return [];
    }
};

const getThreads = async () => {
    const resp = await fetch(`${chat_router}/threads`);
    if (resp.ok) {
        const data = await resp.json();
        return data;
    } else {
        console.error("获取线程列表失败啦，你知不知道~");
        return [];
    }
};

const getLatestThread = async (agentId: string) => {
    const resp = await fetch(
        `${chat_router}/threads/latest?agent_id=${agentId}`,
    );
    if (resp.ok) {
        const latestThreadId = await resp.json();

        if (latestThreadId) {
            return latestThreadId;
        } else {
            return uuid();
        }
    } else {
        console.error("获取最新线程失败啦，你知不知道~");
        return uuid();
    }
};

const getAIMessage = async (
    agentId: string,
    threadId: string,
    query: string,
) => {
    try {
        const resp = await fetch(
            `${chat_router}/agent/${agentId}?agent_id=${agentId}`,
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

        if (!resp.ok) {
            console.error("获取AI消息失败，状态码：", resp.status);
            return null;
        }

        if (!resp.body) {
            console.error("响应体为空，无法读取流数据");
            return null;
        }

        const reader = resp.body.getReader();
        return reader;
    } catch (error) {
        console.error("获取AI消息时发生错误：", error);
        return null;
    }
};

const getChatMessages = async (agentId: string, threadId: string) => {
    const resp = await fetch(
        `${chat_router}/agent/${agentId}/history?thread_id=${threadId}`,
    );

    if (resp.ok) {
        const data = await resp.json();
        return data.history;
    } else {
        console.error("failed to get chat messages!");
        return [];
    }
};

const createThread = async (nextThread: Thread) => {
    const resp = await fetch(`${chat_router}/thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextThread),
    });

    if (resp.ok) {
        return true;
    } else {
        return false;
    }
};

const deleteThread = async (threadId: string) => {
    const resp = await fetch(`${chat_router}/thread/${threadId}`, {
        method: "DELETE",
    });

    if (resp.ok) {
        return true;
    } else {
        return false;
    }
};

export {
    getThreads,
    getAIMessage,
    getChatMessages,
    getAgents,
    getLatestThread,
    createThread,
    deleteThread,
};
