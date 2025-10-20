interface ConfigurableItem {
    type: "str" | "list";
    name: string;
    options: any[];
    default: any;
    description: string;
}

interface AgentConfigSchema {
    thread_id: string;
    user_id: string;
    system_prompt: string;
    provider: string;
    model: string;
    tools: string[];
    configurable_items: {
        [key: string]: ConfigurableItem;
    };
}

interface AgentConfig {
    id: string;
    name: string;
    description: string;
    config_schema: AgentConfigSchema;
}

export type { AgentConfig };
