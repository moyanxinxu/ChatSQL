import clsx from "clsx";
import { Agent, Thread } from "@/types/chat.types";
import { Card } from "@/components/ui/card";
import { getAgents, getThreads } from "@/api/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const AgentsCard = () => {
    const router = useRouter();
    const { agentId, threadId } = useParams();
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        getAgents().then(setAgents);
    }, []);

    const handleAgentClick = async (agent: string) => {
        if (agent !== agentId) {
            const threads = await getThreads();

            if (threads.length > 0) {
                router.replace(`/chat/${agent}/${threads[0].id}`);
            } else {
                const newThread = new Thread(agent, "新的对话...", "描述", 1);
                await fetch("http://localhost:5050/api/chat/thread", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newThread),
                });
                router.replace(`/chat/${agent}/${newThread.id}`);
            }
        }
    };

    return (
        <Suspense fallback={<AgentsCardSkeleton />}>
            <div className='grid grid-cols-2 gap-2'>
                {/* 这里的agent的数据类型为Agent */}
                {agents.map((agent: Agent) => (
                    <div
                        key={agent.id}
                        onClick={() => handleAgentClick(agent.id)}>
                        <Card
                            className={clsx(
                                agent.id === agentId &&
                                    "border border-dashed border-purple-500",
                                "hover:bg-gray-200: flex px-4",
                            )}>
                            <div className='flex flex-row justify-start'>
                                {agent.name}({agent.id})
                            </div>
                            <div>描述：{agent.description}</div>
                        </Card>
                    </div>
                ))}
            </div>

            {agents.length === 0 && (
                <div className='flex items-center justify-center rounded-md border border-dashed'>
                    尚未注册任何智能体！
                </div>
            )}
        </Suspense>
    );
};

function AgentsCardSkeleton() {
    return (
        <div className='w-full p-4'>
            <div className='mx-auto max-w-xl'>
                <Card className='p-4'>
                    <div className='flex items-center space-x-4'>
                        <Skeleton className='h-10 w-10 rounded-full' />
                        <div className='flex-1'>
                            <Skeleton className='mb-2 h-4 w-3/4' />
                            <Skeleton className='h-3 w-1/2' />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export { AgentsCard };
