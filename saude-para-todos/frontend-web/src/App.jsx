import React, { useState, useEffect } from "react";

function App() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/appointments")
            .then((res) => res.json())
            .then((data) => {
                setAppointments(data);
                setLoading(false);
            })
            .catch((err) => console.error("Erro ao buscar dados:", err));
    }, []);

    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                backgroundColor: "#f4f7f6",
                minHeight: "100vh",
            }}
        >
            <header
                style={{
                    backgroundColor: "#1a5f60",
                    padding: "15px 20px",
                    color: "white",
                    borderRadius: "8px",
                }}
            >
                <h1 style={{ margin: 0, fontSize: "20px" }}>
                    Saúde Para Todos — Painel de Monitoramento
                </h1>
            </header>

            <main style={{ marginTop: "20px" }}>
                <h2 style={{ color: "#2d3748" }}>
                    Atendimentos e Agendamentos Consolidados
                </h2>
                {loading ? (
                    <p>Carregando registros...</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            overflow: "hidden",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: "#2b9393",
                                    color: "white",
                                    textAlign: "left",
                                }}
                            >
                                <th style={{ padding: "12px" }}>ID</th>
                                <th style={{ padding: "12px" }}>Paciente</th>
                                <th style={{ padding: "12px" }}>
                                    Tipo de Atendimento
                                </th>
                                <th style={{ padding: "12px" }}>Data/Hora</th>
                                <th style={{ padding: "12px" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((app) => (
                                <tr
                                    key={app.id}
                                    style={{
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    <td style={{ padding: "12px" }}>
                                        {app.id}
                                    </td>
                                    <td
                                        style={{
                                            padding: "12px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {app.patient_name}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {app.appointment_type}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {app.date_time}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        <span
                                            style={{
                                                backgroundColor: "#e6fffa",
                                                color: "#234e52",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}

export default App;
