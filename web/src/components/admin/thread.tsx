"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { threadItem } from "@/types/dashboard/thread";
import { truncateTitle } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ThreadListProps {
    maxSize: number;
}


const threadListHeader = [
    "ID",
    "AgentID",
    "标题",
    // "描述",
    "创建时间",
    "更新时间",
];

const ThreadList = ({ maxSize }: ThreadListProps) => {
    const [threads, setThreads] = useState<threadItem[]>([]);

    const getAllThreads = async () => {
        const response = await fetch("http://localhost:5050/api/chat/threads", {
            method: "GET",
        });
        if (response.ok) {
            const threads = await response.json();
            console.log("Fetched threads:", threads);
            setThreads(threads);
            return threads;
        } else {
            console.log("failed to exec getAllThreads");
            return [];
        }
    };

    useEffect(() => {
        getAllThreads();
        console.log(threads);
    }, []);

    return (
        <div className='rounded-md border'>
            <Table>
                <TableCaption>对话记录</TableCaption>
                <TableHeader className='sticky top-0 z-10 bg-white'>
                    <TableRow>
                        {threadListHeader.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {threads.map((thread) => (
                        <TableRow key={thread.id}>
                            <TableCell>{thread.id}</TableCell>
                            <TableCell>{thread.agent_id}</TableCell>
                            <TableCell>
                                {truncateTitle(thread.title, 20)}
                            </TableCell>
                            {/* <TableCell>{thread.description}</TableCell> */}
                            <TableCell>{thread.create_at}</TableCell>
                            <TableCell>{thread.update_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {/* <TableCell colSpan={6}>Total</TableCell> */}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export { ThreadList };
