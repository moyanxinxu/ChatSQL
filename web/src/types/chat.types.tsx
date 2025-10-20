import { v4 as uuidv4 } from "uuid";

interface Message {
    id: string;
    type: "human" | "ai" | "system";
    content: string;
}

interface BaseChunk {
    content: string;
    status: "init" | "loading" | "finished";
    type: "human" | "ai" | "system";
    configurable?: any;
}

class BaseMessage {
    id: string;
    type: "human" | "ai" | "system";
    content: string | "";

    constructor(type: "human" | "ai" | "system", content: string, id?: string) {
        this.type = type;
        this.content = content;
        this.id = id || uuidv4();
    }
}

interface Agent {
    id: string;
    name: string;
    description: string;
}

class Thread {
    id: string;
    agent_id: string;
    title: string;
    create_at: string;
    update_at: string;
    status: number;
    description: string;

    constructor(
        agent_id: string,
        title: string,
        id?: string,
        description?: string,
        status?: number,
    ) {
        this.agent_id = agent_id;
        this.title = title;
        this.id = id || uuidv4();
        this.description = description || "";
        this.status = status || 1;
        this.create_at = new Date().toISOString();
        this.update_at = new Date().toISOString();
    }
}

export type { Message, Agent, BaseChunk };
export { Thread, BaseMessage };