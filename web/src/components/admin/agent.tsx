"use client";

import { AgentConfig } from "@/types/dashboard/agent";
import { OpenAI, SiliconCloud, Gemini } from "@lobehub/icons";
import { useEffect, useState } from "react";

const provider2icon = {
    siliconflow: {
        icon: <SiliconCloud.Combine size={38} type={"color"} />,
        color: "indigo",
    },
    openai: {
        icon: <OpenAI.Combine size={38} />,
        color: "gray",
    },

    google: {
        icon: <Gemini.Combine size={38} type={"color"} />,
        color: "blue",
    }
};

const AgentsCard = () => {
    const [agentConfigs, setAgentConfigs] = useState<AgentConfig[]>([]);

    const getAgentsConfig = async () => {
        const response = await fetch("http://localhost:5050/api/chat/agent", {
            method: "GET",
        });
        if (response.ok) {
            const agent_configs = await response.json();
            setAgentConfigs(agent_configs);

            return agent_configs;
        } else {
            console.log("failed to exec getAgents");
            return [];
        }
    };

    useEffect(() => {
        getAgentsConfig();
    }, []);

    return (
        <div className='agent-configs grid grid-cols-2 gap-3 p-2'>
            {agentConfigs.map((agent) => (
                <div
                    key={agent.id}
                    className={`flex flex-row justify-between rounded-lg border-1 bg-${provider2icon[agent.config_schema.provider].color}-100 p-4 transition-all duration-300`}>
                    <div className="text-gray-900">
                        <h1 className='text-lg font-semibold '>
                            {agent.name}[{agent.id}]
                        </h1>

                        {/* <div className='agent-provider-and-model flex flex-row items-center gap-2'> */}
                        <h2>
                            {agent.config_schema.model}
                        </h2>
                        {/* </div> */}

                        <p className='text-sm'>
                            {agent.description}
                        </p>
                    </div>

                    <div className='agent-brand flex items-center p-1'>
                        {provider2icon[agent.config_schema.provider].icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export { AgentsCard };
