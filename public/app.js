// ===================================================================================
// ARQUIVO PRINCIPAL DO FRONTEND - public/js/app.js - VERSÃO FINAL COM PRONTUÁRIO INTEGRADO
// ===================================================================================

const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('jwt_token');

 // Global variables
        let currentPage = 'dashboard';
        let pacientes = [];
        let medicamentos = [];
        let filteredPacientes = [];
        let filteredMedicamentos = [];
        let editingMedicamentoId = null;
        let currentPacienteId = null;
        let prontuarios = {};

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons();
            initializeData();
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
        });

        // Initialize mock data
        function initializeData() {
            // Mock pacientes data
            pacientes = [
                {
                    id: 1,
                    nome: "Maria Silva Santos",
                    cpf: "123.456.789-00",
                    cartao_sus: "123456789012345",
                    data_nascimento: "1985-03-15",
                    telefone: "(98) 99999-1234",
                    email: "maria.silva@email.com",
                    endereco: "Rua das Flores, 123, Centro, Coelho Neto - MA, 65620-000",
                    status: "Ativo",
                    data_cadastro: "2024-01-15"
                },
                {
                    id: 2,
                    nome: "João Oliveira Costa",
                    cpf: "987.654.321-00",
                    cartao_sus: "987654321098765",
                    data_nascimento: "1978-07-22",
                    telefone: "(98) 98888-5678",
                    email: "joao.costa@email.com",
                    endereco: "Av. Principal, 456, São José, Coelho Neto - MA, 65620-000",
                    status: "Ativo",
                    data_cadastro: "2024-02-10"
                },
                {
                    id: 3,
                    nome: "Ana Paula Ferreira",
                    cpf: "456.789.123-00",
                    cartao_sus: "456789123456789",
                    data_nascimento: "1992-11-08",
                    telefone: "(98) 97777-9012",
                    email: "ana.ferreira@email.com",
                    endereco: "Rua da Paz, 789, Vila Nova, Coelho Neto - MA, 65620-000",
                    status: "Inativo",
                    data_cadastro: "2024-03-05"
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
                    data_validade: "2024-06-30",
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
                }
            ];

            // Mock prontuários data
            prontuarios = {
                1: {
                    dispensacoes: [
                        {
                            id: 1,
                            medicamento: 'Sertralina 50mg',
                            quantidade: 30,
                            data_dispensacao: '2024-09-15',
                            proxima_retirada: '2024-10-15',
                            funcionario: 'Ana Silva - Farmacêutica',
                            observacoes: 'Paciente orientado sobre horário de administração',
                            status: 'Dispensado'
                        },
                        {
                            id: 2,
                            medicamento: 'Clonazepam 2mg',
                            quantidade: 15,
                            data_dispensacao: '2024-09-10',
                            proxima_retirada: '2024-09-25',
                            funcionario: 'Carlos Santos - Técnico em Farmácia',
                            observacoes: 'Medicamento controlado - receita retida',
                            status: 'Dispensado'
                        },
                        {
                            id: 3,
                            medicamento: 'Paracetamol 500mg',
                            quantidade: 20,
                            data_dispensacao: '2024-09-05',
                            proxima_retirada: '2024-09-20',
                            funcionario: 'Maria Oliveira - Enfermeira',
                            observacoes: 'Para uso em caso de dor ou febre',
                            status: 'Vencido'
                        }
                    ]
                },
                2: {
                    dispensacoes: [
                        {
                            id: 1,
                            medicamento: 'Fluoxetina 20mg',
                            quantidade: 30,
                            data_dispensacao: '2024-09-12',
                            proxima_retirada: '2024-10-12',
                            funcionario: 'Ana Silva - Farmacêutica',
                            observacoes: 'Primeira dispensação - orientações fornecidas',
                            status: 'Dispensado'
                        }
                    ]
                }
            };

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
                    paciente.cartao_sus.includes(searchTerm)
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
                            <div class="text-sm text-gray-500">${formatDate(paciente.data_nascimento)}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">${paciente.cpf}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${paciente.cartao_sus}</td>
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
            const cartaoExistente = pacientes.find(p => p.cartao_sus === cartaoSus);
            if (cartaoExistente) {
                alert('Já existe um paciente cadastrado com este Cartão SUS!');
                return;
            }
            
            const paciente = {
                id: Date.now(),
                nome: formData.get('nome'),
                cpf: cpf,
                cartao_sus: cartaoSus,
                data_nascimento: formData.get('data_nascimento'),
                telefone: formData.get('telefone'),
                email: formData.get('email'),
                endereco: formData.get('endereco'),
                observacoes: formData.get('observacoes'),
                status: 'Ativo',
                data_cadastro: new Date().toISOString().split('T')[0]
            };

            pacientes.push(paciente);
            filteredPacientes = [...pacientes];
            updateStats();
            
            alert('Paciente cadastrado com sucesso!');
            form.reset();
            showPage('pacientes');
        }

        function viewPaciente(id) {
            const paciente = pacientes.find(p => p.id === id);
            if (paciente) {
                currentPacienteId = id;
                showProntuario(paciente);
            }
        }

        function showProntuario(paciente) {
            document.getElementById('prontuario-paciente-nome').textContent = `Prontuário - ${paciente.nome}`;
            document.getElementById('prontuario-paciente-info').textContent = `CPF: ${paciente.cpf} | Cartão SUS: ${paciente.cartao_sus}`;
            
            // Update patient basic info
            const infoBasica = document.getElementById('prontuario-info-basica');
            infoBasica.innerHTML = `
                <div>
                    <label class="block text-sm font-medium text-gray-500">Nome Completo</label>
                    <p class="mt-1 text-sm text-gray-900">${paciente.nome}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(paciente.data_nascimento)}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">Telefone</label>
                    <p class="mt-1 text-sm text-gray-900">${paciente.telefone || 'Não informado'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">E-mail</label>
                    <p class="mt-1 text-sm text-gray-900">${paciente.email || 'Não informado'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">Status</label>
                    <p class="mt-1">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paciente.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${paciente.status}
                        </span>
                    </p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">Endereço</label>
                    <p class="mt-1 text-sm text-gray-900">${paciente.endereco || 'Não informado'}</p>
                </div>
            `;

            showPage('prontuario');
            loadMedicamentosDispensados();
        }

        function editPaciente(id) {
            const paciente = pacientes.find(p => p.id === id);
            if (paciente) {
                alert(`Funcionalidade de edição será implementada para: ${paciente.nome}`);
            }
        }

        function deletePaciente(id) {
            if (confirm('Tem certeza que deseja excluir este paciente?')) {
                pacientes = pacientes.filter(p => p.id !== id);
                filteredPacientes = pacientes.filter(p => 
                    document.getElementById('searchPacientes').value === '' ||
                    p.nome.toLowerCase().includes(document.getElementById('searchPacientes').value.toLowerCase()) ||
                    p.cpf.includes(document.getElementById('searchPacientes').value) ||
                    p.cartao_sus.includes(document.getElementById('searchPacientes').value)
                );
                updateStats();
                renderPacientes();
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
                loadConsultas();
            } else if (tabName === 'medicamentos') {
                loadMedicamentosPrescritos();
            } else if (tabName === 'exames') {
                loadExames();
            } else if (tabName === 'historico') {
                loadHistorico();
            }

            lucide.createIcons();
        }

        function loadConsultas() {
            const consultasList = document.getElementById('consultas-list');
            const consultas = prontuarios[currentPacienteId]?.consultas || [];

            if (consultas.length === 0) {
                consultasList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i data-lucide="calendar" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                        <p>Nenhuma consulta registrada</p>
                    </div>
                `;
                return;
            }

            consultasList.innerHTML = consultas.map(consulta => `
                <div class="border rounded-lg p-4 hover:bg-gray-50">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h5 class="font-medium text-gray-900">${formatDate(consulta.data)}</h5>
                            <p class="text-sm text-gray-600">${consulta.profissional}</p>
                        </div>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            ${consulta.status}
                        </span>
                    </div>
                    ${consulta.queixa ? `<p class="text-sm text-gray-700 mb-2"><strong>Queixa:</strong> ${consulta.queixa}</p>` : ''}
                    <p class="text-sm text-gray-700"><strong>Observações:</strong> ${consulta.observacoes}</p>
                </div>
            `).join('');
        }

        function loadMedicamentosPrescritos() {
            const medicamentosList = document.getElementById('medicamentos-prescritos-list');
            const medicamentosPrescritos = prontuarios[currentPacienteId]?.medicamentos || [];

            if (medicamentosPrescritos.length === 0) {
                medicamentosList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i data-lucide="pill" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                        <p>Nenhum medicamento prescrito</p>
                    </div>
                `;
                return;
            }

            medicamentosList.innerHTML = medicamentosPrescritos.map(med => `
                <div class="border rounded-lg p-4 hover:bg-gray-50">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h5 class="font-medium text-gray-900">${med.medicamento}</h5>
                            <p class="text-sm text-gray-600">${med.dosagem}</p>
                        </div>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${med.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${med.status}
                        </span>
                    </div>
                    <p class="text-sm text-gray-700 mb-1"><strong>Prescrito em:</strong> ${formatDate(med.data_prescricao)}</p>
                    <p class="text-sm text-gray-700 mb-1"><strong>Profissional:</strong> ${med.profissional}</p>
                    ${med.observacoes ? `<p class="text-sm text-gray-700"><strong>Observações:</strong> ${med.observacoes}</p>` : ''}
                </div>
            `).join('');
        }

        function loadExames() {
            const examesList = document.getElementById('exames-list');
            const exames = prontuarios[currentPacienteId]?.exames || [];

            if (exames.length === 0) {
                examesList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i data-lucide="file-text" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                        <p>Nenhum exame solicitado</p>
                    </div>
                `;
                return;
            }

            examesList.innerHTML = exames.map(exame => `
                <div class="border rounded-lg p-4 hover:bg-gray-50">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h5 class="font-medium text-gray-900">${exame.tipo}</h5>
                            <p class="text-sm text-gray-600">Solicitado em: ${formatDate(exame.data_solicitacao)}</p>
                        </div>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${exame.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${exame.status}
                        </span>
                    </div>
                    <p class="text-sm text-gray-700 mb-1"><strong>Profissional:</strong> ${exame.profissional}</p>
                    ${exame.observacoes ? `<p class="text-sm text-gray-700"><strong>Observações:</strong> ${exame.observacoes}</p>` : ''}
                </div>
            `).join('');
        }

        function loadHistorico() {
            const historicoList = document.getElementById('historico-list');
            const consultas = prontuarios[currentPacienteId]?.consultas || [];
            const medicamentos = prontuarios[currentPacienteId]?.medicamentos || [];
            const exames = prontuarios[currentPacienteId]?.exames || [];

            // Combine all events and sort by date
            const eventos = [
                ...consultas.map(c => ({ ...c, tipo: 'consulta', data_evento: c.data })),
                ...medicamentos.map(m => ({ ...m, tipo: 'medicamento', data_evento: m.data_prescricao })),
                ...exames.map(e => ({ ...e, tipo: 'exame', data_evento: e.data_solicitacao }))
            ].sort((a, b) => new Date(b.data_evento) - new Date(a.data_evento));

            if (eventos.length === 0) {
                historicoList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i data-lucide="clock" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                        <p>Nenhum histórico disponível</p>
                    </div>
                `;
                return;
            }

            historicoList.innerHTML = eventos.map(evento => {
                let icon, title, description, color;
                
                if (evento.tipo === 'consulta') {
                    icon = 'calendar';
                    title = `Consulta - ${evento.profissional}`;
                    description = evento.queixa || evento.observacoes;
                    color = 'text-blue-600';
                } else if (evento.tipo === 'medicamento') {
                    icon = 'pill';
                    title = `Prescrição - ${evento.medicamento}`;
                    description = `${evento.dosagem} - ${evento.profissional}`;
                    color = 'text-green-600';
                } else if (evento.tipo === 'exame') {
                    icon = 'file-text';
                    title = `Exame - ${evento.tipo}`;
                    description = `Solicitado por ${evento.profissional}`;
                    color = 'text-purple-600';
                }

                return `
                    <div class="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <i data-lucide="${icon}" class="w-4 h-4 ${color}"></i>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-1">
                                <h5 class="font-medium text-gray-900">${title}</h5>
                                <span class="text-sm text-gray-500">${formatDate(evento.data_evento)}</span>
                            </div>
                            <p class="text-sm text-gray-700">${description}</p>
                        </div>
                    </div>
                `;
            }).join('');
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

            if (!prontuarios[currentPacienteId]) {
                prontuarios[currentPacienteId] = { consultas: [], medicamentos: [], exames: [] };
            }

            prontuarios[currentPacienteId].consultas.unshift(consulta);
            
            alert('Consulta registrada com sucesso!');
            closeConsultaModal();
            loadConsultas();
        }

        // Placeholder functions for other modals
        // function openPrescricaoModal() {
        //     alert('Funcionalidade de prescrição será implementada em breve');
        // }

        function openExameModal() {
            alert('Funcionalidade de solicitação de exames será implementada em breve');
        }

        // New functions for Dispensação
        function loadMedicamentosDispensados() {
            const medicamentosList = document.getElementById('medicamentos-dispensados-list');
            const dispensacoes = prontuarios[currentPacienteId]?.dispensacoes || [];

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
                const isVencido = new Date(disp.proxima_retirada) < new Date();
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
                                <p class="mt-1 text-sm text-gray-900">${formatDate(disp.data_dispensacao)}</p>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Retirada</label>
                                <p class="mt-1 text-sm ${isVencido ? 'text-red-600 font-medium' : 'text-gray-900'}">${formatDate(disp.proxima_retirada)}</p>
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
                data_dispensacao: formData.get('data_dispensacao'),
                proxima_retirada: formData.get('proxima_retirada'),
                funcionario: formData.get('funcionario'),
                observacoes: formData.get('observacoes'),
                status: 'Dispensado'
            };

            if (!prontuarios[currentPacienteId]) {
                prontuarios[currentPacienteId] = { dispensacoes: [] };
            }

            prontuarios[currentPacienteId].dispensacoes.unshift(dispensacao);
            
            alert('Dispensação registrada com sucesso!');
            closeDispensacaoModal();
            loadMedicamentosDispensados();
        }

        function openPrescricaoModal() {
            // Populate medicamentos dropdown with only available stock
            const select = document.getElementById('presc_medicamento');
            const medicamentosDisponiveis = medicamentos.filter(m => m.quantidade_estoque > 0);
            
            if (medicamentosDisponiveis.length === 0) {
                alert('Não há medicamentos com estoque disponível no almoxarifado.');
                return;
            }
            
            select.innerHTML = '<option value="">Selecione o medicamento</option>' + 
                medicamentosDisponiveis.map(med => 
                    `<option value="${med.id}" data-estoque="${med.quantidade_estoque}" data-nome="${med.nome}" data-concentracao="${med.concentracao}">
                        ${med.nome} ${med.concentracao} - Estoque: ${med.quantidade_estoque} unidades
                    </option>`
                ).join('');

            // Setup event listener for medicamento selection
            select.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const estoque = selectedOption.getAttribute('data-estoque');
                const estoqueInfo = document.getElementById('estoque-disponivel');
                
                if (estoque) {
                    estoqueInfo.textContent = `Estoque disponível: ${estoque} unidades`;
                    document.getElementById('presc_quantidade').max = estoque;
                } else {
                    estoqueInfo.textContent = 'Estoque disponível: -';
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
            
            const medicamentoId = parseInt(formData.get('medicamento'));
            const quantidade = parseInt(formData.get('quantidade'));
            
            // Find the selected medicamento
            const medicamento = medicamentos.find(m => m.id === medicamentoId);
            if (!medicamento) {
                alert('Medicamento não encontrado!');
                return;
            }
            
            // Check if there's enough stock
            if (quantidade > medicamento.quantidade_estoque) {
                alert(`Quantidade insuficiente em estoque. Disponível: ${medicamento.quantidade_estoque} unidades`);
                return;
            }
            
            const dispensacao = {
                id: Date.now(),
                medicamento: `${medicamento.nome} ${medicamento.concentracao}`,
                quantidade: quantidade,
                dosagem: formData.get('dosagem'),
                duracao: formData.get('duracao'),
                data_dispensacao: formData.get('data_dispensacao'),
                proxima_retirada: formData.get('proxima_retirada'),
                funcionario: formData.get('funcionario'),
                observacoes: formData.get('observacoes'),
                status: 'Dispensado'
            };

            // Update medicamento stock
            medicamento.quantidade_estoque -= quantidade;
            
            // Add to patient's dispensacoes
            if (!prontuarios[currentPacienteId]) {
                prontuarios[currentPacienteId] = { dispensacoes: [] };
            }
            if (!prontuarios[currentPacienteId].dispensacoes) {
                prontuarios[currentPacienteId].dispensacoes = [];
            }

            prontuarios[currentPacienteId].dispensacoes.unshift(dispensacao);
            
            // Update UI
            updateStats();
            updateStockAlerts();
            if (currentPage === 'almoxarifado') {
                renderMedicamentos();
            }
            
            alert(`Prescrição realizada com sucesso!\nMedicamento: ${dispensacao.medicamento}\nQuantidade: ${quantidade} unidades\nEstoque restante: ${medicamento.quantidade_estoque} unidades`);
            closePrescricaoModal();
            loadMedicamentosDispensados();
        }

        // Utility functions
        function formatDate(dateString) {
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
                alert('Logout realizado com sucesso!');
                localStorage.removeItem('jwt_token');
                window.location.href = 'login.html';
            }
        }

        function limparFiltros() {
            document.getElementById('searchMedicamentos').value = '';
            document.getElementById('filtroEstoque').value = 'todos';
            filterMedicamentos();
        }