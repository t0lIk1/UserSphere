import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {blockUsers, deleteUser, fetchUsers, getUserStatus, unblockUsers} from './api';
import useAuthError from '../../hooks/useAuthError';

interface User {
    id: number;
    name: string;
    email: string;
    lastSeen: string;
    isBlocked: boolean;
}

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const navigate = useNavigate();
    useAuthError();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        loadUsers();
    }, []);

    const logoutAndRedirect = () => {
        localStorage.removeItem('token');
    };

    const checkUserAndRedirect = async () => {
        const isBlocked = await getUserStatus();
        if (isBlocked) {
            logoutAndRedirect();
        }
    };

    const handleAction = async (action: "block" | "unblock" | "delete") => {
        try {
            await checkUserAndRedirect();

            if (action === "delete" && selectedUsers.length !== 1) {
                alert("Please select exactly one user to delete");
                return;
            }

            if (action === "unblock") {
                const areAllBlocked = selectedUsers.every(id =>
                    users.find(user => user.id === id)?.isBlocked
                );
                if (!areAllBlocked) {
                    alert("You can only unblock blocked users");
                    return;
                }
            }

            if (action === "block") {
                const areAllActive = selectedUsers.every(id =>
                    !users.find(user => user.id === id)?.isBlocked
                );
                if (!areAllActive) {
                    alert("You can only block active users");
                    return;
                }
            }

            if (action === "delete") {
                await deleteUser(selectedUsers[0]);
            } else if (action === "block") {
                await blockUsers(selectedUsers);
            } else if (action === "unblock") {
                await unblockUsers(selectedUsers);
            }

            const updatedUsers = await fetchUsers();
            setUsers(updatedUsers);
            setSelectedUsers([]);
        } catch (error) {
            console.error(`Error ${action} users:`, error);
        }
    };

    const handleSelectUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const blockedStyle = {
        color: "#6c757d",
        opacity: 0.5,
    };

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            <div className="mb-3">
                <button className="btn btn-danger me-2" onClick={() => handleAction("block")}>
                    Block
                </button>
                <button className="btn btn-warning me-2" onClick={() => handleAction("unblock")}>
                    Unblock
                </button>
                <button className="btn btn-dark" onClick={() => handleAction("delete")}>
                    Delete
                </button>
            </div>

            <table className="table table-striped">
                <thead className="table-dark">
                <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id} style={user.isBlocked ? blockedStyle : {}}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                            />
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                                <span className={`badge ${user.isBlocked ? "bg-danger" : "bg-success"}`}>
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;