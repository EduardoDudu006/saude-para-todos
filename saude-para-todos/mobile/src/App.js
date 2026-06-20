import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";

export default function App() {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        // Busca as unidades móveis diretamente do Back-end FastAPI do Monorepo
        fetch("http://localhost:8000/health-units")
            .then((res) => res.json())
            .then((data) => setUnits(data))
            .catch((err) => console.log("Erro de rede: ", err));
    }, []);

    const handleAgendar = (unitName) => {
        Alert.alert(
            "Agendamento Solicitado",
            `Seu agendamento para a ${unitName} está sendo processado via SMS/Rede offline para garantir o seu acesso.`,
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saúde Para Todos</Text>
                <Text style={styles.headerSubtitle}>
                    Atendimento Fácil e Perto de Você
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Unidades Próximas Hoje:</Text>

                {units.map((unit) => (
                    <View key={unit.id} style={styles.card}>
                        <Text style={styles.unitName}>{unit.name}</Text>
                        <Text style={styles.unitLocation}>
                            📍 {unit.location}
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleAgendar(unit.name)}
                        >
                            <Text style={styles.buttonText}>
                                Marcar Atendimento Grátis
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f7f6" },
    header: {
        backgroundColor: "#1a5f60",
        padding: 30,
        paddingTop: 50,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
    headerSubtitle: { color: "#e6fffa", fontSize: 14, marginTop: 4 },
    content: { padding: 20 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 15,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    unitName: { fontSize: 16, fontWeight: "bold", color: "#1a5f60" },
    unitLocation: { color: "#718096", marginVertical: 8, fontSize: 14 },
    button: {
        backgroundColor: "#2b9393",
        padding: 15,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 5,
    }, // Botão maior para fácil clique
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
