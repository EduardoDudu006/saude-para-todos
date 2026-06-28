import React, { useState, useEffect } from "react";
import logoImg from "./logo.png"; // Certifique-se de que a imagem existe nesta pasta

function App() {
    // ==========================================
    // ESTADOS DE CONTROLE & NAVEGAÇÃO
    // ==========================================
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [appointments, setAppointments] = useState([]);
    const [healthUnits, setHealthUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // ESTADOS DE INTERAÇÃO DO USUÁRIO
    // ==========================================
    const [userStressText, setUserStressText] = useState("");
    const [userMood, setUserMood] = useState("Calmo");
    const [aiStressFeedback, setAiStressFeedback] = useState(null);
    const [isSharingBpm, setIsSharingBpm] = useState(false);

    // ESTADO FORMULÁRIO DE AGENDAMENTO (VIEW 6)
    const [newAppointment, setNewAppointment] = useState({
        cidade: "",
        rede: "",
        especialidade: "",
        medico: "",
        data: "",
        hora: "",
    });

    // ESTADO CONTATOS DE EMERGÊNCIA (VIEW 8)
    // Gerenciamento dinâmico para cadastrar telefone e habilitar/desabilitar contato
    const [personalContacts, setPersonalContacts] = useState([
        { id: 1, label: "Contato 01", telefone: "", ativo: true },
        { id: 2, label: "Contato 02", telefone: "", ativo: true },
        { id: 3, label: "Contato 03", telefone: "", ativo: true },
    ]);

    // ESTADOS DO MÓDULO DE ATIVIDADE FÍSICA
    const [activeActivity, setActiveActivity] = useState(null);
    const [activityStats, setActivityStats] = useState({
        passos: 0,
        distancia: 0,
        velocidade: 0,
        velMedia: 0,
        relevo: "Plano",
    });
    const [activityInterval, setActivityInterval] = useState(null);

    // MÓDULO DE MÉTRICAS FIXAS
    const [healthMetrics] = useState({
        bpm: 76,
        sono: "7h 20m",
        estresse: "Normal",
        iaRecommendation:
            "Seu nível de estresse reduziu 12% após a melhoria do sono. Excelente evolução! Continue mantendo a hidratação constante durante as rotas externas hoje.",
    });

    // DADOS HISTÓRICOS PARA RENDERIZAÇÃO DOS GRÁFICOS
    const historyData = {
        bpm: [72, 75, 78, 82, 74, 76, 76],
        sono: [6.5, 7.0, 5.8, 7.2, 6.8, 7.3, 7.3],
        apineias: [1, 0, 2, 4, 1, 0, 1],
        dias: ["Ter", "Qua", "Qui", "Sex", "Sáb", "Dom", "Seg"],
    };

    // ==========================================
    // CARREGAMENTO DE DADOS ASSÍNCRONOS (API)
    // ==========================================
    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/appointments`).then((res) =>
                res.json(),
            ),
            fetch(`${import.meta.env.VITE_API_URL}/health-units`).then((res) =>
                res.json(),
            ),
        ])
            .then(([appointmentsData, unitsData]) => {
                setAppointments(appointmentsData);
                setHealthUnits(unitsData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao conectar com a API do Back-end:", err);
                setLoading(false);
            });
    }, []);

    // ==========================================
    // FUNÇÕES DE MANIPULAÇÃO DE EVENTOS
    // ==========================================

    // Atualiza campo de telefone ou status ativo/inativo dos contatos pessoais
    const updateContact = (id, field, value) => {
        setPersonalContacts(
            personalContacts.map((c) =>
                c.id === id ? { ...c, [field]: value } : c,
            ),
        );
    };

    const handleStressSubmit = (e) => {
        e.preventDefault();
        if (!userStressText.trim()) return;

        setAiStressFeedback({
            analise: `Identificamos que seu estado (${userMood}) coincide com uma noite de sono anterior de 7.3h. Cruzando com seu histórico médico de prontuário e as flutuações de batimentos cardíacos (média 76 BPM), a IA sugere evitar cafeína após as 16h hoje.`,
            sugestoes: [
                "Prática Saudável: 10 minutos de meditação guiada focada na respiração.",
                "Atividade ao Ar Livre: Uma caminhada leve de 20 minutos no fim da tarde.",
                "Ajuste de Rotina: Pausa ativa de 5 minutos a cada 2 horas de trabalho contínuo.",
            ],
        });
        setUserStressText("");
    };

    const handleScheduleSubmit = (e) => {
        e.preventDefault();

        const createdAppointment = {
            id: appointments.length + 1,
            patient_name: "Eduardo Luz",
            appointment_type: `${newAppointment.especialidade} - ${newAppointment.medico} (${newAppointment.rede})`,
            date_time: `${newAppointment.data.split("-").reverse().join("/")} às ${newAppointment.hora}`,
            status: "Agendado",
        };

        setAppointments([createdAppointment, ...appointments]);
        alert(
            `Consulta agendada com sucesso para a cidade de ${newAppointment.cidade}!`,
        );

        setNewAppointment({
            cidade: "",
            rede: "",
            especialidade: "",
            medico: "",
            data: "",
            hora: "",
        });
        setCurrentPage("dashboard");
    };

    const startPhysicalActivity = (type) => {
        if (activityInterval) clearInterval(activityInterval);
        setActiveActivity(type);
        setActivityStats({
            passos: 0,
            distancia: 0,
            velocidade: 0,
            velMedia: 0,
            relevo: "Plano",
        });

        let count = 0;
        const interval = setInterval(() => {
            count++;
            setActivityStats((prev) => {
                const novosPassos =
                    type === "Ciclismo"
                        ? 0
                        : prev.passos + Math.floor(Math.random() * 3) + 1;
                const velAtual =
                    type === "Corrida" ? 10 + Math.random() : 4 + Math.random();
                const distNova = prev.distancia + velAtual / 3600;
                const relevos = [
                    "Plano",
                    "Leve Aclive",
                    "Plano",
                    "Declive Irregular",
                ];

                return {
                    passos: novosPassos,
                    distancia: parseFloat(distNova.toFixed(3)),
                    velocidade: parseFloat(velAtual.toFixed(1)),
                    velMedia: parseFloat(
                        (
                            (prev.velMedia * (count - 1) + velAtual) /
                            count
                        ).toFixed(1),
                    ),
                    relevo: relevos[Math.floor(Math.random() * relevos.length)],
                };
            });
        }, 1000);
        setActivityInterval(interval);
    };

    const stopPhysicalActivity = () => {
        if (activityInterval) {
            clearInterval(activityInterval);
            setActivityInterval(null);
        }
        alert(
            `Atividade de ${activeActivity} salva no seu histórico! Total percorrido: ${activityStats.distancia} km.`,
        );
        setActiveActivity(null);
    };

    return (
        <div style={styles.body}>
            <div style={styles.contentWrapper}>
                {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
                <header style={styles.navbar}>
                    <div
                        style={styles.brandContainer}
                        onClick={() => setCurrentPage("dashboard")}
                    >
                        <div style={styles.logoContainer}>
                            <img
                                src={logoImg}
                                alt="Logo Saúde Para Todos"
                                style={styles.logoImage}
                            />
                        </div>
                        <h1 style={styles.navTitle}>Saúde Para Todos</h1>
                    </div>
                    <div style={styles.navLinks}>
                        <span style={styles.userBadge}>
                            Ecossistema Integrado
                        </span>
                        {currentPage !== "dashboard" && (
                            <button
                                style={styles.backButton}
                                onClick={() => setCurrentPage("dashboard")}
                            >
                                ⬅ Voltar ao Painel
                            </button>
                        )}
                    </div>
                </header>

                {/* CONTENEDOR CENTRAL */}
                <div style={styles.mainContainer}>
                    {/* VIEW 1: DASHBOARD PRINCIPAL */}
                    {currentPage === "dashboard" && (
                        <>
                            <section style={styles.leftColumn}>
                                <div style={styles.iaCard}>
                                    <div style={styles.iaHeader}>
                                        <span style={{ fontSize: "20px" }}>
                                            ✨
                                        </span>
                                        <h3 style={styles.iaTitle}>
                                            Recomendações Personalizadas de IA
                                        </h3>
                                    </div>
                                    <p style={styles.iaText}>
                                        {healthMetrics.iaRecommendation}
                                    </p>
                                </div>

                                <h2 style={styles.sectionHeading}>
                                    Métricas Ativas & Serviços
                                </h2>
                                <div style={styles.metricsGrid}>
                                    <div
                                        style={styles.clickableCard}
                                        onClick={() => setCurrentPage("bpm")}
                                    >
                                        <div style={styles.metricHeader}>
                                            <span
                                                style={{
                                                    fontSize: "22px",
                                                    color: "#e53e3e",
                                                }}
                                            >
                                                ❤️
                                            </span>
                                            <span style={styles.metricLabel}>
                                                Batimentos Cardíacos
                                            </span>
                                        </div>
                                        <p style={styles.metricValue}>
                                            {healthMetrics.bpm}{" "}
                                            <span style={styles.metricUnit}>
                                                BPM
                                            </span>
                                        </p>
                                        <span style={styles.metricStatusStable}>
                                            Monitoramento Ativo ➔
                                        </span>
                                    </div>

                                    <div
                                        style={styles.clickableCard}
                                        onClick={() => setCurrentPage("sono")}
                                    >
                                        <div style={styles.metricHeader}>
                                            <span
                                                style={{
                                                    fontSize: "22px",
                                                    color: "#3182ce",
                                                }}
                                            >
                                                🌙
                                            </span>
                                            <span style={styles.metricLabel}>
                                                Monitoramento do Sono
                                            </span>
                                        </div>
                                        <p style={styles.metricValue}>
                                            {healthMetrics.sono}
                                        </p>
                                        <span style={styles.metricStatusStable}>
                                            Horas & Apneias ➔
                                        </span>
                                    </div>

                                    <div
                                        style={styles.clickableCard}
                                        onClick={() =>
                                            setCurrentPage("estresse")
                                        }
                                    >
                                        <div style={styles.metricHeader}>
                                            <span
                                                style={{
                                                    fontSize: "22px",
                                                    color: "#dd6b20",
                                                }}
                                            >
                                                ⚡
                                            </span>
                                            <span style={styles.metricLabel}>
                                                Nível de Estresse
                                            </span>
                                        </div>
                                        <p style={styles.metricValue}>
                                            {healthMetrics.estresse}
                                        </p>
                                        <span style={styles.metricStatusStable}>
                                            Diário de Humor ➔
                                        </span>
                                    </div>

                                    <div
                                        style={styles.clickableCard}
                                        onClick={() =>
                                            setCurrentPage("agendar")
                                        }
                                    >
                                        <div style={styles.metricHeader}>
                                            <span
                                                style={{
                                                    fontSize: "22px",
                                                    color: "#4a5568",
                                                }}
                                            >
                                                ✍️
                                            </span>
                                            <span style={styles.metricLabel}>
                                                Agendar Consulta
                                            </span>
                                        </div>
                                        <p style={styles.metricValue}>
                                            Rede Integrada
                                        </p>
                                        <span style={styles.metricStatusStable}>
                                            UBS, Hospitais & Móvel ➔
                                        </span>
                                    </div>

                                    <div
                                        style={styles.clickableCard}
                                        onClick={() =>
                                            setCurrentPage("atividade")
                                        }
                                    >
                                        <div style={styles.metricHeader}>
                                            <span
                                                style={{
                                                    fontSize: "22px",
                                                    color: "#38a169",
                                                }}
                                            >
                                                🏃‍♂️
                                            </span>
                                            <span style={styles.metricLabel}>
                                                Atividade Física
                                            </span>
                                        </div>
                                        <p style={styles.metricValue}>
                                            Mapeamento
                                        </p>
                                        <span style={styles.metricStatusStable}>
                                            Sensores Ativos ➔
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            ...styles.clickableCard,
                                            borderColor: "#feb2b2",
                                        }}
                                        onClick={() =>
                                            setCurrentPage("emergencia")
                                        }
                                    >
                                        <div style={styles.metricHeader}>
                                            <span
                                                style={{
                                                    fontSize: "22px",
                                                    color: "#e53e3e",
                                                }}
                                            >
                                                🚨
                                            </span>
                                            <span style={styles.metricLabel}>
                                                Emergência
                                            </span>
                                        </div>
                                        <p style={styles.metricValue}>
                                            Contatos Úteis
                                        </p>
                                        <span
                                            style={styles.metricStatusEmergency}
                                        >
                                            Números Diretos ➔
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section style={styles.rightColumn}>
                                <h2 style={styles.sectionHeading}>
                                    Unidades Móveis e Postos Ativos
                                </h2>
                                <div style={styles.unitsList}>
                                    {loading ? (
                                        <p>Carregando unidades...</p>
                                    ) : (
                                        healthUnits.map((unit) => (
                                            <div
                                                key={unit.id}
                                                style={styles.unitItem}
                                            >
                                                <div>
                                                    <h4 style={styles.unitName}>
                                                        === {unit.name}
                                                    </h4>
                                                    <p
                                                        style={
                                                            styles.unitLocation
                                                        }
                                                    >
                                                        {unit.location}
                                                    </p>
                                                </div>
                                                <span
                                                    style={styles.activeBadge}
                                                >
                                                    {unit.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <h2 style={styles.sectionHeading}>
                                    <br />
                                    Consultas Marcadas e Triagens
                                </h2>
                                <div style={styles.tableWrapper}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr style={styles.tableHeaderRow}>
                                                <th style={styles.tableTh}>
                                                    Paciente
                                                </th>
                                                <th style={styles.tableTh}>
                                                    Atendimento / Rede
                                                </th>
                                                <th style={styles.tableTh}>
                                                    Data/Hora
                                                </th>
                                                <th style={styles.tableTh}>
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((app) => (
                                                <tr
                                                    key={app.id}
                                                    style={styles.tableRow}
                                                >
                                                    <td
                                                        style={
                                                            styles.patientNameTd
                                                        }
                                                    >
                                                        {app.patient_name}
                                                    </td>
                                                    <td style={styles.tableTd}>
                                                        {app.appointment_type}
                                                    </td>
                                                    <td style={styles.tableTd}>
                                                        {app.date_time}
                                                    </td>
                                                    <td style={styles.tableTd}>
                                                        <span
                                                            style={
                                                                styles.statusPill
                                                            }
                                                        >
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    )}

                    {/* VIEW 2: BATIMENTOS CARDÍACOS */}
                    {currentPage === "bpm" && (
                        <div style={styles.fullWidthView}>
                            <div style={styles.viewHeader}>
                                <h2>
                                    ❤️ Monitoramento de Frequência Cardíaca
                                    Ativa
                                </h2>
                                <button
                                    style={{
                                        ...styles.actionBtn,
                                        backgroundColor: isSharingBpm
                                            ? "#e53e3e"
                                            : "#2b9393",
                                    }}
                                    onClick={() =>
                                        setIsSharingBpm(!isSharingBpm)
                                    }
                                >
                                    {isSharingBpm
                                        ? "🛑 Interromper Compartilhamento"
                                        : "📡 Compartilhar em Tempo Real"}
                                </button>
                            </div>
                            {isSharingBpm && (
                                <div style={styles.liveAlert}>
                                    🟢 Transmissão Activa com o corpo médico
                                    habilitado.
                                </div>
                            )}
                            <div style={styles.chartContainer}>
                                {historyData.bpm.map((value, i) => (
                                    <div key={i} style={styles.chartBarWrapper}>
                                        <div
                                            style={{
                                                ...styles.chartBar,
                                                height: `${value * 2}px`,
                                                backgroundColor: "#e53e3e",
                                            }}
                                        />
                                        <span style={styles.chartBarLabel}>
                                            {value} BPM
                                        </span>
                                        <span style={styles.chartBarDay}>
                                            {historyData.dias[i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VIEW 3: MONITORAMENTO DO SONO */}
                    {currentPage === "sono" && (
                        <div style={styles.fullWidthView}>
                            <h2>
                                🌙 Monitoramento Clínico do Sono & Distúrbios
                            </h2>
                            <div style={styles.chartContainer}>
                                {historyData.sono.map((value, i) => (
                                    <div key={i} style={styles.chartBarWrapper}>
                                        <div
                                            style={{
                                                ...styles.chartBar,
                                                height: `${value * 22}px`,
                                                backgroundColor: "#3182ce",
                                            }}
                                        />
                                        <span style={styles.chartBarLabel}>
                                            {value}h
                                        </span>
                                        <span
                                            style={{
                                                ...styles.chartBarLabel,
                                                color:
                                                    historyData.apineias[i] > 2
                                                        ? "#e53e3e"
                                                        : "#718096",
                                            }}
                                        >
                                            ⚠️ Apneias:{" "}
                                            {historyData.apineias[i]}
                                        </span>
                                        <span style={styles.chartBarDay}>
                                            {historyData.dias[i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VIEW 4: NÍVEL DE ESTRESSE */}
                    {currentPage === "estresse" && (
                        <div style={styles.fullWidthView}>
                            <h2>
                                ⚡ Diário de Espírito e Análise Preventiva com
                                IA
                            </h2>
                            <div style={styles.formSection}>
                                <form onSubmit={handleStressSubmit}>
                                    <label>
                                        <strong>
                                            Como está seu Estado de Espírito
                                            hoje?
                                        </strong>
                                    </label>
                                    <select
                                        style={styles.input}
                                        value={userMood}
                                        onChange={(e) =>
                                            setUserMood(e.target.value)
                                        }
                                    >
                                        <option value="Calmo e Disposto">
                                            Calmo e Disposto
                                        </option>
                                        <option value="Cansado / Sobrecarregado">
                                            Cansado / Sobrecarregado
                                        </option>
                                    </select>
                                    <textarea
                                        style={styles.textarea}
                                        value={userStressText}
                                        onChange={(e) =>
                                            setUserStressText(e.target.value)
                                        }
                                        placeholder="Descreva os fatores estressores do seu dia ou rotina..."
                                    />
                                    <button
                                        type="submit"
                                        style={styles.submitButton}
                                    >
                                        Enviar para Análise Cruzada
                                    </button>
                                </form>
                            </div>
                            {aiStressFeedback && (
                                <div style={styles.aiResultBlock}>
                                    <h3>✨ Diagnóstico Predictivo da IA</h3>
                                    <p>{aiStressFeedback.analise}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 6: AGENDAR CONSULTA */}
                    {currentPage === "agendar" && (
                        <div style={styles.fullWidthView}>
                            <h2>
                                ✍️ Agendamento Unificado na Rede Credenciada
                            </h2>
                            <form
                                onSubmit={handleScheduleSubmit}
                                style={{
                                    maxWidth: "500px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "15px",
                                }}
                            >
                                <label style={styles.fieldLabel}>
                                    Cidade:
                                    <input
                                        type="text"
                                        placeholder="Ex: Recife"
                                        style={styles.input}
                                        value={newAppointment.cidade}
                                        onChange={(e) =>
                                            setNewAppointment({
                                                ...newAppointment,
                                                cidade: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </label>
                                <label style={styles.fieldLabel}>
                                    Rede Credenciada:
                                    <select
                                        style={styles.input}
                                        value={newAppointment.rede}
                                        onChange={(e) =>
                                            setNewAppointment({
                                                ...newAppointment,
                                                rede: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            Selecione uma opção...
                                        </option>
                                        <option value="Hospital">
                                            Hospital
                                        </option>
                                        <option value="Clínica">Clínica</option>
                                        <option value="UBS">
                                            UBS (Unidade Básica de Saúde)
                                        </option>
                                        <option value="Unidade Móvel">
                                            Unidade Móvel
                                        </option>
                                    </select>
                                </label>
                                <label style={styles.fieldLabel}>
                                    Especialidade:
                                    <input
                                        type="text"
                                        placeholder="Ex: Cardiologia"
                                        style={styles.input}
                                        value={newAppointment.especialidade}
                                        onChange={(e) =>
                                            setNewAppointment({
                                                ...newAppointment,
                                                especialidade: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </label>
                                <label style={styles.fieldLabel}>
                                    Médico:
                                    <input
                                        type="text"
                                        placeholder="Ex: Dr. Carlos"
                                        style={styles.input}
                                        value={newAppointment.medico}
                                        onChange={(e) =>
                                            setNewAppointment({
                                                ...newAppointment,
                                                medico: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </label>
                                <div style={{ display: "flex", gap: "15px" }}>
                                    <label
                                        style={{
                                            ...styles.fieldLabel,
                                            flex: 1,
                                        }}
                                    >
                                        Data:
                                        <input
                                            type="date"
                                            style={styles.input}
                                            value={newAppointment.data}
                                            onChange={(e) =>
                                                setNewAppointment({
                                                    ...newAppointment,
                                                    data: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>
                                    <label
                                        style={{
                                            ...styles.fieldLabel,
                                            flex: 1,
                                        }}
                                    >
                                        Hora:
                                        <input
                                            type="time"
                                            style={styles.input}
                                            value={newAppointment.hora}
                                            onChange={(e) =>
                                                setNewAppointment({
                                                    ...newAppointment,
                                                    hora: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>
                                </div>

                                {newAppointment.cidade &&
                                    newAppointment.rede &&
                                    newAppointment.especialidade &&
                                    newAppointment.medico &&
                                    newAppointment.data &&
                                    newAppointment.hora && (
                                        <div style={styles.summaryContainer}>
                                            <h4 style={styles.summaryTitle}>
                                                📋 Resumo do Agendamento
                                            </h4>
                                            <div style={styles.summaryContent}>
                                                <p>
                                                    <strong>Cidade:</strong>{" "}
                                                    {newAppointment.cidade}
                                                </p>
                                                <p>
                                                    <strong>Rede:</strong>{" "}
                                                    {newAppointment.rede}
                                                </p>
                                                <p>
                                                    <strong>
                                                        Especialidade:
                                                    </strong>{" "}
                                                    {
                                                        newAppointment.especialidade
                                                    }
                                                </p>
                                                <p>
                                                    <strong>Médico:</strong>{" "}
                                                    {newAppointment.medico}
                                                </p>
                                                <p>
                                                    <strong>Data:</strong>{" "}
                                                    {newAppointment.data
                                                        .split("-")
                                                        .reverse()
                                                        .join("/")}{" "}
                                                    às {newAppointment.hora}
                                                </p>
                                            </div>
                                            <button
                                                type="submit"
                                                style={{
                                                    ...styles.submitButton,
                                                    width: "100%",
                                                    marginTop: "20px",
                                                }}
                                            >
                                                Confirmar Marcação
                                            </button>
                                        </div>
                                    )}
                            </form>
                        </div>
                    )}

                    {/* VIEW 7: ATIVIDADE FÍSICA */}
                    {currentPage === "atividade" && (
                        <div style={styles.fullWidthView}>
                            <h2>🏃‍♂️ Sensor de Atividade Física Mapeada</h2>
                            {!activeActivity ? (
                                <div style={{ display: "flex", gap: "15px" }}>
                                    <button
                                        style={{
                                            ...styles.activitySelectBtn,
                                            backgroundColor: "#3182ce",
                                        }}
                                        onClick={() =>
                                            startPhysicalActivity("Caminhada")
                                        }
                                    >
                                        🚶‍♂️ Iniciar Caminhada
                                    </button>
                                    <button
                                        style={{
                                            ...styles.activitySelectBtn,
                                            backgroundColor: "#e53e3e",
                                        }}
                                        onClick={() =>
                                            startPhysicalActivity("Corrida")
                                        }
                                    >
                                        🏃‍♂️ Iniciar Corrida
                                    </button>
                                </div>
                            ) : (
                                <div style={styles.activityTrackingPanel}>
                                    <h3>Mapeando Percurso: {activeActivity}</h3>
                                    <p>
                                        Distância: {activityStats.distancia} km
                                        | Velocidade: {activityStats.velocidade}{" "}
                                        km/h | Relevo: {activityStats.relevo}
                                    </p>
                                    <button
                                        style={styles.stopActivityBtn}
                                        onClick={stopPhysicalActivity}
                                    >
                                        ⏹ Salvar Atividade
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ==========================================
              VIEW 8: CENTRAL TELEFÔNICA DE EMERGÊNCIA
             ========================================== */}
                    {currentPage === "emergencia" && (
                        <div style={styles.fullWidthView}>
                            <h2
                                style={{
                                    color: "#e53e3e",
                                    marginBottom: "20px",
                                }}
                            >
                                🚨 Central Telefônica de Emergência
                            </h2>

                            {/* Números Públicos Integrados */}
                            <div style={styles.emergencyGrid}>
                                <div style={styles.emergencyItem}>
                                    <span>🚑 SAMU (192)</span>
                                    <button
                                        style={styles.callBtn}
                                        onClick={() =>
                                            alert(
                                                "Efetuando discagem para o SAMU (192)...",
                                            )
                                        }
                                    >
                                        Discar
                                    </button>
                                </div>
                                <div style={styles.emergencyItem}>
                                    <span>🔥 Bombeiros (193)</span>
                                    <button
                                        style={styles.callBtn}
                                        onClick={() =>
                                            alert(
                                                "Efetuando discagem para os Bombeiros (193)...",
                                            )
                                        }
                                    >
                                        Discar
                                    </button>
                                </div>
                                <div style={styles.emergencyItem}>
                                    <span>🚔 Polícia (190)</span>
                                    <button
                                        style={styles.callBtn}
                                        onClick={() =>
                                            alert(
                                                "Efetuando discagem para a Polícia (190)...",
                                            )
                                        }
                                    >
                                        Discar
                                    </button>
                                </div>
                            </div>

                            {/* Gerenciador de Contatos de Confiança Pessoais */}
                            <h3
                                style={{
                                    marginTop: "40px",
                                    color: "#1a5f60",
                                    marginBottom: "5px",
                                }}
                            >
                                👥 Meus Contatos de Emergência
                            </h3>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#718096",
                                    marginBottom: "25px",
                                }}
                            >
                                Insira os telefones dos seus contatos de
                                confiança. Ative ou desative cada linha conforme
                                a sua necessidade atual.
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                {personalContacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        style={{
                                            ...styles.contactCard,
                                            opacity: contact.ativo ? 1 : 0.55,
                                            backgroundColor: contact.ativo
                                                ? "#ffffff"
                                                : "#f7fafc",
                                            borderColor: contact.ativo
                                                ? "#cbd5e0"
                                                : "#e2e8f0",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <label style={styles.contactLabel}>
                                                {contact.label}
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Digite o número de telefone..."
                                                style={styles.contactInput}
                                                value={contact.telefone}
                                                onChange={(e) =>
                                                    updateContact(
                                                        contact.id,
                                                        "telefone",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "15px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: "bold",
                                                        color: "#718096",
                                                        marginBottom: "4px",
                                                    }}
                                                >
                                                    Status
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateContact(
                                                            contact.id,
                                                            "ativo",
                                                            !contact.ativo,
                                                        )
                                                    }
                                                    style={{
                                                        ...styles.toggleBtn,
                                                        backgroundColor:
                                                            contact.ativo
                                                                ? "#38a169"
                                                                : "#a0aec0",
                                                    }}
                                                >
                                                    {contact.ativo
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={
                                                    !contact.ativo ||
                                                    !contact.telefone.trim()
                                                }
                                                style={{
                                                    ...styles.callBtn,
                                                    backgroundColor:
                                                        !contact.ativo ||
                                                        !contact.telefone.trim()
                                                            ? "#cbd5e0"
                                                            : "#e53e3e",
                                                    cursor:
                                                        !contact.ativo ||
                                                        !contact.telefone.trim()
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                                onClick={() =>
                                                    alert(
                                                        `Discando para o contato personalizado: ${contact.telefone}...`,
                                                    )
                                                }
                                            >
                                                📞 Discar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER MODERNIZADO */}
            <footer style={styles.footer}>
                <div style={styles.footerTopLine}></div>
                <div style={styles.footerContainer}>
                    <p style={styles.footerCopy}>
                        &copy; 2026 Eduardo Luz | Todos os direitos reservados.
                    </p>
                    <div style={styles.footerTagline}>
                        <span style={styles.footerPulse}>●</span> Ecossistema
                        Digital de Saúde Acessível
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ==========================================
// CENTRALIZAÇÃO DOS ESTILOS CSS-IN-JS
// ==========================================
const styles = {
    body: {
        fontFamily: '"Segoe UI", sans-serif',
        backgroundColor: "#f3f7f7",
        minHeight: "100vh",
        margin: 0,
        color: "#2d3748",
        display: "flex",
        flexDirection: "column",
    },
    contentWrapper: { flex: 1 },
    navbar: {
        backgroundColor: "#1a5f60",
        padding: "12px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    brandContainer: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        cursor: "pointer",
    },
    logoContainer: { display: "flex", alignItems: "center" },
    logoImage: { height: "45px", width: "auto" },
    navTitle: { margin: 0, fontSize: "22px", fontWeight: "600" },
    navLinks: { display: "flex", alignItems: "center", gap: "20px" },
    userBadge: {
        backgroundColor: "rgba(255,255,255,0.15)",
        padding: "5px 12px",
        borderRadius: "20px",
        fontSize: "13px",
    },
    backButton: {
        backgroundColor: "#2b9393",
        border: "none",
        color: "#ffffff",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    mainContainer: {
        display: "flex",
        gap: "30px",
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
        flexWrap: "wrap",
    },
    leftColumn: {
        flex: "1 1 500px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    rightColumn: {
        flex: "1 1 500px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    sectionHeading: {
        fontSize: "18px",
        color: "#1a5f60",
        margin: "0 0 5px 0",
        borderBottom: "2px solid #e2e8f0",
        paddingBottom: "6px",
    },
    iaCard: {
        backgroundColor: "#ffffff",
        borderLeft: "5px solid #2b9393",
        borderRadius: "8px",
        padding: "20px",
    },
    iaHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
    },
    iaTitle: { margin: 0, color: "#1a5f60", fontSize: "16px" },
    iaText: {
        margin: 0,
        fontSize: "14px",
        color: "#4a5568",
        lineHeight: "1.5",
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
    },
    clickableCard: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "18px",
        cursor: "pointer",
        border: "1px solid #edf2f7",
        minHeight: "130px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    metricHeader: { display: "flex", alignItems: "center", gap: "8px" },
    metricLabel: { fontSize: "14px", color: "#4a5568", fontWeight: "600" },
    metricValue: {
        margin: "5px 0 12px 0",
        fontSize: "22px",
        fontWeight: "700",
    },
    metricUnit: { fontSize: "14px", color: "#a0aec0" },
    metricStatusStable: {
        fontSize: "12px",
        color: "#2b9393",
        fontWeight: "bold",
    },
    metricStatusEmergency: {
        fontSize: "12px",
        color: "#e53e3e",
        fontWeight: "bold",
    },
    unitsList: { display: "flex", flexDirection: "column", gap: "10px" },
    unitItem: {
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        padding: "12px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    unitName: { margin: 0, fontSize: "14px", color: "#1a5f60" },
    unitLocation: { margin: "3px 0 0 0", fontSize: "13px", color: "#718096" },
    activeBadge: {
        backgroundColor: "#e6fffa",
        color: "#234e52",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 10px",
        borderRadius: "12px",
    },
    tableWrapper: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    tableHeaderRow: {
        backgroundColor: "#2b9393",
        color: "#ffffff",
        textAlign: "left",
    },
    tableTh: { padding: "14px 16px" },
    tableRow: { borderBottom: "1px solid #edf2f7" },
    tableTd: { padding: "14px 16px", color: "#4a5568" },
    patientNameTd: {
        padding: "14px 16px",
        fontWeight: "bold",
        color: "#1a5f60",
    },
    statusPill: {
        backgroundColor: "#e6fffa",
        color: "#234e52",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "bold",
    },
    fullWidthView: {
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    },
    viewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    actionBtn: {
        border: "none",
        color: "#ffffff",
        padding: "10px 18px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    liveAlert: {
        backgroundColor: "#f0fff4",
        border: "1px solid #c6f6d5",
        color: "#22543d",
        padding: "12px",
        borderRadius: "6px",
        margin: "15px 0",
    },
    chartContainer: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: "260px",
        borderBottom: "2px solid #cbd5e0",
        padding: "20px 10px 0 10px",
        backgroundColor: "#f7fafc",
        borderRadius: "6px",
    },
    chartBarWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
    },
    chartBar: { width: "35px", borderRadius: "4px 4px 0 0" },
    chartBarLabel: { fontSize: "11px", fontWeight: "bold", marginTop: "5px" },
    chartBarDay: { fontSize: "12px", color: "#718096", marginTop: "4px" },
    formSection: { marginTop: "20px" },
    textarea: {
        width: "100%",
        height: "100px",
        borderRadius: "6px",
        padding: "12px",
        boxSizing: "border-box",
        marginTop: "5px",
    },
    fieldLabel: {
        display: "flex",
        flexDirection: "column",
        fontWeight: "600",
        fontSize: "14px",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #cbd5e0",
        fontSize: "14px",
        marginTop: "5px",
        boxSizing: "border-box",
    },
    submitButton: {
        backgroundColor: "#1a5f60",
        color: "#ffffff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    summaryContainer: {
        marginTop: "15px",
        padding: "20px",
        backgroundColor: "#f7fafc",
        border: "1px solid #cbd5e0",
        borderRadius: "8px",
    },
    summaryTitle: {
        margin: "0 0 12px 0",
        color: "#1a5f60",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "6px",
    },
    summaryContent: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontSize: "14px",
    },
    aiResultBlock: {
        backgroundColor: "#e6fffa",
        borderLeft: "5px solid #2b9393",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
    },
    activitySelectBtn: {
        color: "#ffffff",
        border: "none",
        padding: "15px 25px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    activityTrackingPanel: {
        backgroundColor: "#f7fafc",
        padding: "25px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
    },
    stopActivityBtn: {
        backgroundColor: "#e53e3e",
        color: "#ffffff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    // Estilos Atualizados da Página de Emergência
    emergencyGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "15px",
        marginTop: "10px",
    },
    emergencyItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderRadius: "8px",
        border: "1px solid #feb2b2",
        backgroundColor: "#fff5f5",
        fontWeight: "600",
        fontSize: "15px",
    },
    callBtn: {
        backgroundColor: "#e53e3e",
        color: "#ffffff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
    },
    contactCard: {
        display: "flex",
        alignItems: "center",
        gap: "25px",
        padding: "18px",
        borderRadius: "8px",
        border: "1px solid #cbd5e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
        transition: "all 0.2s ease",
    },
    contactLabel: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#4a5568",
        display: "block",
        marginBottom: "6px",
    },
    contactInput: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #cbd5e0",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    toggleBtn: {
        border: "none",
        color: "#ffffff",
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        cursor: "pointer",
        fontWeight: "bold",
        minWidth: "75px",
    },

    footer: {
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        position: "relative",
        marginTop: "60px",
    },
    footerTopLine: { height: "4px", backgroundColor: "#1a5f60", width: "100%" },
    footerContainer: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
    },
    footerCopy: {
        margin: 0,
        fontSize: "14px",
        color: "#4a5568",
        fontWeight: "500",
    },
    footerTagline: {
        fontSize: "13px",
        color: "#718096",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontWeight: "500",
    },
    footerPulse: { color: "#38a169", fontSize: "10px" },
};

export default App;
