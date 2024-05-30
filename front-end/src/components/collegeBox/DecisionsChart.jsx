import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

Chart.register(...registerables);

const DecisionsChart = ({ idCollege }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [decisionsData, setDecisionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDecisions();

        return () => {
            // Cleanup function to destroy the chart instance when the component unmounts
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (decisionsData.length > 0) {
            createChart();
        }
    }, [decisionsData]);

    const fetchDecisions = async () => {
        try {
            const res = await axios.get("http://localhost:8000/college/collegedecisions/getAll");
            const filteredData = res.data.filter(decision => decision.idCollege == idCollege);
            setDecisionsData(filteredData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');

        const colors = {
            accepted: 'rgba(75, 192, 192, 0.6)',
            rejected: 'rgba(255, 99, 132, 0.6)',
            waitlisted: 'rgba(201, 203, 207, 0.6)'
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'College Decisions',
                    data: decisionsData.map(decision => ({
                        x: decision.SAT,
                        y: decision.GPA,
                        decision: decision.decision
                    })),
                    backgroundColor: decisionsData.map(decision => colors[decision.decision]),
                    pointStyle: decisionsData.map(decision => {
                        if (decision.decision === 'accepted' || decision.decision === 'rejected') return 'circle';
                        return 'circle';
                    }),
                    pointRadius: decisionsData.map(decision => {
                        if (decision.decision === 'accepted' || decision.decision === 'rejected') return 10;
                        return 5;
                    })
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'SAT Score'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'GPA'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            generateLabels: function(chart) {
                                return Object.keys(colors).map(key => ({
                                    text: key.charAt(0).toUpperCase() + key.slice(1),
                                    fillStyle: colors[key]
                                }));
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        backgroundColor: ctx => {
                            const data = ctx.dataset.data[ctx.dataIndex];
                            return colors[data.decision];
                        },
                        pointStyle: ctx => {
                            const data = ctx.dataset.data[ctx.dataIndex];
                            if (data.decision === 'accepted' || data.decision === 'rejected') return 'triangle';
                            return 'circle';
                        },
                        radius: ctx => {
                            const data = ctx.dataset.data[ctx.dataIndex];
                            if (data.decision === 'accepted' || data.decision === 'rejected') return 10;
                            return 5;
                        }
                    }
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="container mt-4">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1>College Decisions Chart</h1>
            {decisionsData.length === 0 ? (
                <p>No decision available</p>
            ) : (
                <canvas id="decisionsChart" ref={chartRef} width="400" height="200"></canvas>
            )}
        </div>
    );
};

export default DecisionsChart;
