// Global variables
let currentPage = 'dashboard';
let pacientes = [];
let medicamentos = [];
let filteredPacientes = [];
let filteredMedicamentos = [];
let editingMedicamentoId = null;
let currentPacienteId = null;
//let prontuarios = {}; // REMOVIDO: Dados agora são armazenados diretamente nos pacientes

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    loadDataFromLocalStorage(); // Carregar dados do localStorage
    initializeData(); // Inicializar dados mock se localStorage estiver vazio
    showPage('dashboard');
    setupEventListeners();
    
    // Add prescricao form event listener
    document.getElementById('prescricaoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePrescricao();
    });
    
    // Modal close on outside click for prescricao
    document.getElementById('prescricaoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePrescricaoModal();
        }
    });

    // Add cadastroMedicamentoPrescricao form event listener
    document.getElementById('cadastroMedicamentoPrescricaoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNewMedicamentoFromPrescricao(); // Renomeada para clareza
    });

    // Modal close on outside click for cadastroMedicamentoPrescricao
    document.getElementById('cadastroMedicamentoPrescricaoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCadastroMedicamentoPrescricaoModal();
        }
    });
});

// Load data from localStorage or initialize mock data
function loadDataFromLocalStorage() {
    const storedPacientes = localStorage.getItem('pacientes');
    const storedMedicamentos = localStorage.getItem('medicamentos');

    if (storedPacientes) {
        pacientes = JSON.parse(storedPacientes);
    }
    if (storedMedicamentos) {
        medicamentos = JSON.parse(storedMedicamentos);
    }
}

// Initialize mock data (only if localStorage is empty)
function initializeData() {
    if (pacientes.length === 0 && medicamentos.length === 0) {
        // Mock pacientes data
        pacientes = [
            {
                id: 1,
                nome: "Maria Silva Santos",
                cpf: "123.456.789-00",
                cartaoSus: "123456789012345", // Renomeado para camelCase
                dataNascimento: "1985-03-15", // Renomeado para camelCase
                telefone: "(98) 99999-1234",
                email: "maria.silva@email.com",
                endereco: "Rua das Flores, 123, Centro, Coelho Neto - MA, 65620-000",
                status: "Ativo",
                dataCadastro: "2024-01-15", // Renomeado para camelCase
                prescricoes: [ // Adicionado campo para prescrições
                    {
                        id: 101,
                        medicamento: 'Sertralina 50mg',
                        fabricante: 'EMS',
                        lote: 'ABC123',
                        quantidade: 30,
                        dosagem: '1 comprimido ao dia',
                        duracao: '30 dias',
                        dataDispensacao: '2024-09-15',
                        proximaRetirada: '2024-10-15',
                        funcionario: 'Ana Silva - Farmacêutica',
                        observacoes: 'Paciente orientado sobre horário de administração',
                        status: 'Ativa'
                    },
                    {
                        id: 102,
                        medicamento: 'Clonazepam 2mg',
                        fabricante: 'Medley',
                        lote: 'DEF456',
                        quantidade: 15,
                        dosagem: 'Meio comprimido à noite',
                        duracao: '15 dias',
                        dataDispensacao: '2024-09-10',
                        proximaRetirada: '2024-09-25',
                        funcionario: 'Carlos Santos - Técnico em Farmácia',
                        observacoes: 'Medicamento controlado - receita retida',
                        status: 'Ativa'
                    }
                ],
                historico: [ // Adicionado campo para histórico
                    {
                        id: 1001,
                        tipo: 'Atendimento',
                        data: '2024-09-15',
                        descricao: 'Consulta de acompanhamento',
                        detalhes: 'Paciente relatou melhora nos sintomas de ansiedade.',
                        funcionario: 'Dr. João Pereira'
                    }
                ]
            },
            {
                id: 2,
                nome: "João Oliveira Costa",
                cpf: "987.654.321-00",
                cartaoSus: "987654321098765",
                dataNascimento: "1978-07-22",
                telefone: "(98) 98888-5678",
                email: "joao.costa@email.com",
                endereco: "Av. Principal, 456, São José, Coelho Neto - MA, 65620-000",
                status: "Ativo",
                dataCadastro: "2024-02-10",
                prescricoes: [],
                historico: []
            },
            {
                id: 3,
                nome: "Ana Paula Ferreira",
                cpf: "456.789.123-00",
                cartaoSus: "456789123456789",
                dataNascimento: "1992-11-08",
                telefone: "(98) 97777-9012",
                email: "ana.ferreira@email.com",
                endereco: "Rua da Paz, 789, Vila Nova, Coelho Neto - MA, 65620-000",
                status: "Inativo",
                dataCadastro: "2024-03-05",
                prescricoes: [],
                historico: []
            }
        ];

        // Mock medicamentos data
        medicamentos = [
            {
                id: 1,
                nome: "Paracetamol",
                principio_ativo: "Paracetamol",
                concentracao: "500mg",
                forma_farmaceutica: "Comprimido",
                fabricante: "EMS",
                lote: "ABC123",
                data_validade: "2025-12-31",
                quantidade_estoque: 150,
                quantidade_minima: 20,
                observacoes: "Medicamento para dor e febre",
                data_cadastro: "2024-01-15"
            },
            {
                id: 2,
                nome: "Ibuprofeno",
                principio_ativo: "Ibuprofeno",
                concentracao: "400mg",
                forma_farmaceutica: "Comprimido",
                fabricante: "Medley",
                lote: "DEF456",
                data_validade: "2024-06-30", // Vencido em breve
                quantidade_estoque: 5,
                quantidade_minima: 15,
                observacoes: "Anti-inflamatório",
                data_cadastro: "2024-02-10"
            },
            {
                id: 3,
                nome: "Dipirona",
                principio_ativo: "Dipirona Sódica",
                concentracao: "500mg",
                forma_farmaceutica: "Comprimido",
                fabricante: "Neo Química",
                lote: "GHI789",
                data_validade: "2026-03-15",
                quantidade_estoque: 0,
                quantidade_minima: 25,
                observacoes: "Analgésico e antitérmico",
                data_cadastro: "2024-03-05"
            },
            {
                id: 4,
                nome: "Sertralina",
                principio_ativo: "Cloridrato de Sertralina",
                concentracao: "50mg",
                forma_farmaceutica: "Comprimido",
                fabricante: "EMS",
                lote: "XYZ789",
                data_validade: "2025-08-31",
                quantidade_estoque: 100,
                quantidade_minima: 10,
                observacoes: "Antidepressivo",
                data_cadastro: "2024-04-01"
            },
            {
                id: 5,
                nome: "Clonazepam",
                principio_ativo: "Clonazepam",
                concentracao: "2mg",
                forma_farmaceutica: "Comprimido",
                fabricante: "Medley",
                lote: "LMN012",
                data_validade: "2025-05-31",
                quantidade_estoque: 50,
                quantidade_minima: 5,
                observacoes: "Ansiolítico",
                data_cadastro: "2024-04-01"
            }
        ];

        // Salvar dados mock no localStorage
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    }

    filteredPacientes = [...pacientes];
    filteredMedicamentos = [...medicamentos];
    updateStats();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchPacientes').addEventListener('input', function(e) {
        filterPacientes(e.target.value);
    });

    document.getElementById('searchMedicamentos').addEventListener('input', function(e) {
        filterMedicamentos();
    });

    document.getElementById('filtroEstoque').addEventListener('change', function(e) {
        filterMedicamentos();
    });

    // Form submissions
    document.getElementById('pacienteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePaciente();
    });

    document.getElementById('medicamentoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMedicamento();
    });

    // Dispensação form submission
    document.getElementById('dispensacaoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDispensacao();
    });

    // Modal close on outside click
    document.getElementById('medicamentoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeMedicamentoModal();
        }
    });

    // Modal close on outside click
    document.getElementById('dispensacaoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDispensacaoModal();
        }
    });

    document.getElementById('editarPacienteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditarPaciente();
    });

    document.getElementById('editarPacienteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditarPacienteModal();
        }
    });
}

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    document.getElementById(pageId + '-page').classList.remove('hidden');
    document.getElementById(pageId + '-page').classList.add('fade-in');

    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-600', 'border-blue-600');
        btn.classList.add('text-gray-600', 'border-transparent');
    });

    const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-600', 'border-transparent');
        activeBtn.classList.add('text-blue-600', 'border-blue-600');
    }

    currentPage = pageId;

    // Update page-specific content
    if (pageId === 'pacientes') {
        renderPacientes();
    } else if (pageId === 'almoxarifado') {
        renderMedicamentos();
        updateStockAlerts();
    } else if (pageId === 'prontuario') {
        // This page is shown via viewPaciente, so no need to explicitly call render here
    } else if (pageId === 'relatorio-geral') { // Carregar relatório quando a página for acessada
        renderizarRelatorio();
    }

    // Recreate icons for the new page
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// Update statistics
function updateStats() {
    document.getElementById('totalPacientes').textContent = pacientes.length;
    document.getElementById('pacientesAtivos').textContent = pacientes.filter(p => p.status === 'Ativo').length;
    document.getElementById('totalMedicamentos').textContent = medicamentos.length;
    document.getElementById('medicamentosEstoque').textContent = medicamentos.filter(m => m.quantidade_estoque > 0).length;
}

