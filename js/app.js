// Variables del DOM
const productsDOM = document.querySelector("#products");
const cartTotal = document.querySelector("#totalCart");
const cartItems = document.querySelector("#carrito");
const cartContent = document.querySelector("#cart-content");

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
        // get product from products
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        // add product to the cart
        cart = [...cart, cartItem];
        // save cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart item
        this.addCartItem(cartItem);
        // show cart
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
    const addDiv = document.createElement("div");
    addDiv.classList.add("cart-item");
    addDiv.innerHTML = ` 
            <img src=${item.img} alt=${item.name} />
            <div>
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
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // obtenemos todos los productos
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getAddBtn();
    });
});
