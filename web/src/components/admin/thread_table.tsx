"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { threadItem } from "@/types/dashboard/thread";
import { truncateTitle } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getThreads } from "@/app/api/chat";

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

    useEffect(() => {
        const fetchThreads = async () => {
            const threads = await getThreads();
            setThreads(threads);
        };
        fetchThreads();
    }, []);

    return (
        <div className='rounded-md border'>
            <Table>
                <TableCaption>对话记录</TableCaption>
                <TableHeader className='sticky'>
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
