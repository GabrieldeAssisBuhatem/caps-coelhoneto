const db = require('../config/database');

const getAllPacientes = async () => {
    const sql = `
        SELECT p.*, u.nome_unidade 
        FROM pacientes AS p
        LEFT JOIN UNIDADE AS u ON p.unidade_id = u.id
        ORDER BY p.nome_completo ASC
    `;
    const [rows] = await db.execute(sql);
    return rows;
};

const getPacienteById = async (id) => {
    const sql = `
        SELECT p.*, u.nome_unidade 
        FROM pacientes AS p
        LEFT JOIN UNIDADE AS u ON p.unidade_id = u.id
        WHERE p.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
};

const createPaciente = async (pacienteData) => {
    const {
        nome_completo, data_nascimento, cpf, sus, nome_mae,
        telefone_contato, endereco_completo, medicamentos, unidade_id, data_cadastro
    } = pacienteData;

    const sql = `
        INSERT INTO pacientes (
            nome_completo, data_nascimento, cpf, sus, nome_mae, 
            telefone_contato, endereco_completo, medicamentos, unidade_id, data_cadastro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(sql, [
        nome_completo, data_nascimento, cpf, sus, nome_mae,
        telefone_contato, endereco_completo, medicamentos, unidade_id, data_cadastro
    ]);

    return { id: result.insertId };
};

const updatePaciente = async (id, pacienteData) => {
    const {
        nome_completo, data_nascimento, cpf, sus, nome_mae,
        telefone_contato, endereco_completo, medicamentos, unidade_id
    } = pacienteData;

    const sql = `
        UPDATE pacientes SET
            nome_completo = ?, data_nascimento = ?, cpf = ?, sus = ?, nome_mae = ?,
            telefone_contato = ?, endereco_completo = ?, medicamentos = ?, unidade_id = ?
        WHERE id = ?
    `;

    await db.execute(sql, [
        nome_completo, data_nascimento, cpf, sus, nome_mae,
        telefone_contato, endereco_completo, medicamentos, unidade_id,
        id
    ]);
};

const deletePaciente = async (id) => {
    await db.execute('DELETE FROM pacientes WHERE id = ?', [id]);
};

const getAllUnidades = async () => {
    const sql = 'SELECT id, nome_unidade FROM UNIDADE ORDER BY nome_unidade ASC';
    const [rows] = await db.execute(sql);
    return rows;
};

module.exports = {
    getAllPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    getAllUnidades
};