const db = require('../config/database');

const createMedicamento = async (dados) => {
    const { nome, principio_ativo, concentracao, forma_farmaceutica, fabricante, lote, data_validade, quantidade_estoque, quantidade_minima, observacoes } = dados;
    const sql = `INSERT INTO medicamentos (nome, principio_ativo, concentracao, forma_farmaceutica, fabricante, lote, data_validade, quantidade_estoque, quantidade_minima, observacoes, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`;
    const [result] = await db.execute(sql, [nome, principio_ativo, concentracao, forma_farmaceutica, fabricante, lote, data_validade, quantidade_estoque, quantidade_minima, observacoes]);
    return { id: result.insertId };
};

const getAllMedicamentos = async () => {
    const [rows] = await db.execute('SELECT * FROM medicamentos ORDER BY nome ASC');
    return rows;
};

const updateMedicamento = async (id, dados) => {
    const { nome, principio_ativo, concentracao, forma_farmaceutica, fabricante, lote, data_validade, quantidade_estoque, quantidade_minima, observacoes } = dados;
    const sql = `UPDATE medicamentos SET nome = ?, principio_ativo = ?, concentracao = ?, forma_farmaceutica = ?, fabricante = ?, lote = ?, data_validade = ?, quantidade_estoque = ?, quantidade_minima = ?, observacoes = ? WHERE id = ?`;
    await db.execute(sql, [nome, principio_ativo, concentracao, forma_farmaceutica, fabricante, lote, data_validade, quantidade_estoque, quantidade_minima, observacoes, id]);
};

const deleteMedicamento = async (id) => {
    await db.execute('DELETE FROM medicamentos WHERE id = ?', [id]);
};

module.exports = { createMedicamento, getAllMedicamentos, updateMedicamento, deleteMedicamento };