// Pacientes functions
function filterPacientes(searchTerm) {
    if (!searchTerm.trim()) {
        filteredPacientes = [...pacientes];
    } else {
        filteredPacientes = pacientes.filter(paciente =>
            paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paciente.cpf.includes(searchTerm) ||
            paciente.cartaoSus.includes(searchTerm) // Usando camelCase
        );
    }
    renderPacientes();
}

function renderPacientes() {
    const tbody = document.getElementById('pacientesTableBody');
    const count = document.getElementById('pacientesCount');
    
    count.textContent = `${filteredPacientes.length} paciente${filteredPacientes.length !== 1 ? 's' : ''} encontrado${filteredPacientes.length !== 1 ? 's' : ''}`;

    if (filteredPacientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                    Nenhum paciente encontrado
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredPacientes.map(paciente => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div>
                    <div class="font-medium text-gray-900">${paciente.nome}</div>
                    <div class="text-sm text-gray-500">${formatDate(paciente.dataNascimento)}</div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${paciente.cpf}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${paciente.cartaoSus}</td>
            <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paciente.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${paciente.status}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="viewPaciente(${paciente.id})" class="text-blue-600 hover:text-blue-800 p-1">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button onclick="editPaciente(${paciente.id})" class="text-green-600 hover:text-green-800 p-1">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deletePaciente(${paciente.id})" class="text-red-600 hover:text-red-800 p-1">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    lucide.createIcons();
}

function savePaciente() {
    const form = document.getElementById('pacienteForm');
    const formData = new FormData(form);
    
    const cpf = formData.get('cpf');
    const cartaoSus = formData.get('cartao_sus');
    
    // Verificar se já existe paciente com mesmo CPF
    const cpfExistente = pacientes.find(p => p.cpf === cpf);
    if (cpfExistente) {
        alert('Já existe um paciente cadastrado com este CPF!');
        return;
    }
    
    // Verificar se já existe paciente com mesmo Cartão SUS
    const cartaoExistente = pacientes.find(p => p.cartaoSus === cartaoSus); // Usando camelCase
    if (cartaoExistente) {
        alert('Já existe um paciente cadastrado com este Cartão SUS!');
        return;
    }
    
    const paciente = {
        id: Date.now(),
        nome: formData.get('nome'),
        cpf: cpf,
        cartaoSus: cartaoSus, // Usando camelCase
        dataNascimento: formData.get('data_nascimento'), // Usando camelCase
        telefone: formData.get('telefone'),
        email: formData.get('email'),
        endereco: formData.get('endereco'),
        observacoes: formData.get('observacoes'),
        prontuarioLivre: formData.get('prontuario_livre'), // Novo campo
        status: 'Ativo',
        dataCadastro: new Date().toISOString().split('T')[0], // Renomeado para camelCase
        prescricoes: [], // Inicializa com array vazio
        historico: [] // Inicializa com array vazio
    };

    pacientes.push(paciente);
    filteredPacientes = [...pacientes];
    updateStats();
    
    localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Salvar no localStorage
    
    alert('Paciente cadastrado com sucesso!');
    form.reset();
    showPage('pacientes');
}

function viewPaciente(id) {
    const paciente = pacientes.find(p => p.id === id);
    if (paciente) {
        loadProntuarioData(paciente.id); // Chama a nova função para carregar dados do prontuário
        showPage('prontuario');
    }
}

function loadProntuarioData(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (!paciente) return;

    currentPacienteId = pacienteId;

    // Atualizar informações básicas
    document.getElementById('prontuario-paciente-nome').textContent = `Prontuário - ${paciente.nome}`;
    document.getElementById('prontuario-paciente-info').textContent = `CPF: ${paciente.cpf} | Cartão SUS: ${paciente.cartaoSus}`; // Usando camelCase

    // Informações básicas
    const infoBasica = document.getElementById('prontuario-info-basica');
    infoBasica.innerHTML = `
        <div>
            <p class="text-sm font-medium text-gray-500">Nome Completo</p>
            <p class="text-gray-900">${paciente.nome}</p>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Data de Nascimento</p>
            <p class="text-gray-900">${formatDate(paciente.dataNascimento)}</p>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Telefone</p>
            <p class="text-gray-900">${paciente.telefone}</p>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Email</p>
            <p class="text-gray-900">${paciente.email}</p>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paciente.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${paciente.status}</span>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Endereço</p>
            <p class="text-gray-900">${paciente.endereco}</p>
        </div>
        <div>
            <p class="text-sm font-medium text-gray-500">Prontuário Livre</p>
            <p class="text-gray-900">${paciente.prontuarioLivre || 'Nenhuma informação adicional'}</p>
        </div>
    `;

    // Carregar medicamentos prescritos
    loadMedicamentosPrescritos(paciente);

    // Carregar histórico
    loadHistorico(paciente);

    // Mostrar primeira aba (medicamentos)
    showProntuarioTab('medicamentos');
}

function editPaciente(id) {
    const paciente = pacientes.find(p => p.id === id);
    if (paciente) {
        // Preencher o formulário com os dados do paciente
        document.getElementById('edit_paciente_id').value = paciente.id;
        document.getElementById('edit_nome').value = paciente.nome;
        document.getElementById('edit_cpf').value = paciente.cpf;
        document.getElementById('edit_cartao_sus').value = paciente.cartaoSus; // Usando camelCase
        document.getElementById('edit_data_nascimento').value = paciente.dataNascimento; // Usando camelCase
        document.getElementById('edit_telefone').value = paciente.telefone || '';
        document.getElementById('edit_email').value = paciente.email || '';
        document.getElementById('edit_endereco').value = paciente.endereco || '';
        document.getElementById('edit_observacoes').value = paciente.observacoes || '';
        document.getElementById('edit_status').value = paciente.status;
        
        // Abrir o modal
        document.getElementById('editarPacienteModal').classList.add('show');
    }
}

function closeEditarPacienteModal() {
    document.getElementById('editarPacienteModal').classList.remove('show');
}

function saveEditarPaciente() {
    const form = document.getElementById('editarPacienteForm');
    const formData = new FormData(form);
    
    const pacienteId = parseInt(formData.get('id'));
    const cpf = formData.get('cpf');
    const cartaoSus = formData.get('cartao_sus');
    
    // Verificar se já existe outro paciente com mesmo CPF (exceto o atual)
    const cpfExistente = pacientes.find(p => p.cpf === cpf && p.id !== pacienteId);
    if (cpfExistente) {
        alert('Já existe outro paciente cadastrado com este CPF!');
        return;
    }
    
    // Verificar se já existe outro paciente com mesmo Cartão SUS (exceto o atual)
    const cartaoExistente = pacientes.find(p => p.cartaoSus === cartaoSus && p.id !== pacienteId); // Usando camelCase
    if (cartaoExistente) {
        alert('Já existe outro paciente cadastrado com este Cartão SUS!');
        return;
    }
    
    // Encontrar o paciente e atualizar os dados
    const pacienteIndex = pacientes.findIndex(p => p.id === pacienteId);
    if (pacienteIndex !== -1) {
        pacientes[pacienteIndex] = {
            ...pacientes[pacienteIndex],
            nome: formData.get('nome'),
            cpf: cpf,
            cartaoSus: cartaoSus, // Usando camelCase
            dataNascimento: formData.get('data_nascimento'), // Usando camelCase
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            endereco: formData.get('endereco'),
            observacoes: formData.get('observacoes'),
            status: formData.get('status')
        };
        
        // Atualizar a lista filtrada
        filteredPacientes = [...pacientes];
        
        // Aplicar filtro atual se houver
        const searchTerm = document.getElementById('searchPacientes').value;
        if (searchTerm.trim()) {
            filterPacientes(searchTerm);
        } else {
            renderPacientes();
        }
        
        updateStats();
        localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Salvar no localStorage
        
        alert('Informações do paciente atualizadas com sucesso!');
        closeEditarPacienteModal();
    }
}

function deletePaciente(id) {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        pacientes = pacientes.filter(p => p.id !== id);
        filteredPacientes = pacientes.filter(p => 
            document.getElementById('searchPacientes').value === '' ||
            p.nome.toLowerCase().includes(document.getElementById('searchPacientes').value.toLowerCase()) ||
            p.cpf.includes(document.getElementById('searchPacientes').value) ||
            p.cartaoSus.includes(document.getElementById('searchPacientes').value) // Usando camelCase
        );
        updateStats();
        renderPacientes();
        localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Salvar no localStorage
        alert('Paciente excluído com sucesso!');
    }
}

// Medicamentos functions
function filterMedicamentos() {
    const searchTerm = document.getElementById('searchMedicamentos').value;
    const filtroEstoque = document.getElementById('filtroEstoque').value;
    
    let filtered = [...medicamentos];
    
    // Aplicar filtro de busca por texto
    if (searchTerm.trim()) {
        filtered = filtered.filter(medicamento =>
            medicamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicamento.principio_ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicamento.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Aplicar filtro de estoque
    if (filtroEstoque !== 'todos') {
        filtered = filtered.filter(medicamento => {
            const status = getEstoqueStatus(medicamento).status;
            return status === filtroEstoque;
        });
    }
    
    filteredMedicamentos = filtered;
    renderMedicamentos();
    updateStockAlerts();
}

function renderMedicamentos() {
    const tbody = document.getElementById('medicamentosTableBody');
    const count = document.getElementById('medicamentosCount');
    
    count.textContent = `${filteredMedicamentos.length} medicamento${filteredMedicamentos.length !== 1 ? 's' : ''} encontrado${filteredMedicamentos.length !== 1 ? 's' : ''}`;

    if (filteredMedicamentos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    Nenhum medicamento encontrado
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredMedicamentos.map(medicamento => {
        const estoqueStatus = getEstoqueStatus(medicamento);
        const expired = isExpired(medicamento.data_validade);
        const expiringSoon = isExpiringSoon(medicamento.data_validade);

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div>
                        <div class="font-medium text-gray-900">${medicamento.nome}</div>
                        <div class="text-sm text-gray-500">${medicamento.principio_ativo} - ${medicamento.concentracao}</div>
                        <div class="text-xs text-gray-400">${medicamento.forma_farmaceutica}</div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">${medicamento.fabricante}</td>
                <td class="px-6 py-4 text-sm font-mono">${medicamento.lote}</td>
                <td class="px-6 py-4">
                    <div class="flex flex-col">
                        <span class="text-sm ${expired ? 'text-red-600 font-medium' : expiringSoon ? 'text-yellow-600 font-medium' : 'text-gray-900'}">
                            ${formatDate(medicamento.data_validade)}
                        </span>
                        ${expired ? '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mt-1">Vencido</span>' : ''}
                        ${expiringSoon && !expired ? '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1">Vence em breve</span>' : ''}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <div class="font-medium">${medicamento.quantidade_estoque} unidades</div>
                        <div class="text-gray-500">Mín: ${medicamento.quantidade_minima}</div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estoqueStatus.color}">
                        ${estoqueStatus.label}
                    </span>
                </td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="editMedicamento(${medicamento.id})" class="text-blue-600 hover:text-blue-800 p-1">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteMedicamento(${medicamento.id})" class="text-red-600 hover:text-red-800 p-1">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    lucide.createIcons();
}

function updateStockAlerts() {
    const semEstoque = filteredMedicamentos.filter(m => m.quantidade_estoque === 0).length;
    const estoqueBaixo = filteredMedicamentos.filter(m => m.quantidade_estoque > 0 && m.quantidade_estoque <= m.quantidade_minima).length;
    const estoqueOk = filteredMedicamentos.filter(m => m.quantidade_estoque > m.quantidade_minima).length;

    document.getElementById('semEstoque').textContent = semEstoque;
    document.getElementById('estoqueBaixo').textContent = estoqueBaixo;
    document.getElementById('estoqueOk').textContent = estoqueOk;
}

function getEstoqueStatus(medicamento) {
    if (medicamento.quantidade_estoque === 0) {
        return { status: 'sem-estoque', label: 'Sem Estoque', color: 'bg-red-100 text-red-800' };
    } else if (medicamento.quantidade_estoque <= medicamento.quantidade_minima) {
        return { status: 'estoque-baixo', label: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-800' };
    } else {
        return { status: 'estoque-ok', label: 'Estoque OK', color: 'bg-green-100 text-green-800' };
    }
}

function openMedicamentoModal() {
    editingMedicamentoId = null;
    document.getElementById('modalTitle').textContent = 'Cadastrar Novo Medicamento';
    document.getElementById('submitButtonText').textContent = 'Cadastrar';
    document.getElementById('medicamentoForm').reset();
    document.getElementById('medicamentoModal').classList.add('show');
}

function closeMedicamentoModal() {
    document.getElementById('medicamentoModal').classList.remove('show');
    editingMedicamentoId = null;
}

function editMedicamento(id) {
    const medicamento = medicamentos.find(m => m.id === id);
    if (medicamento) {
        editingMedicamentoId = id;
        document.getElementById('modalTitle').textContent = 'Editar Medicamento';
        document.getElementById('submitButtonText').textContent = 'Atualizar';
        
        // Fill form with medicamento data
        document.getElementById('med_nome').value = medicamento.nome;
        document.getElementById('med_principio_ativo').value = medicamento.principio_ativo;
        document.getElementById('med_concentracao').value = medicamento.concentracao;
        document.getElementById('med_forma_farmaceutica').value = medicamento.forma_farmaceutica;
        document.getElementById('med_fabricante').value = medicamento.fabricante;
        document.getElementById('med_lote').value = medicamento.lote;
        document.getElementById('med_data_validade').value = medicamento.data_validade;
        document.getElementById('med_quantidade_estoque').value = medicamento.quantidade_estoque;
        document.getElementById('med_quantidade_minima').value = medicamento.quantidade_minima;
        document.getElementById('med_observacoes').value = medicamento.observacoes || '';
        
        document.getElementById('medicamentoModal').classList.add('show');
    }
}

function saveMedicamento() {
    const form = document.getElementById('medicamentoForm');
    const formData = new FormData(form);
    
    const nome = formData.get('nome');
    const fabricante = formData.get('fabricante');
    const lote = formData.get('lote');
    
    // Verificar se já existe medicamento com mesmo nome, fabricante e lote (exceto se estiver editando)
    const medicamentoExistente = medicamentos.find(m => 
        m.nome.toLowerCase() === nome.toLowerCase() && 
        m.fabricante.toLowerCase() === fabricante.toLowerCase() && 
        m.lote.toLowerCase() === lote.toLowerCase() &&
        m.id !== editingMedicamentoId
    );
    
    if (medicamentoExistente) {
        alert('Já existe um medicamento cadastrado com o mesmo nome, fabricante e lote!');
        return;
    }
    
    const medicamentoData = {
        nome: nome,
        principio_ativo: formData.get('principio_ativo'),
        concentracao: formData.get('concentracao'),
        forma_farmaceutica: formData.get('forma_farmaceutica'),
        fabricante: fabricante,
        lote: lote,
        data_validade: formData.get('data_validade'),
        quantidade_estoque: parseInt(formData.get('quantidade_estoque')),
        quantidade_minima: parseInt(formData.get('quantidade_minima')),
        observacoes: formData.get('observacoes')
    };

    if (editingMedicamentoId) {
        // Update existing medicamento
        const index = medicamentos.findIndex(m => m.id === editingMedicamentoId);
        if (index !== -1) {
            medicamentos[index] = { ...medicamentos[index], ...medicamentoData };
            alert('Medicamento atualizado com sucesso!');
        }
    } else {
        // Add new medicamento
        const newMedicamento = {
            id: Date.now(),
            ...medicamentoData,
            data_cadastro: new Date().toISOString().split('T')[0]
        };
        medicamentos.push(newMedicamento);
        alert('Medicamento cadastrado com sucesso!');
    }

    filteredMedicamentos = [...medicamentos];
    updateStats();
    renderMedicamentos();
    updateStockAlerts();
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos)); // Salvar no localStorage
    closeMedicamentoModal();
}

function deleteMedicamento(id) {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
        medicamentos = medicamentos.filter(m => m.id !== id);
        filteredMedicamentos = medicamentos.filter(m => 
            document.getElementById('searchMedicamentos').value === '' ||
            m.nome.toLowerCase().includes(document.getElementById('searchMedicamentos').value.toLowerCase()) ||
            m.principio_ativo.toLowerCase().includes(document.getElementById('searchMedicamentos').value.toLowerCase()) ||
            m.fabricante.toLowerCase().includes(document.getElementById('searchMedicamentos').value.toLowerCase())
        );
        updateStats();
        renderMedicamentos();
        updateStockAlerts();
        localStorage.setItem('medicamentos', JSON.stringify(medicamentos)); // Salvar no localStorage
        alert('Medicamento excluído com sucesso!');
    }
}

function showProntuarioTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.prontuario-tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-500', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-gray-500');
        activeBtn.classList.add('border-blue-500', 'text-blue-600');
    }

    // Update tab content
    document.querySelectorAll('.prontuario-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');

    // Load tab-specific content
    if (tabName === 'consultas') {
        // loadConsultas(); // REMOVIDO
    } else if (tabName === 'medicamentos') {
        loadMedicamentosPrescritos(pacientes.find(p => p.id === currentPacienteId)); // Passa o paciente atual
    } else if (tabName === 'exames') {
        // loadExames(); // REMOVIDO
    } else if (tabName === 'historico') {
        loadHistorico(pacientes.find(p => p.id === currentPacienteId)); // Passa o paciente atual
    }

    lucide.createIcons();
}

