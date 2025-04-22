let modal = document.querySelector("#modalBackground");
let closeModalBtn = document.querySelector("#closeModalBtn");
let addToFavoriteButtons = document.querySelectorAll(".to-star");
let openFavoritesBtn = document.querySelector("#openModalBtn");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function openModal() {
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
}

function closeModal() {
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
}

addToFavoriteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        let product = arr[index];
        if (!favorites.some(fav => fav.id === product.id)) {
            favorites.push({
                ...product,
                quantity: 1
            });
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
        renderFavorites();
    });
});

openFavoritesBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

function renderFavorites() {
    let favoriteList = document.querySelector(".modal__box");
    favoriteList.innerHTML = '';

    favorites.forEach(product => {
        let productElement = document.createElement("div");
        productElement.classList.add("elem");

        let displayName = typeof product.title === "string" && product.title.trim() !== ""
            ? product.title.split(" ")[0]
            : "Товар";

        productElement.innerHTML = `
            <div class="elem__box">
                <img src="${product.image}" alt="${displayName}" />
                <span>${displayName}</span>  
                <span>${product.price} $</span>
            </div>
            <div class="elem__box">
                <button class="decrease" data-id="${product.id}">-</button>
                <span>${product.quantity}</span>
                <button class="increase" data-id="${product.id}">+</button>
            </div>
            <div style="text-align: right; margin-top: 5px;">
                <button class="delete" data-id="${product.id}" style="background:none;border:none;font-size:18px;cursor:pointer;">🗑️</button>
            </div>
        `;
        favoriteList.appendChild(productElement);

        productElement.querySelector(".increase").addEventListener("click", () => {
            changeQuantity(product.id, 1);
        });

        productElement.querySelector(".decrease").addEventListener("click", () => {
            changeQuantity(product.id, -1);
        });

        productElement.querySelector(".delete").addEventListener("click", () => {
            favorites = favorites.filter(fav => fav.id !== product.id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            renderFavorites();
        });
    });

    updateTotalPrice();
}

function changeQuantity(productId, change) {
    let product = favorites.find(fav => fav.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity < 1) product.quantity = 1;
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    }
}

function updateTotalPrice() {
    let totalPrice = favorites.reduce((total, product) => total + product.price * product.quantity, 0);
    document.querySelector("#price").textContent = `${totalPrice.toFixed(2)} $`;
}
