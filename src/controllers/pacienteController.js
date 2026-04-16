const pacienteService = require('../services/pacienteService');

const getAllPacientes = async (req, res, next) => {
    try {
        const pacientes = await pacienteService.getAllPacientes();
        res.status(200).json(pacientes);
    } catch (error) { next(error); }
};

const getPacienteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const paciente = await pacienteService.getPacienteById(id);
        if (paciente) {
            res.status(200).json(paciente);
        } else {
            res.status(404).json({ message: 'Paciente não encontrado' });
        }
    } catch (error) { next(error); }
};

const createPaciente = async (req, res, next) => {
    try {
        const novoPaciente = await pacienteService.createPaciente(req.body);
        res.status(201).json({ message: 'Paciente cadastrado com sucesso!', paciente: novoPaciente });
    } catch (error) { next(error); }
};

const updatePaciente = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pacienteService.updatePaciente(id, req.body);
        res.status(200).json({ message: `Paciente com ID ${id} atualizado com sucesso!` });
    } catch (error) { next(error); }
};

const deletePaciente = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pacienteService.deletePaciente(id);
        res.status(200).json({ message: `Paciente com ID ${id} deletado com sucesso.` });
    } catch (error) { next(error); }
};

const getAllUnidades = async (req, res, next) => {
    try {
        const unidades = await pacienteService.getAllUnidades();
        res.status(200).json(unidades);
    } catch (error) { next(error); }
};

module.exports = {
    getAllPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    getAllUnidades
};