// public/js/auth.js - VERSÃO FINAL CORRIGIDA

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const API_URL = 'http://localhost:3000/api';

    // --- LÓGICA PARA A PÁGINA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorMessage.textContent = '';
            
            // Lembre-se que o login agora é por CPF
            const cpf = document.getElementById('cpf').value;
            const password = document.getElementById('password').value;
    
            try {
                const response = await fetch(`${API_URL}/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviamos 'cpf' e 'senha' para a API
                    body: JSON.stringify({ cpf, senha: password }),
                });

                const data = await response.json();

                // Se a resposta da API não for de sucesso (ex: erro 401), lança um erro
                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao tentar fazer login.');
                }

                // Se o login for bem-sucedido, salva o token e redireciona
                localStorage.setItem('jwt_token', data.token);
                window.location.href = 'index.html'; // Redireciona para o painel principal

            } catch (error) {
                // Exibe a mensagem de erro na tela
                errorMessage.textContent = error.message;
            }
        });
    }

    // --- LÓGICA PARA A PÁGINA DE REGISTRO ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorMessage.textContent = '';
            successMessage.textContent = '';

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const cpf = document.getElementById('cpf').value;

            try {
                const response = await fetch(`${API_URL}/usuarios/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviamos todos os campos, incluindo o CPF
                    body: JSON.stringify({ nome, email, senha: password, cpf }),
                });

                const data = await response.json();
                if (!response.ok) { throw new Error(data.message); }

                successMessage.textContent = 'Usuário registrado com sucesso! Redirecionando para o login...';
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);

            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
});