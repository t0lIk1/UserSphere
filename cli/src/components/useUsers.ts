import {useEffect, useState} from 'react';
import {blockUsers, deleteUser, fetchUsers, unblockUsers} from './api.ts';

interface User {
    id: number;
    name: string;
    email: string;
    lastSeen: string;
    isBlocked: boolean;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            const users = await fetchUsers();
            setUsers(users);
        };
        loadUsers();
    }, []);

    const handleBlockUsers = async (userIds: number[]) => {
        await blockUsers(userIds);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
    };

    const handleUnblockUsers = async (userIds: number[]) => {
        await unblockUsers(userIds);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
    };

    const handleDeleteUser = async (userId: number) => {
        await deleteUser(userId);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
    };

    return {users, handleBlockUsers, handleUnblockUsers, handleDeleteUser};
};