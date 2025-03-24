import React, {useEffect, useState} from 'react';
import {blockUsers, deleteUsers, fetchUsers, getUserStatus, unblockUsers} from './api';
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
    const [selectAll, setSelectAll] = useState(false);

    useAuthError();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersLocal = await fetchUsers();
                setUsers(usersLocal);
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

            if (selectedUsers.length === 0) {
                alert("Please select at least one user");
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
                await deleteUsers(selectedUsers);
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
        setSelectedUsers(prev => {
            const newSelectedUsers = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId];
            setSelectAll(newSelectedUsers.length === users.length && users.length > 0);
            return newSelectedUsers;
        });
    };

    useEffect(() => {
        setSelectAll(selectedUsers.length === users.length && users.length > 0);
    }, [selectedUsers, users]);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
        setSelectAll(!selectAll);
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
                    <th>
                        <input
                            type="checkbox"
                            checked={selectAll && users.length > 0}
                            onChange={handleSelectAll}
                            disabled={users.length === 0}
                        />
                    </th>
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