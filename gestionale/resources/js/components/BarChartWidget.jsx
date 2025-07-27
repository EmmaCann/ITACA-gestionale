import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

export const BarChartWidget = ({ className, title, description, data, height = 300 }) => {

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const BAR_COLORS = [
    "rgba(255, 99, 132, 0.6)",   // Rosso
    "rgba(54, 162, 235, 0.6)",   // Blu
    "rgba(255, 206, 86, 0.6)",   // Giallo
    "rgba(75, 192, 192, 0.6)",   // Verde acqua
    "rgba(153, 102, 255, 0.6)",  // Viola
    "rgba(255, 159, 64, 0.6)",   // Arancio
    "rgba(199, 199, 199, 0.6)",  // Grigio
    "rgba(83, 102, 255, 0.6)",   // Blu acceso
    "rgba(120, 99, 132, 0.6)",   // Prugna
    "rgba(100, 159, 64, 0.6)",   // Verde oliva
];


    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstanceRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: "Totale incassi (€)",
                        data: data.values,
                        backgroundColor: data.values.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]),
                        borderColor: data.values.map((_, i) => BAR_COLORS[i % BAR_COLORS.length].replace("0.6", "1")),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `€ ${context.formattedValue}`;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Incassi (€)",
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Anno",
                        },
                    },
                },
            },
        });

        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, [data]);

    return (
       <div className={`w-full ${className}`}>

            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
            <div className="relative w-full mb-8" style={{ height }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};