function loadMedicamentosPrescritos(paciente) {
    const medicamentosList = document.getElementById('medicamentos-prescritos-list');
    
    if (!paciente.prescricoes || paciente.prescricoes.length === 0) {
        medicamentosList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i data-lucide="pill" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                <p>Nenhum medicamento prescrito ainda.</p>
                <p class="text-sm">Use o botão "Nova Prescrição" para adicionar medicamentos.</p>
            </div>
        `;
        return;
    }

    medicamentosList.innerHTML = paciente.prescricoes.map(prescricao => `
        <div class="bg-gray-50 rounded-lg p-4 border">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h5 class="font-semibold text-gray-900">${prescricao.medicamento}</h5>
                    <p class="text-sm text-gray-600">${prescricao.fabricante} - Lote: ${prescricao.lote}</p>
                </div>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    prescricao.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">${prescricao.status}</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-gray-600"><strong>Dosagem:</strong> ${prescricao.dosagem}</p>
                    <p class="text-gray-600"><strong>Duração:</strong> ${prescricao.duracao}</p>
                    <p class="text-gray-600"><strong>Quantidade:</strong> ${prescricao.quantidade} unidades</p>
                </div>
                <div>
                    <p class="text-gray-600"><strong>Data da Dispensação:</strong> ${new Date(prescricao.dataDispensacao).toLocaleDateString('pt-BR')}</p>
                    <p class="text-gray-600"><strong>Próxima Retirada:</strong> ${new Date(prescricao.proximaRetirada).toLocaleDateString('pt-BR')}</p>
                    <p class="text-gray-600"><strong>Funcionário:</strong> ${prescricao.funcionario}</p>
                </div>
            </div>
            
            ${prescricao.observacoes ? `
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <p class="text-sm text-gray-600"><strong>Observações:</strong> ${prescricao.observacoes}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
    lucide.createIcons();
}

function loadHistorico(paciente) {
    const historicoList = document.getElementById('historico-list');
    
    if (!paciente.historico || paciente.historico.length === 0) {
        historicoList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i data-lucide="clock" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                <p>Nenhum registro no histórico ainda.</p>
            </div>
        `;
        return;
    }

    // Ordenar histórico por data (mais recente primeiro)
    const historicoOrdenado = [...paciente.historico].sort((a, b) => new Date(b.data) - new Date(a.data));

    historicoList.innerHTML = historicoOrdenado.map(item => `
        <div class="flex gap-4 p-4 bg-gray-50 rounded-lg border">
            <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i data-lucide="${item.tipo === 'Prescrição' ? 'pill' : item.tipo === 'Dispensação' ? 'shopping-bag' : 'file-text'}" class="w-5 h-5 text-blue-600"></i>
                </div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h5 class="font-semibold text-gray-900">${item.descricao}</h5>
                    <span class="text-sm text-gray-500">${new Date(item.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">${item.detalhes}</p>
                <p class="text-xs text-gray-500">Responsável: ${item.funcionario}</p>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function openConsultaModal() {
    document.getElementById('consultaForm').reset();
    document.getElementById('consulta_data').value = new Date().toISOString().split('T')[0];
    document.getElementById('consultaModal').classList.add('show');
}

function closeConsultaModal() {
    document.getElementById('consultaModal').classList.remove('show');
}

function saveConsulta() {
    const form = document.getElementById('consultaForm');
    const formData = new FormData(form);
    
    const consulta = {
        id: Date.now(),
        data: formData.get('data'),
        profissional: formData.get('profissional'),
        queixa: formData.get('queixa'),
        observacoes: formData.get('observacoes'),
        status: 'Concluída'
    };

    // Adicionar ao histórico do paciente
    if (!pacientes.find(p => p.id === currentPacienteId).historico) {
        pacientes.find(p => p.id === currentPacienteId).historico = [];
    }
    
    const historicoItem = {
        id: Date.now() + 1,
        tipo: 'Consulta',
        data: consulta.data,
        descricao: `Consulta realizada com ${consulta.profissional}`,
        detalhes: `Queixa: ${consulta.queixa || 'N/A'} | Observações: ${consulta.observacoes}`,
        funcionario: consulta.profissional
    };
    
    pacientes.find(p => p.id === currentPacienteId).historico.push(historicoItem);

    localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Salvar no localStorage

    alert('Consulta registrada com sucesso!');
    closeConsultaModal();
    loadHistorico(pacientes.find(p => p.id === currentPacienteId)); // Atualiza o histórico na tela
}

// Placeholder functions for other modals
// function openExameModal() {
//     alert('Funcionalidade de solicitação de exames será implementada em breve');
// }

// New functions for Dispensação
function loadMedicamentosDispensados() {
    const medicamentosList = document.getElementById('medicamentos-dispensados-list');
    const paciente = pacientes.find(p => p.id === currentPacienteId);
    const dispensacoes = paciente?.dispensacoes || [];

    if (dispensacoes.length === 0) {
        medicamentosList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i data-lucide="pill" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                <p>Nenhuma dispensação registrada</p>
                <p class="text-sm mt-2">Clique em "Registrar Dispensação" para adicionar um novo registro</p>
            </div>
        `;
        return;
    }

    medicamentosList.innerHTML = dispensacoes.map(disp => {
        const isVencido = new Date(disp.proximaRetirada) < new Date(); // Usando camelCase
        const statusColor = disp.status === 'Dispensado' ? (isVencido ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800') : 'bg-gray-100 text-gray-800';
        const statusText = isVencido ? 'Vencido' : disp.status;

        return `
            <div class="border rounded-lg p-6 hover:bg-gray-50">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h5 class="text-lg font-medium text-gray-900">${disp.medicamento}</h5>
                        <p class="text-sm text-gray-600">Quantidade: ${disp.quantidade} unidades</p>
                    </div>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColor}">
                        ${statusText}
                    </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Dispensação</label>
                        <p class="mt-1 text-sm text-gray-900">${formatDate(disp.dataDispensacao)}</p>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Retirada</label>
                        <p class="mt-1 text-sm ${isVencido ? 'text-red-600 font-medium' : 'text-gray-900'}">${formatDate(disp.proximaRetirada)}</p>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário Responsável</label>
                        <p class="mt-1 text-sm text-gray-900">${disp.funcionario}</p>
                    </div>
                </div>
                
                ${disp.observacoes ? `
                    <div class="border-t pt-3">
                        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</label>
                        <p class="mt-1 text-sm text-gray-700">${disp.observacoes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function openDispensacaoModal() {
    // Populate medicamentos dropdown
    const select = document.getElementById('disp_medicamento');
    select.innerHTML = '<option value="">Selecione o medicamento</option>' + 
        medicamentos.filter(m => m.quantidade_estoque > 0).map(med => 
            `<option value="${med.nome} ${med.concentracao}">${med.nome} ${med.concentracao} - Estoque: ${med.quantidade_estoque}</option>`
        ).join('');

    document.getElementById('dispensacaoForm').reset();
    document.getElementById('disp_data_dispensacao').value = new Date().toISOString().split('T')[0];
    
    // Set próxima retirada para 30 dias a partir de hoje
    const proximaRetirada = new Date();
    proximaRetirada.setDate(proximaRetirada.getDate() + 30);
    document.getElementById('disp_proxima_retirada').value = proximaRetirada.toISOString().split('T')[0];
    
    document.getElementById('dispensacaoModal').classList.add('show');
}

function closeDispensacaoModal() {
    document.getElementById('dispensacaoModal').classList.remove('show');
}

function saveDispensacao() {
    const form = document.getElementById('dispensacaoForm');
    const formData = new FormData(form);
    
    const dispensacao = {
        id: Date.now(),
        medicamento: formData.get('medicamento'),
        quantidade: parseInt(formData.get('quantidade')),
        dataDispensacao: formData.get('data_dispensacao'), // Usando camelCase
        proximaRetirada: formData.get('proxima_retirada'), // Usando camelCase
        funcionario: formData.get('funcionario'),
        observacoes: formData.get('observacoes'),
        status: 'Dispensado'
    };

    // Encontrar o medicamento correspondente para atualizar o estoque
    const medicamentoNome = dispensacao.medicamento.split(' - ')[0]; // Pega o nome do medicamento antes do "- Estoque:"
    const medicamento = medicamentos.find(m => `${m.nome} ${m.concentracao}` === medicamentoNome);

    if (medicamento) {
        medicamento.quantidade_estoque -= dispensacao.quantidade;
        if (medicamento.quantidade_estoque < 0) medicamento.quantidade_estoque = 0; // Evita estoque negativo
    }

    // Adicionar ao prontuário do paciente
    const paciente = pacientes.find(p => p.id === currentPacienteId);
    if (paciente) {
        if (!paciente.dispensacoes) {
            paciente.dispensacoes = [];
        }
        paciente.dispensacoes.unshift(dispensacao);

        // Adicionar ao histórico do paciente
        if (!paciente.historico) {
            paciente.historico = [];
        }
        
        const historicoItem = {
            id: Date.now() + 1,
            tipo: 'Dispensação',
            data: dispensacao.dataDispensacao,
            descricao: `Dispensação de ${dispensacao.medicamento}`,
            detalhes: `Quantidade: ${dispensacao.quantidade} unidades | Funcionário: ${dispensacao.funcionario}`,
            funcionario: dispensacao.funcionario
        };
        paciente.historico.push(historicoItem);

        localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Salvar no localStorage
        localStorage.setItem('medicamentos', JSON.stringify(medicamentos)); // Salvar no localStorage
    }
    
    alert('Dispensação registrada com sucesso!');
    closeDispensacaoModal();
    loadMedicamentosDispensados(); // Atualiza a lista de dispensações no prontuário
    updateStockAlerts(); // Atualiza os alertas de estoque
    if (currentPage === 'almoxarifado') {
        renderMedicamentos(); // Atualiza a tabela do almoxarifado
    }
}

function openPrescricaoModal() {
    // Populate medicamentos dropdown with only available stock
    const select = document.getElementById('presc_medicamento');
    const medicamentosDisponiveis = medicamentos.filter(m => m.quantidade_estoque > 0);
    
    // Sempre incluir a opção de cadastrar novo medicamento
    let options = '<option value="">Selecione o medicamento</option>';
    options += '<option value="cadastrar_novo" style="background-color: #f0f9ff; color: #0369a1; font-weight: bold;">+ Cadastrar Novo Medicamento</option>';
    
    if (medicamentosDisponiveis.length > 0) {
        options += medicamentosDisponiveis.map(med => 
            `<option value="${med.id}" data-estoque="${med.quantidade_estoque}" data-nome="${med.nome}" data-concentracao="${med.concentracao}">
                ${med.nome} ${med.concentracao} - Estoque: ${med.quantidade_estoque} unidades
            </option>`
        ).join('');
    }
    
    select.innerHTML = options;

    select.addEventListener('change', function() {
        if (this.value === 'cadastrar_novo') {
            openCadastroMedicamentoPrescricaoModal();
            this.value = ''; // Reset selection
        } else if (this.value) {
            const selectedOption = this.options[this.selectedIndex];
            const estoque = selectedOption.getAttribute('data-estoque');
            document.getElementById('estoque-disponivel').textContent = `Estoque disponível: ${estoque} unidades`;
            document.getElementById('presc_quantidade').max = estoque;
        } else {
            document.getElementById('estoque-disponivel').textContent = 'Estoque disponível: -';
            document.getElementById('presc_quantidade').max = '';
        }
    });

    document.getElementById('prescricaoForm').reset();
    document.getElementById('presc_data_dispensacao').value = new Date().toISOString().split('T')[0];
    
    // Set próxima retirada para 30 dias a partir de hoje
    const proximaRetirada = new Date();
    proximaRetirada.setDate(proximaRetirada.getDate() + 30);
    document.getElementById('presc_proxima_retirada').value = proximaRetirada.toISOString().split('T')[0];
    
    document.getElementById('prescricaoModal').classList.add('show');
}

function closePrescricaoModal() {
    document.getElementById('prescricaoModal').classList.remove('show');
}

function savePrescricao() {
    const form = document.getElementById('prescricaoForm');
    const formData = new FormData(form);

    const prescricao = {
        id: Date.now(),
        medicamento: formData.get('medicamento'),
        quantidade: parseInt(formData.get('quantidade')),
        dosagem: formData.get('dosagem'),
        duracao: formData.get('duracao'),
        dataDispensacao: formData.get('data_dispensacao'),
        proximaRetirada: formData.get('proxima_retirada'),
        funcionario: formData.get('funcionario'),
        observacoes: formData.get('observacoes'),
        status: 'Ativa'
    };

    const paciente = pacientes.find(p => p.id === currentPacienteId);
    if (paciente) {
        if (!paciente.prescricoes) {
            paciente.prescricoes = [];
        }
        paciente.prescricoes.push(prescricao);

        // Adicionar ao histórico do paciente
        if (!paciente.historico) {
            paciente.historico = [];
        }

        const historicoItem = {
            id: Date.now() + 1,
            tipo: 'Prescrição',
            data: prescricao.dataDispensacao,
            descricao: `Prescrição de ${prescricao.medicamento}`,
            detalhes: `Quantidade: ${prescricao.quantidade} unidades | Dosagem: ${prescricao.dosagem} | Duração: ${prescricao.duracao}`,
            funcionario: prescricao.funcionario
        };
        paciente.historico.push(historicoItem);

        localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Salvar no localStorage
    }

    alert('Prescrição registrada com sucesso!');
    closePrescricaoModal();
    loadMedicamentosPrescritos(paciente); // Atualiza a lista de medicamentos prescritos
}

document.getElementById('prescricaoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    savePrescricao();
});

document.getElementById('prescricaoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePrescricaoModal();
    }
});

document.getElementById('prescricaoModal').querySelector('button[type="button"]').addEventListener('click', function() {
    closePrescricaoModal();
});

function openCadastroMedicamentoPrescricaoModal() {
    document.getElementById('cadastroMedicamentoPrescricaoForm').reset();
    document.getElementById('cadastroMedicamentoPrescricaoModal').classList.add('show');
}

function closeCadastroMedicamentoPrescricaoModal() {
    document.getElementById('cadastroMedicamentoPrescricaoModal').classList.remove('show');
}

function saveNewMedicamentoFromPrescricao() { // Renomeada para clareza
    const form = document.getElementById('cadastroMedicamentoPrescricaoForm');
    const formData = new FormData(form);
    
    const novoMedicamento = {
        id: Date.now(),
        nome: formData.get('nome'),
        principio_ativo: formData.get('principio_ativo'),
        concentracao: formData.get('concentracao'),
        forma_farmaceutica: formData.get('forma_farmaceutica'),
        fabricante: formData.get('fabricante'),
        lote: formData.get('lote'),
        data_validade: formData.get('data_validade'),
        quantidade_estoque: parseInt(formData.get('quantidade_estoque')),
        quantidade_minima: parseInt(formData.get('quantidade_minima')),
        observacoes: formData.get('observacoes') || ''
    };

    // Verificar duplicatas
    const medicamentoExistente = medicamentos.find(m => 
        m.nome.toLowerCase() === novoMedicamento.nome.toLowerCase() && 
        m.fabricante.toLowerCase() === novoMedicamento.fabricante.toLowerCase() && 
        m.lote.toLowerCase() === novoMedicamento.lote.toLowerCase()
    );

    if (medicamentoExistente) {
        alert('Já existe um medicamento cadastrado com o mesmo nome, fabricante e lote.');
        return;
    }

    // Adicionar o novo medicamento
    medicamentos.push(novoMedicamento);
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

    // Fechar modal de cadastro
    closeCadastroMedicamentoPrescricaoModal();

    // Atualizar dropdown de medicamentos na prescrição
    const select = document.getElementById('presc_medicamento');
    const medicamentosDisponiveis = medicamentos.filter(m => m.quantidade_estoque > 0);
    
    let options = '<option value="">Selecione o medicamento</option>';
    options += '<option value="cadastrar_novo" style="background-color: #f0f9ff; color: #0369a1; font-weight: bold;">+ Cadastrar Novo Medicamento</option>';
    
    options += medicamentosDisponiveis.map(med => 
        `<option value="${med.id}" data-estoque="${med.quantidade_estoque}" data-nome="${med.nome}" data-concentracao="${med.concentracao}">
            ${med.nome} ${med.concentracao} - Estoque: ${med.quantidade_estoque} unidades
        </option>`
    ).join('');
    
    select.innerHTML = options;

    // Selecionar automaticamente o medicamento recém-cadastrado
    select.value = novoMedicamento.id;
    document.getElementById('estoque-disponivel').textContent = `Estoque disponível: ${novoMedicamento.quantidade_estoque} unidades`;
    document.getElementById('presc_quantidade').max = novoMedicamento.quantidade_estoque;

    // Atualizar estatísticas e alertas
    updateStockAlerts();
    if (currentPage === 'almoxarifado') {
        renderMedicamentos();
    }

    alert('Medicamento cadastrado com sucesso e selecionado para prescrição!');
}

function exportarMedicamentosPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações iniciais
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Relatório de Medicamentos', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
    yPosition += 10;

    doc.text(`Total de medicamentos: ${medicamentos.length}`, margin, yPosition);
    yPosition += 20;

    // Dados dos medicamentos
    medicamentos.forEach((medicamento, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = margin;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${medicamento.nome} (${medicamento.concentracao})`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const infos = [
            `Princípio Ativo: ${medicamento.principio_ativo}`,
            `Forma Farmacêutica: ${medicamento.forma_farmaceutica}`,
            `Fabricante: ${medicamento.fabricante}`,
            `Lote: ${medicamento.lote}`,
            `Data de Validade: ${formatarData(medicamento.data_validade)}`,
            `Quantidade em Estoque: ${medicamento.quantidade_estoque}`,
            `Quantidade Mínima: ${medicamento.quantidade_minima}`,
            `Observações: ${medicamento.observacoes || 'Nenhuma'}`
        ];

        infos.forEach(info => {
            doc.text(info, margin + 5, yPosition);
            yPosition += 5;
        });

        yPosition += 10;
    });

    // Salvar o PDF
    doc.save(`relatorio-medicamentos-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function isExpiringSoon(dateString) {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
}

function isExpired(dateString) {
    const today = new Date();
    const expiryDate = new Date(dateString);
    return expiryDate < today;
}

function resetForm(formId) {
    document.getElementById(formId).reset();
}

function logout() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        localStorage.removeItem('jwt_token');
        window.location.href = 'login.html';
        // In a real application, this would redirect to login page
    }
}

function limparFiltros() {
    document.getElementById('searchMedicamentos').value = '';
    document.getElementById('filtroEstoque').value = 'todos';
    filterMedicamentos();
}

function filtrarRelatorio() {
    const status = document.getElementById('filtroStatus').value;
    const dataInicio = document.getElementById('filtroDataInicio').value;
    const dataFim = document.getElementById('filtroDataFim').value;

    let pacientesFiltrados = pacientes.filter(paciente => {
        let incluir = true;

        // Filtro por status
        if (status && paciente.status !== status) {
            incluir = false;
        }

        // Filtro por data de cadastro
        if (dataInicio && paciente.dataCadastro < dataInicio) {
            incluir = false;
        }

        if (dataFim && paciente.dataCadastro > dataFim) {
            incluir = false;
        }

        return incluir;
    });

    renderizarRelatorio(pacientesFiltrados);
}

function limparFiltrosRelatorio() {
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroDataInicio').value = '';
    document.getElementById('filtroDataFim').value = '';
    renderizarRelatorio(pacientes);
}

function renderizarRelatorio(pacientesList = pacientes) {
    const container = document.getElementById('relatorioContainer');
    
    if (pacientesList.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow text-center">
                <i data-lucide="users" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum paciente encontrado</h3>
                <p class="text-gray-600">Não há pacientes que correspondam aos filtros selecionados.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = pacientesList.map(paciente => {
        const idade = calcularIdade(paciente.dataNascimento);

        return `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="bg-blue-50 px-6 py-4 border-b">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">${paciente.nome}</h3>
                            <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span><strong>CPF:</strong> ${paciente.cpf}</span>
                                <span><strong>Cartão SUS:</strong> ${paciente.cartaoSus}</span>
                                <span><strong>Idade:</strong> ${idade} anos</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                paciente.status === 'Ativo' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }">${paciente.status}</span>
                            <button onclick="exportarPacientePDF(${paciente.id})" class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                <i data-lucide="download" class="w-4 h-4"></i>
                                PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-b">
                    <h4 class="text-sm font-medium text-gray-500">Prontuário Livre</h4>
                    <p class="text-gray-900">${paciente.prontuarioLivre || 'Nenhuma informação adicional'}</p>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function exportarPacientePDF(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (!paciente) {
        alert('Paciente não encontrado.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações iniciais
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(`Relatório de Paciente`, margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
    yPosition += 10;

    // Informações do paciente
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Nome: ${paciente.nome}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const infos = [
        `CPF: ${paciente.cpf}`,
        `Cartão SUS: ${paciente.cartaoSus}`,
        `Data de Nascimento: ${formatarData(paciente.dataNascimento)}`,
        `Idade: ${calcularIdade(paciente.dataNascimento)} anos`,
        `Status: ${paciente.status}`,
        `Telefone: ${paciente.telefone || 'Não informado'}`,
        `E-mail: ${paciente.email || 'Não informado'}`,
        `Endereço: ${paciente.endereco || 'Não informado'}`,
        `Data de Cadastro: ${formatarData(paciente.dataCadastro)}`,
        `Prontuário Livre: ${paciente.prontuarioLivre || 'Nenhuma informação adicional'}`
    ];

    infos.forEach(info => {
        doc.text(info, margin, yPosition);
        yPosition += 5;
    });

    // Salvar o PDF
    doc.save(`relatorio-paciente-${paciente.nome.replace(/\s+/g, '_')}.pdf`);
}

function downloadRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações do PDF
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('CAPS - Relatório Geral de Pacientes', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
    yPosition += 10;

    doc.text(`Total de pacientes: ${pacientes.length}`, margin, yPosition);
    yPosition += 20;

    // Dados dos pacientes
    pacientes.forEach((paciente, index) => {
        // Verificar se precisa de nova página
        if (yPosition > 250) {
            doc.addPage();
            yPosition = margin;
        }

        // Nome do paciente
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${paciente.nome}`, margin, yPosition);
        yPosition += 8;

        // Informações básicas
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        const infos = [
            `CPF: ${paciente.cpf}`,
            `Cartão SUS: ${paciente.cartaoSus}`,
            `Data Nascimento: ${formatarData(paciente.dataNascimento)}`,
            `Status: ${paciente.status}`,
            `Telefone: ${paciente.telefone || 'Não informado'}`,
            `E-mail: ${paciente.email || 'Não informado'}`,
            `Data Cadastro: ${formatarData(paciente.dataCadastro)}`,
            `Prontuário Livre: ${paciente.prontuarioLivre || 'Nenhuma informação adicional'}`
        ];

        infos.forEach(info => {
            doc.text(info, margin + 5, yPosition);
            yPosition += 5;
        });

        if (paciente.endereco) {
            doc.text(`Endereço: ${paciente.endereco}`, margin + 5, yPosition);
            yPosition += 5;
        }

        yPosition += 10; // Espaço entre pacientes
    });

    // Salvar o PDF
    doc.save(`relatorio-pacientes-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Helper functions for report
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function formatarData(data) {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
}
