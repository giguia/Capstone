import React, { useEffect, useState } from 'react';
import AgentSidebar from '../../components/agent/AgentSidebar';
import AgentNavbar from '../../components/agent/AgentNavbar';
import AGDashboardTabs from "../../components/agent/AGDashboardTabs";
import { useLeadsContext } from "../../hooks/useLeadsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { CircularProgress } from "@mui/material";

const AgentDashboard = () => {
    const { dispatch } = useLeadsContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [bookedUnits, setBookedUnits] = useState(null);
    const [unassignedLeads, setUnassignedLeads] = useState(null);
    const [userBookedUnits, setUserBookedUnits] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookedUnitsRes, unassignedLeadsRes ] = await Promise.all([
                    fetch('/api/leads/booked-units-performance', {
                        headers: { 'Authorization': `Bearer ${userLG.token}` },
                    }),
                    fetch('/api/leads/unassigned', {
                        headers: { 'Authorization': `Bearer ${userLG.token}` },
                    })
                ]);

                const [bookedUnitsData, unassignedLeadsData ] = await Promise.all([
                    bookedUnitsRes.json(),
                    unassignedLeadsRes.json(),
                ]);

                if (bookedUnitsRes.ok && unassignedLeadsRes.ok) {
                    setBookedUnits(bookedUnitsData);
                    setUnassignedLeads(unassignedLeadsData);
                    dispatch({ type: 'SET_BOOKED_UNITS', payload: bookedUnitsData });
                    dispatch({ type: 'SET_UNASSIGNED_LEADS', payload: unassignedLeadsData });
                } else {
                    console.error('Failed to fetch data', { bookedUnitsData, unassignedLeadsData });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, userLG]);

    useEffect(() => {
        if (bookedUnits && userLG) {
            const userBooked = bookedUnits.find(booked => booked.telemarketerName === userLG.name);
            setUserBookedUnits(userBooked);
        }
    }, [bookedUnits, userLG]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <CircularProgress />
                <p className="text-gray-500 text-2xl font-semibold mt-10 justify-center items-center">Loading...</p>
            </div>
        );
    }

    if (!userBookedUnits) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-gray-500 text-2xl font-semibold">Failed to load data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="flex">
            <AgentSidebar />
            <div>
                <AgentNavbar />
                <div className="p-1">
                    <AGDashboardTabs bookedUnits={userBookedUnits} unassignedLeads={unassignedLeads} />
                </div>
            </div>
        </div>
    );
}

export default AgentDashboard;