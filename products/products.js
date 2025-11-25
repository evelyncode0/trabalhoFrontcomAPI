const API_URL = "https://dummyjson.com/products";
let products = [];

// ===============================
//  Buscar produtos da API
// ===============================
async function loadProducts() {
    try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
            // Se houver produtos no localStorage, usa eles
            products = JSON.parse(storedProducts);
        } else {
            // Caso contrário, busca na API
            const response = await fetch(API_URL);
            const data = await response.json();
            products = data.products;
            localStorage.setItem("products", JSON.stringify(products));
        }
        renderProducts();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// ===============================
//  Renderizar lista de produtos
// ===============================
function renderProducts() {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "card";

        const image = product.thumbnail || product.images?.[0] || "https://via.placeholder.com/150";

        card.innerHTML = `
            <img src="${image}" alt="${product.title}">
            <h3>${product.title}</h3>

            <p><strong>Marca:</strong> ${product.brand}</p>
            <p><strong>Categoria:</strong> ${product.category}</p>
            <p><strong>Preço:</strong> R$ ${product.price}</p>

            <p class="desc">${product.description}</p>

            <button class="remove-btn" onclick="removeProduct(${index})">Remover</button>
        `;

        container.appendChild(card);
    });
}

// ===============================
//  Remover produto
// ===============================
function removeProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products)); // Atualiza localStorage
    renderProducts();
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

//  Adicionar produto
// ===============================
document.getElementById("add-product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const titulo = document.getElementById("titulo").value;
    const marca = document.getElementById("marca").value;
    const categoria = document.getElementById("categoria").value;
    const preco = Number(document.getElementById("preco").value);
    const descricao = document.getElementById("descricao").value;
    const thumbnail = document.getElementById("thumbnail").value;

    let invalid = false;

    if (!validateText(titulo)) { invalid = true; showError("titulo", "O título deve ter entre 3 e 50 caracteres."); }
    if (!validateText(marca)) { invalid = true; showError("marca", "A marca deve ter entre 3 e 50 caracteres."); }
    if (!validateText(categoria)) { invalid = true; showError("categoria", "A categoria deve ter entre 3 e 50 caracteres."); }
    if (!validateText(descricao)) { invalid = true; showError("descricao", "A descrição deve ter entre 3 e 50 caracteres."); }
    if (!validateNumber(preco)) { invalid = true; showError("preco", "O preço deve ser maior que 0 e menor que 120."); }
    if (thumbnail && !validateURL(thumbnail)) {invalid = true; showError("thumbnail", "A URL fornecida é inválida.");}

    if (invalid) return;

    // Se estiver tudo OK, cria o novo produto
    const newProduct = {
        title: titulo,
        brand: marca,
        category: categoria,
        price: preco,
        description: descricao,
        thumbnail: thumbnail || "https://via.placeholder.com/150"
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products)); // Salva no localStorage
    renderProducts();
    e.target.reset();
});


// Carregar ao abrir a página
loadProducts();
