const medService = require('../services/medicamentoService');

const create = async (req, res, next) => {
    try {
        const novoMedicamento = await medService.createMedicamento(req.body);
        res.status(201).json({ message: 'Medicamento cadastrado!', data: novoMedicamento });
    } catch (error) { next(error); }
};
const getAll = async (req, res, next) => {
    try {
        const medicamentos = await medService.getAllMedicamentos();
        res.status(200).json(medicamentos);
    } catch (error) { next(error); }
};
const update = async (req, res, next) => {
    try {
        await medService.updateMedicamento(req.params.id, req.body);
        res.status(200).json({ message: 'Medicamento atualizado!' });
    } catch (error) { next(error); }
};
const remove = async (req, res, next) => {
    try {
        await medService.deleteMedicamento(req.params.id);
        res.status(200).json({ message: 'Medicamento excluído!' });
    } catch (error) { next(error); }
};

module.exports = { create, getAll, update, remove };