import React, {useEffect, useState} from 'react';
import {blockUsers, deleteUsers, fetchUsers, getUserStatus, unblockUsers} from './api';
import useAuthError from '../../hooks/useAuthError';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaLock, FaTrash, FaUnlock} from 'react-icons/fa';

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
                toast.error("Error fetching users. Please try again later.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
                console.error("Error fetching users:", error);
            }
        };
        loadUsers();
    }, []);

    const logoutAndRedirect = () => {
        localStorage.removeItem('token');
    };

    const checkUserAndRedirect = async () => {
        try {
            const isBlocked = await getUserStatus();
            if (isBlocked) {
                logoutAndRedirect();
            }
        } catch (error) {
            toast.error("Error checking user status", {
                position: "bottom-right",
                autoClose: 5000,
            });
            console.error("Error checking user status:", error);
        }
    };

    const handleAction = async (action: "block" | "unblock" | "delete") => {
        try {
            await checkUserAndRedirect();

            if (selectedUsers.length === 0) {
                toast.warning("Please select at least one user", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                return;
            }

            if (action === "unblock") {
                const areAllBlocked = selectedUsers.every(id =>
                    users.find(user => user.id === id)?.isBlocked
                );
                if (!areAllBlocked) {
                    toast.warning("You can only unblock blocked users", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                    return;
                }
            }

            if (action === "block") {
                const areAllActive = selectedUsers.every(id =>
                    !users.find(user => user.id === id)?.isBlocked
                );
                if (!areAllActive) {
                    toast.warning("You can only block active users", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                    return;
                }
            }

            if (action === "delete") {
                await deleteUsers(selectedUsers);
                toast.success("Users deleted successfully", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            } else if (action === "block") {
                await blockUsers(selectedUsers);
                toast.success("Users blocked successfully", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            } else if (action === "unblock") {
                await unblockUsers(selectedUsers);
                toast.success("Users unblocked successfully", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }

            const updatedUsers = await fetchUsers();
            setUsers(updatedUsers);
            setSelectedUsers([]);
        } catch (error) {
            toast.error(`Error ${action} users. Please try again.`, {
                position: "bottom-right",
                autoClose: 5000,
            });
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
            <ToastContainer/>
            <h2>User Management</h2>
            <div className="mb-3 d-flex ">
                <button
                    className="btn btn-danger me-2 d-flex align-items-center justify-content-center"
                    onClick={() => handleAction("block")}
                >
                    <FaLock className="me-2"/>
                    Block
                </button>
                <button
                    className="btn btn-warning me-2 d-flex align-items-center justify-content-center"
                    onClick={() => handleAction("unblock")}
                >
                    <FaUnlock/>
                </button>
                <button
                    className="btn btn-dark d-flex align-items-center"
                    onClick={() => handleAction("delete")}
                >
                    <FaTrash/>
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