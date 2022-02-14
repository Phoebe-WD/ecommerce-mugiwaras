const CalcularCosto = () => {
  const getBtn = document.getElementById("calcular");
  const getResult = document.getElementById("resultado");
  getBtn.addEventListener("click", () => {
    const precio1 = Number(document.getElementById("precio1").value);
    const precio2 = Number(document.getElementById("precio2").value);
    console.log(precio1, precio2, "loh inpu");
    const iva = 19;
    let precioConIva = ((precio1 + precio2) * iva) / 100;
    console.log(precioConIva, "nos sumamos?");
    let precioTotal = Math.floor(precio1 + precio2 + precioConIva);
    if (precioTotal >= 20000) {
      getResult.innerHTML = `El total de tu compra es: $ ${precioTotal}`;
    } else {
      getResult.innerHTML = `El total de tu compra es: $ ${precioTotal}, necesitas agregar más productos a tu carrito.`;
    }
  });
};

CalcularCosto();
