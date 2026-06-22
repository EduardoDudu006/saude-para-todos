# Saúde Para Todos — Ecossistema Digital de Saúde Acessível

O **Saúde Para Todos** é uma plataforma digital completa voltada à redução da desigualdade no acesso à saúde básica. Desenvolvido com foco em acessibilidade digital extrema, o ecossistema foi projetado para atender com eficiência e humanização trabalhadores e populações vulneráveis, garantindo que mesmo indivíduos com baixa conectividade ou letramento digital limitado possam monitorar métricas vitais e agendar atendimentos presenciais integrados.

Este repositório contém a implementação completa da interface web (**Frontend**), construída em **React**, integrando recursos dinâmicos baseados em IA, monitoramento de métricas físicas em tempo real e um fluxo seguro e validado de agendamento na rede credenciada do SUS e Unidades Móveis.

---

## 🚀 Funcionalidades Principais

O sistema organiza-se de forma linear e centralizada em torno de um painel dinâmico (Dashboard), fornecendo acesso a 8 módulos integrados:

1. **Recomendações Personalizadas de IA**: Painel inteligente que cruza dados históricos de sono, estresse e frequência cardíaca do usuário para apresentar diretrizes preventivas personalizadas.
2. **❤️ Monitoramento de Frequência Cardíaca Ativa**: Exibição gráfica dos batimentos diários (BPM) e recurso de transmissão síncrona em tempo real para comunicação médica segura.
3. **🌙 Monitoramento Clínico do Sono**: Controle de horas de repouso associado a um rastreador automático de episódios de apneia para antecipação de distúrbios respiratórios.
4. **⚡ Diário de Espírito & Cruzamento de Rotina**: Canal dinâmico para relato de bem-estar psicológico e físico, gerando diagnósticos automatizados da IA baseados na rotina médica.
5. **🍏 Central Unificada de Recomendações**: Relatórios detalhados gerados por algoritmos preditivos focados em otimização do estilo de vida, nutrição e hábitos diários.
6. **✍️ Agendamento Unificado na Rede Credenciada**: Fluxo restrito e inteligente de marcações (Hospital, Clínica, UBS ou Unidade Móvel) com validação e geração automática de resumo de dados antes da confirmação do agendamento.
7. **🏃‍♂️ Mapeamento de Atividade Física**: Integração com sensores simulados para monitoramento ativo de modalidades (Caminhada/Corrida), computando métricas como distância, passos, velocidade instantânea, velocidade média e relevo do trajeto.
8. **🚨 Central Telefônica de Emergência**: Acesso rápido a números diretos e canais úteis de utilidade pública e assistência médica imediata (ex: SAMU 192).

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando práticas modernas de desenvolvimento web, garantindo alta performance e renderização imediata:

* **React (v18+)**: Biblioteca base para construção da interface baseada em componentes reativos.
* **JavaScript (ES6+)**: Lógica algorítmica e controle de estados assíncronos.
* **Componentização com CSS-in-JS (Styles Object)**: Design modular, limpo e adaptável sem dependências externas pesadas de CSS, facilitando a otimização para conexões de baixa velocidade.
* **Políticas de Acessibilidade Visual**: Escolha de paleta baseada em tons de azul e verde desaturados (`#1a5f60`, `#2b9393`), priorizando excelente contraste textual e legibilidade sob qualquer tela.

---

## 📦 Estrutura do Arquivo Principal (`App.jsx`)

A arquitetura do componente central está particionada de maneira modular para facilitar expansões futuras:

* **Gerenciamento de Estados Globais (`useState`)**: Concentra dados de navegação interna (`currentPage`), coleções de agendamentos (`appointments`), unidades ativas registradas (`healthUnits`), loops de leitura dos sensores de atividades (`activityInterval`) e estados de digitação do usuário.
* **Efeitos de Ciclo de Vida (`useEffect`)**: Pipeline assíncrono programado via `Promise.all` para carregar dados externos da API REST (`/appointments` e `/health-units`) de forma paralela e homogênea na inicialização da aplicação.
* **Fluxo de Validação de Agendamento**: Mecanismo reativo que monitora os inputs de *Cidade, Rede, Especialidade, Médico, Data* e *Hora*. O botão de envio definitivo e a área visual do resumo permanecem ocultos até que todos os critérios de validação sejam integralmente satisfeitos.

---

## 🔧 Como Executar o Projeto

### Pré-requisitos
Certifique-se de possuir o **Node.js** (versão 16 ou superior) instalado em sua máquina.

### Passos para Instalação

1. Clone o repositório para o seu ambiente local:
   ```bash
   git clone [https://github.com/seu-usuario/saude-para-todos.git](https://github.com/seu-usuario/saude-para-todos.git)
