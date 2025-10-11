import { v4 as uuidv4 } from "uuid";

interface Message {
    id: string;
    type: "human" | "ai" | "system";
    content: string;
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
        description: string = "",
        status: number = 1,
    ) {
        this.id = Thread.generateId();
        this.agent_id = agent_id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.create_at = Thread.generateCreateAt();
        this.update_at = Thread.generateUpdateAt();
    }

    static generateId(): string {
        return uuidv4();
    }

    static generateCreateAt(): string {
        return new Date().toISOString();
    }

    static generateUpdateAt(): string {
        return new Date().toISOString();
    }
}

export type { Message, Agent };
export { Thread };