// Validações gerais

// texto obrigatório entre 3 e 50 caracteres
function validateText(value) {
    return value && value.trim().length >= 3 && value.trim().length <= 50;
}

// email válido
function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

// número > 0 e < 120
// idade e preço
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
