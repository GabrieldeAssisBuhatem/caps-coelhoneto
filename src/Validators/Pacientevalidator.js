const Joi = require('joi');

const pacienteSchema = Joi.object({
    nome_completo: Joi.string().min(3).required(),
    data_nascimento: Joi.date().iso().required(),
    cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required(),
    sus: Joi.string().allow(null, ''),
    nome_mae: Joi.string().min(3).required(),
    telefone_contato: Joi.string().required(),
    endereco_completo: Joi.string().allow(null, ''),
    medicamentos: Joi.string().allow(null, ''),
    unidade_id: Joi.number().integer().required().messages({
        'any.required': `"Unidade" é um campo obrigatório.`,
        'number.base': `"Unidade" deve ser um número válido.`
    }),
    data_cadastro: Joi.date().iso().optional().allow(null, '') // Opcional no update
});

const validatePaciente = (req, res, next) => {
    // Para o método PUT, data_cadastro não é necessário
    const schema = req.method === 'PUT' 
        ? pacienteSchema.fork(['data_cadastro'], (schema) => schema.strip()) 
        : pacienteSchema;

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Erro de validação", errors });
    }

    next();
};

module.exports = {
    validatePaciente
};