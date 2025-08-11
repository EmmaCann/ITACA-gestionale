import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const LineChartWidget = ({ labels, values, title }) => {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    const COLORS = [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(199, 199, 199, 1)",
    ];

    useEffect(() => {
        instanceRef.current?.destroy();
        const ctx = canvasRef.current.getContext("2d");

        const datasets = values.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: COLORS[index % COLORS.length],
            backgroundColor: COLORS[index % COLORS.length].replace("1)", "0.2)"),
            fill: false,
            tension: 0.4,
        }));

        instanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "top" },
                },
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        return () => instanceRef.current?.destroy();
    }, [labels, values]);

    return (
    <div className="relative w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full" />
    </div>
);

};
