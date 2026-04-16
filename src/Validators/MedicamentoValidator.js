const Joi = require('joi');

const medicamentoSchema = Joi.object({
    nome: Joi.string().min(3).required(),
    fabricante: Joi.string().required(),
    lote: Joi.string().required(),
    data_validade: Joi.date().iso().required(),
    quantidade_estoque: Joi.number().integer().min(0).required(),
    quantidade_minima: Joi.number().integer().min(0).required(),
    // Campos do novo design
    principio_ativo: Joi.string().min(3).required(),
    concentracao: Joi.string().required(),
    forma_farmaceutica: Joi.string().required(),
    observacoes: Joi.string().allow(null, '')
});

const validateMedicamento = (req, res, next) => {
    const { error } = medicamentoSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Erro de validação", errors: error.details.map(d => d.message) });
    }
    next();
};

module.exports = { validateMedicamento };