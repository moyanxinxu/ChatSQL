"use client";
import { ChatThreads } from "@/components/thread/ChatThreads";
export default function Home() {
    return (
        <div className='chat-and-threads-layout flex h-full w-full flex-col overflow-y-auto'>
            <ChatThreads />
        </div>
    );
}
