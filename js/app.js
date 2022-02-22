// mapeamos los productos
fetch("./data.json", {
  method: "GET",
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.table(data);
    data.map((mug) => {
      console.log(mug.img);
      const divProductos = document.querySelector("#productos");
      divProductos.innerHTML += `
        <div class="containerProduct">
            <img src="${mug.img}" class="imgProduct">
            <h2>${mug.name}</h2>
            <div class="infoProduct">
                <h4>Stock: ${mug.stock}</h4>
                <h3>$${mug.precio}</h3>
            </div>
            <div class="infoProduct">
                <div class="centrar">
                <button class="addProduct">Agregar</button>
                </div>
        </div>            `;
    });
  });

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
    let precioTotal = new Intl.NumberFormat("es-CL").format(
      Math.floor(precio1 + precio2 + precioConIva)
    );
    if (precioTotal >= 20000) {
      getResult.innerHTML = `El total de tu compra es: $ ${precioTotal} CLP`;
    } else {
      getResult.innerHTML = `El total de tu compra es: $ ${precioTotal} CLP, necesitas agregar más productos a tu carrito.`;
    }
  });
};

CalcularCosto();

//   const firstBatch = recetas.slice(0, 6);

//   console.log(firstBatch, "corte");

//   const [currentRecetasRender, setCurrentRecetasRender] = useState(firstBatch);

//   const setCurrentRecetasRenderHandler = () => {
//     do {
//       setCurrentRecetasRender(
//         recetas.slice(0, currentRecetasRender.length + 6)
//       );
//     } while (currentRecetasRender.length === recetas.length);
// };

//         <div className={handles.RecetaFooter}>
//           {currentRecetasRender.length < 21 ? (
//             <button
//               className={handles.RecetaBtnSeeMore}
//               onClick={setCurrentRecetasRenderHandler}
//             >
//               Ver más recetas
//             </button>
//           ) : (
//             <p className={handles.RecetaNoMoreBlogs}>
//               {" "}
//               No hay más recetas por ahora
//             </p>
//           )}
//         </div>;
