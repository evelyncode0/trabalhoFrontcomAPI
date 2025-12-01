// ===============================
// Validações gerais (mantidas)
// ===============================

// texto obrigatório entre 3 e 50 caracteres
function validateText(value) {
    return value && value.trim().length >= 3 && value.trim().length <= 50;
}

// email válido
function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

// número > 0 e < 120 (idade e preço limitado neste projeto)
function validateNumber(num) {
    return num > 0 && num < 120;
    
}

// URL válida (opcional)
function validateURL(url) {
    if (!url) return true; // opcional
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/* ===============================
   Tema escuro/claro persistente
   =============================== */

/**
 * Alterna o tema e salva a escolha no localStorage.
 * Chamado por botões <button onclick="toggleTheme()">
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    try {
        localStorage.setItem('site-theme-dark', isDark ? '1' : '0');
    } catch (e) {
        // ignore se storage não disponível
    }
    updateToggleButton();
}

/**
 * Aplica o tema de acordo com localStorage (ou sistema).
 * Deve ser chamado ao carregar a página.
 */
function applyThemeFromStorage() {
    let isDark = null;
    try {
        const stored = localStorage.getItem('site-theme-dark');
        if (stored !== null) isDark = stored === '1';
    } catch (e) {
        isDark = null;
    }

    // se não há preferência salva, podemos usar preferência do OS:
    if (isDark === null) {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');

    updateToggleButton();
}

/**
 * Atualiza texto/ícone do botão de toggle (se existir).
 */
function updateToggleButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    if (document.body.classList.contains('dark-mode')) {
        btn.textContent = '☀️ Alternar Tema';
    } else {
        btn.textContent = '🌙 Alternar Tema';
    }
}

/* Inicializar tema ao carregar o script */
document.addEventListener('DOMContentLoaded', () => {
    applyThemeFromStorage();
});


