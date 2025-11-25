const API_URL = "https://dummyjson.com/users";
let users = [];

// ===============================
//  Busca inicial dos usuários
// ===============================
async function loadUsers() {
    try {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
            // Se houver usuario no localStorage, usa eles
            users = JSON.parse(storedUsers);
        } else {
            // Caso contrário, busca na API
            const response = await fetch(API_URL);
            const data = await response.json();
            users = data.users;
            localStorage.setItem("users", JSON.stringify(users));
        }
        renderUsers();
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

// ===============================
//  Renderizar usuários
// ===============================
function renderUsers() {
    const container = document.getElementById("user-list");
    container.innerHTML = "";

    users.forEach((user, index) => {
        const card = document.createElement("div");
        card.className = "card";

        const image = user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

        card.innerHTML = `
            <img src="${image}" alt="Foto de ${user.firstName}">
            <h3>${user.firstName} ${user.lastName}</h3>
            <p><Email:</strong>  ${user.email}</p>
            <p><strong>Idade:</strong> ${user.age}</p>

            <button class="remove-btn" onclick="removeUser(${index})">Remover</button>
        `;

        container.appendChild(card);
    });
}

// ===============================
//  Remover usuário
// ===============================
function removeUser(index) {
    users.splice(index, 1);
     localStorage.setItem("users", JSON.stringify(users)); // Atualiza localStorage
    renderUsers();
}

// ===============================
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

// ===============================
//  Adicionar usuário
// ===============================
document.getElementById("add-user-form").addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const idade= document.getElementById("idade").value;
    const image = document.getElementById("image").value;

    let invalid = false;

    if (!validateText(nome)) { invalid = true; showError("nome", "O nome deve ter entre 3 e 50 caracteres."); }
    if (!validateText(sobrenome)) { invalid = true; showError("sobrenome", "O sobrenome deve ter entre 3 e 50 caracteres."); }
    if (!validateEmail(email)) { invalid = true; showError("email", "O email deve ter um formato válido."); }
    if (!validateNumber(idade)) { invalid = true; showError("idade", "A idade deve ser maior que 0 e menor que 120."); }
   if (image && !validateURL(image)) {invalid = true; showError("image", "A URL fornecida é inválida.");}

    if (invalid) return;

    // se estiver tudo OK na validação, cria usuario
    const newUser = {
        firstName:nome,
        lastName: sobrenome,
        email: email,
        age: idade,
        image: image
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users)); // Salva no localStorage
    renderUsers();

    e.target.reset();
});

// Carregar assim que a página abrir
loadUsers();
