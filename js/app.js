// Variables
const productsDOM = document.querySelector("#products");
const cartTotal = document.querySelector("#totalCart");
const cartItems = document.querySelector(".amount-items");
const cartContent = document.querySelector("#cart-content");
const cartDrop = document.querySelector(".cart-drop");
const cartDOM = document.querySelector(".cart-side");
const closeCart = document.querySelector(".close-cart");
const cartBtn = document.querySelector(".btn-cart");
const clearCart = document.querySelector("#clearCart");

// Cart
let cart = [];
let btnsDOM = [];

// Get Products
class Products {
  async getProducts() {
    try {
      let result = await fetch("./data.json");
      let data = await result.json();
      let products = data;
      products = products?.map((product) => {
        const id = product.id;
        const img = product.img;
        const name = product.name;
        const price = product.precio;
        const stock = product.stock;
        return { id, img, name, price, stock };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// Show Products
class UI {
  displayProducts(products) {
    let result = "";
    products?.map((product) => {
      result += `
              <div class="containerProduct">
            <img src="${product.img}" class="imgProduct">
            <h2>${product.name}</h2>
            <div class="infoProduct">
                <h3>Stock: ${product.stock}</h3>
                <h4>$${product.price}</h4>
            </div>
              <button class="addProduct" data-id=${product.id}>Agregar al carrito <i class="fa-solid fa-cart-shopping"></i
              ></button>
        </div>          `;
    });
    productsDOM.innerHTML = result;
  }
  getAddBtn() {
    const addBtn = [...document.querySelectorAll(".addProduct")];
    btnsDOM = addBtn;
    addBtn?.forEach((btn) => {
      let id = btn.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        btn.innetText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        Swal.fire({
          icon: "success",
          title: "Tu producto fue a??adido con ??xito al carrito",
          confirmButtonColor: "#ff9800",
        });
        // Get products through method
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        // Adding product to the cart
        cart = [...cart, cartItem];
        // Saving cart in local storage
        Storage.saveCart(cart);
        // We add values to the cart
        this.setCartValues(cart);
        // Showing products in Cart
        this.addCartItem(cartItem);
        // Show Cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += parseInt(item.price * item.amount);
      itemsTotal += item.amount;
    });
    cartTotal.innerText = `Total: $${parseFloat(tempTotal)}`;
    cartItems.innerText = itemsTotal;
    console.log(cartTotal, cartItems);
  }
  addCartItem(item) {
    console.log(item.amount);
    const addDiv = document.createElement("div");
    addDiv.classList.add("cart-item");
    addDiv.innerHTML = ` 
            <img src=${item.img} alt=${item.name} />
            <div class="cart-item-row">
              <h4>${item.name}</h4>
              <h5>$${item.price}</h5>
              <i class="fa-solid fa-trash remove-item" data-id=${item.id}></i
              >
            </div>
            <div class="cart-item-count">
              <i class="fa-solid fa-circle-plus" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fa-solid fa-circle-minus" data-id=${item.id}></i>
            </div>
          `;
    cartContent.appendChild(addDiv);
  }
  // Method to show cart
  showCart() {
    cartDrop.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCart.addEventListener("click", this.closeCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  // Method to close cart
  closeCart() {
    cartDrop.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // Clean cart
    clearCart.addEventListener("click", () => this.clearCart());
    // Functionality of cart
    cartContent.addEventListener("click", (event) => {
      console.log(event.target);
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        console.log(removeItem);
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-circle-plus")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-circle-minus")) {
        let removeAmount = event.target;
        let id = removeAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          removeAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(removeAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  //Method to clean cart
  clearCart() {
    Swal.fire({
      icon: "success",
      title: "Tu carrito se ha limpiado con ??xito",
      confirmButtonColor: "#ff9800",
    });
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.closeCart();
  }
  removeItem(id) {
    Swal.fire({
      icon: "success",
      title: "Tu producto se ha eliminado con ??xito del carrito",
      confirmButtonColor: "#ff9800",
    });
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let btn = this.getSingleBtn(id);
    btn.disabled = false;
    btn.innerHTML = `Agregar al carrito <i class="fa-solid fa-cart-shopping"></i
              >`;
  }
  getSingleBtn(id) {
    return btnsDOM.find((btn) => btn.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // App Config
  ui.setupAPP();
  // Get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getAddBtn();
      ui.cartLogic();
    });
});
