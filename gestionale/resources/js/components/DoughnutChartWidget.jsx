import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const DoughnutChartWidget = ({ labels, values, colors }) => {
    const canvasRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        instanceRef.current?.destroy();
        const ctx = canvasRef.current.getContext("2d");
        instanceRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
            },
        });

        return () => instanceRef.current?.destroy();
    }, [labels, values, colors]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};
