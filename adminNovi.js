document.addEventListener("DOMContentLoaded", loadProducts);

let editingIndex = null; // Ky tregon nëse po modifikojmë apo shtojmë produkt të ri

function loadProducts() {
    const products = JSON.parse(localStorage.getItem("cokollataNoviProducts")) || [];
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        const productItem = document.createElement("div");
        productItem.innerHTML = `
            <strong>${product.name}</strong> (${product.code}) - ${product.price}$<br>
            <img src="${product.image}" style="width: 50px; height: 50px;"><br>
            <button onclick="editProduct(${index})">✏️ Modifiko</button>
            <button onclick="deleteProduct(${index})">❌ Fshij</button>
            <hr>
        `;
        productList.appendChild(productItem);
    });
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem("cokollataNoviProducts")) || [];
    const product = products[index];

    document.getElementById("productName").value = product.name;
    document.getElementById("productCode").value = product.code;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productImageFile").value = "";

    editingIndex = index;
}

document.getElementById("productForm").onsubmit = async (e) => {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem("cokollataNoviProducts")) || [];

    if (editingIndex !== null) {
        const existingProduct = products[editingIndex];
        const updatedProduct = await getProductFromForm(existingProduct.image);
        products[editingIndex] = updatedProduct;
        editingIndex = null;
    } else {
        const newProduct = await getProductFromForm();
        products.push(newProduct);
    }

    localStorage.setItem("cokollataNoviProducts", JSON.stringify(products));
    loadProducts();
    resetForm();
};

async function getProductFromForm(existingImage = null) {
    const name = document.getElementById("productName").value;
    const code = document.getElementById("productCode").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const fileInput = document.getElementById("productImageFile");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve({
                    name,
                    code,
                    price,
                    image: event.target.result
                });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    } else {
        if (existingImage) {
            return {
                name,
                code,
                price,
                image: existingImage
            };
        } else {
            alert('Ju lutem ngarkoni një foto!');
            throw new Error('Foto e detyrueshme për produkt të ri');
        }
    }
}

function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem("cokollataNoviProducts")) || [];
    products.splice(index, 1);
    localStorage.setItem("cokollataNoviProducts", JSON.stringify(products));
    loadProducts();
}

function resetForm() {
    document.getElementById("productForm").reset();
    editingIndex = null;
}