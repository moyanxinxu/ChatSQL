"use client";
import { MagneticButton } from "@/components/ui/shadcn-io/magnetic-button";
import { MessageCircleDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
    const router = useRouter();

    const handleNextChat = async () => {
        const nextId = uuidv4();
        router.push(`/chat/ChatBotAgent/${nextId}`);
    };

    return (
        <div className='flex h-full w-full items-center justify-center bg-gray-50 dark:bg-black'>
            <MagneticButton
                particleCount={8}
                attractRadius={80}
                onClick={handleNextChat}>
                <div className='flex flex-row items-center gap-2'>
                    开始对话
                    <MessageCircleDashed size={18} />
                </div>
            </MagneticButton>
        </div>
    );
}
