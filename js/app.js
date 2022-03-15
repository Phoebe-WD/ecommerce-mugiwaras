// Variables del DOM
const productsDOM = document.querySelector("#products");
const cartTotal = document.querySelector("#totalCart");
const cartItems = document.querySelector("#carrito");
const cartContent = document.querySelector("#cart-content");
const cartDrop = document.querySelector(".cart-drop");
const cartDOM = document.querySelector(".cart-side");
const closeCart = document.querySelector(".close-cart");
const cartBtn = document.querySelector(".btn-cart");
const clearCart = document.querySelector("#clearCart");

//nuestro carrito

let cart = [];
let btnsDOM = [];

// obtenemos los productos
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

// mostramos los productos
class UI {
  displayProducts(products) {
    let result = "";
    products?.map((product) => {
      result += `
              <div class="containerProduct">
            <img src="${product.img}" class="imgProduct">
            <h2>${product.name}</h2>
            <div class="infoProduct">
                <h4>Stock: ${product.stock}</h4>
                <h3>$${product.price}</h3>
            </div>
              <button class="addProduct" data-id=${product.id}>Agregar</button>
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
          title: "Tu producto fue añadido con éxito al carrito",
          confirmButtonColor: "#ff9800",
        });
        // obtenemos los productos desde el método
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        // añadimos productos al carrito
        cart = [...cart, cartItem];
        // guardamos el carrito en local storage
        Storage.saveCart(cart);
        // le añadimos los valores al carrito
        this.setCartValues(cart);
        // mostrar productos en el carrito
        this.addCartItem(cartItem);
        // mostrar carrito
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
    cartTotal.innerText = parseFloat(tempTotal);
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
              <h5>${item.price}</h5>
              <span class-="remove-item" data-id=${item.id}
                ><i class="fa-solid fa-trash"></i
              ></span>
            </div>
            <div>
              <i class="fa-solid fa-circle-plus" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fa-solid fa-circle-minus" data-id=${item.id}></i>
            </div>
          `;
    cartContent.appendChild(addDiv);
  }
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
  closeCart() {
    cartDrop.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // limpiar carrito
    clearCart.addEventListener("click", () => this.clearCart());
    // funcionalidad del carrito
  }
  clearCart() {
    console.log(this);
    let cartItems = cart.map((item) => item.id);
    console.log(cartItems);
    Swal.fire({
      title: "¿Estás seguro que quieres eliminar tus productos?",
      text: "¡No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar productos!",
      cancelButtonText: "¡Noo, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        cartItems.forEach((id) => this.removeItem(id));
        while (cartContent.children.length > 0) {
          cartContent.removeChild(cartContent.children[0]);
          console.log(cartContent.children);
        }
        this.closeCart();
        Swal.fire("¡Listo!", "Se ha limpiado el carrito con éxito", "success");
      }
    });
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let btn = this.getSingleBtn(id);
    btn.disabled = false;
    btn.innerText = "Agregar";
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
  // confi app
  ui.setupAPP();
  // obtenemos todos los productos
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
