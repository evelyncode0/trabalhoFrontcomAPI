const API_URL = "https://dummyjson.com/users";
let users = [];

// =============================================
// AVATAR GEOMÉTRICO PARA TODOS OS USUÁRIOS
// =============================================
function getAvatar(name) {
    return `https://robohash.org/${encodeURIComponent(
        name
    )}.png?set=set5&size=150x150`;
}

// =============================================
// CARREGAR USUÁRIOS (API → localStorage → tela)
// =============================================
async function loadUsers() {
    try {
        const storedUsers = localStorage.getItem("users");

        if (storedUsers) {
            // Se já existe no localStorage (depois do 1º carregamento)
            users = JSON.parse(storedUsers);
        } else {
            // Busca da API (EXATAMENTE COMO ERA NO COMEÇO)
            const response = await fetch(API_URL);
            const data = await response.json();

            // Converte TODOS os usuários para avatar geométrico
            users = data.users.map(u => ({
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                age: u.age,
                image: getAvatar(u.firstName + u.lastName)
            }));

            // Salva no localStorage para manter estado
            localStorage.setItem("users", JSON.stringify(users));
        }

        renderUsers();
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

// =============================================
// RENDERIZAR CARDS
// =============================================
function renderUsers() {
    const container = document.getElementById("user-list");
    container.innerHTML = "";

    users.forEach((user, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${user.image}" class="avatar-user" />
            <h3>${user.firstName} ${user.lastName}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Idade:</strong> ${user.age}</p>

            <button class="remove-btn" onclick="removeUser(${index})">
                Remover
            </button>
        `;

        container.appendChild(card);
    });
}

// =============================================
// REMOVER USUÁRIO
// =============================================
function removeUser(index) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
}


// validações

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const span = document.getElementById("err-" + inputId);

    input.classList.add("input-error");
    span.textContent = message;
    span.style.display = "block";
}

function clearErrors() {
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    document.querySelectorAll(".error-msg").forEach(el => {
        el.style.display = "none";
        el.textContent = "";
    });
}

// =============================================
// ADICIONAR USUÁRIO MANUAL
// (AVATAR GEOMÉTRICO AUTOMÁTICO)
// =============================================
document.getElementById("add-user-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const idade = document.getElementById("idade").value.trim();
    const image = document.getElementById("image").value.trim();

    let invalid = false;

    if (!validateText(nome)) { invalid = true; showError("nome", "O nome deve ter entre 3 e 50 caracteres."); }
    if (!validateText(sobrenome)) { invalid = true; showError("sobrenome", "O sobrenome deve ter entre 3 e 50 caracteres."); }
    if (!validateEmail(email)) { invalid = true; showError("email", "O email deve ter um formato válido."); }
    if (!validateNumber(idade)) { invalid = true; showError("idade", "A idade deve ser maior que 0 e menor que 120."); }
   if (image && !validateURL(image)) {invalid = true; showError("image", "A URL fornecida é inválida.");}

    if (invalid) return;

    // novo usuário
    const newUser = {
        firstName: nome,
        lastName: sobrenome,
        email,
        age: idade,
        image: image || getAvatar(nome + sobrenome)
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();

    e.target.reset();
});

// Inicializa
loadUsers();








