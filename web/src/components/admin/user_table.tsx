"use client";
import { userItem } from "@/types/dashboard/user";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const usersListHeader = [
    "id",
    "username",
    "role",
    "created_at",
    "last_login",
];

const UserList = () => {
    const [users, setUsers] = useState<userItem[]>([]);
    const { getUsers } = useUserStore();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                console.log("Fetched users:", users); // 调试日志
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);


    return (
        <div className='rounded-md border'>
            <Table>
                <TableCaption>用户列表</TableCaption>
                <TableHeader className='sticky'>
                    <TableRow>
                        {usersListHeader.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: userItem) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.created_at}</TableCell>
                            <TableCell>{user.last_login}</TableCell>
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
}


export { UserList };