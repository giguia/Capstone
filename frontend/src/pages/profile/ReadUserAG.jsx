import React, { useEffect } from 'react'

// components
import AgentSidebar from '../../components/agent/AgentSidebar';
import AgentNavbar from '../../components/agent/AgentNavbar';
import ViewUserAG from '../../components/profile/ViewUserAG'
import { useUsersContext } from "../../hooks/useUsersContext";

const ReadUserAG = () => {
    const { dispatch } = useUsersContext();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/userLG/');
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_USERS', payload: json });
            }
        };

        fetchUsers();
    }, [dispatch]);

    return (
        <div className="flex">
            <AgentSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <AgentNavbar />
                <div className="p-1">
                    <ViewUserAG />
                </div>
            </div>
        </div>
    );
}

export default ReadUserAG
