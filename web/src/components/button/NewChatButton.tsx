"use client";
import { MagneticButton } from "@/components/ui/shadcn-io/magnetic-button";
import { MessageCircleDashed } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createThread } from "@/app/api/chat";
import { Thread } from "@/types/chat.types";

const NewChatButton = () => {
    const router = useRouter();
    const params = useParams();

    const handleNextChat = async () => {
        const nextId = uuidv4();
        const agentId = params.agentId?.toString() || "ChatBotAgent";
        const nextThread = new Thread(agentId, "新的对话...", nextId);

        await createThread(nextThread);
        router.replace(`/chat/${agentId}/${nextId}`);
    };

    return (
        <div className='homepage flex h-full w-full flex-col'>
            <div className='flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-black'>
                <MagneticButton
                    particleCount={8}
                    attractRadius={80}
                    onClick={handleNextChat}>
                    <div className='flex flex-row items-center gap-2'>
                        <h1>开始新对话</h1>
                        <MessageCircleDashed size={18} />
                    </div>
                </MagneticButton>
            </div>
        </div>
    );
};

export { NewChatButton };
