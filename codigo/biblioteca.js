// Función para registrar un nuevo usuario
function registrarUsuario() {
    let nombre = document.querySelector("#nombre").value;
    let apellido = document.querySelector("#apellido").value;
    let nombreUsuario = document.querySelector("#nombreUsuario").value;
    let contrasena = document.querySelector("#contrasena").value;
    let tarjetaCredito = document.querySelector("#tarjetaCredito").value;
    let cvc = document.querySelector("#cvc").value;

    let mensajesError = "";

    if (nombre === "" || nombre === null || nombre === undefined) {
        mensajesError += "El nombre es obligatorio.<br>";
    }

    if (apellido === "" || apellido === null || apellido === undefined) {
        mensajesError += "El apellido es obligatorio.<br>";
    }

    if (nombreUsuario === "" || nombreUsuario === null || nombreUsuario === undefined) {
        mensajesError += "El nombre de usuario es obligatorio.<br>";
    }

    if (contrasena.length < 5 || !contieneNumero(contrasena) || !contieneMayusculaYMinuscula(contrasena)) {
        mensajesError += "La contraseña debe tener al menos 5 caracteres, incluyendo una mayúscula, una minúscula y un número.<br>";
    }

    if (cvc.length !== 3 || isNaN(Number(cvc))) {
        mensajesError += "El CVC debe ser un número de 3 dígitos.<br>";
    }

    if (!formatoTarjetaValido(tarjetaCredito) || !validarTarjeta(tarjetaCredito)) {
        mensajesError += "El número de tarjeta de crédito es inválido.<br>";
    }

    if (sistema.buscarUsuarioPorNombreUsuario(nombreUsuario) != null) {
        mensajesError += "El nombre de usuario ya existe. Por favor, elige otro.<br>";
    }

    if (mensajesError !== "") {
        document.querySelector("#mensajesRegistro").innerHTML = mensajesError;
    } else {
        let usuario = new Usuario(nombre, apellido, nombreUsuario, contrasena, "comprador", tarjetaCredito, cvc);
        sistema.agregarUsuario(usuario);
        document.querySelector("#mensajesRegistro").innerHTML = "Registro exitoso.";

        document.querySelector("#nombre").value = "";
        document.querySelector("#apellido").value = "";
        document.querySelector("#nombreUsuario").value = "";
        document.querySelector("#contrasena").value = "";
        document.querySelector("#tarjetaCredito").value = "";
        document.querySelector("#cvc").value = "";
    }
}

// Función para iniciar sesión
function iniciarSesion() {
    let nombreUsuario = document.querySelector("#nombreUsuarioInicio").value;
    let contrasena = document.querySelector("#contrasenaInicio").value;
    let tipoUsuario = document.querySelector("#tipoUsuarioInicio").value;

    let mensajesError = "";
    let usuario = sistema.buscarUsuarioPorNombreUsuario(nombreUsuario);

    if (usuario == null || usuario.contrasena !== contrasena || usuario.tipo !== tipoUsuario) {
        mensajesError = "Nombre de usuario, contraseña o tipo de usuario incorrectos.<br>";
    }

    if (mensajesError !== "") {
        document.querySelector("#mensajesInicioSesion").innerHTML = mensajesError;
    } else {
        sistema.usuarioLogueado = usuario;
        document.querySelector("#btnVerCompras").style.display = usuario.tipo === "comprador" ? "block" : "none";
        document.querySelector("#btnVerOfertas").style.display = "block";
        document.querySelector("#btnRegistrarse").style.display = "none";
        document.querySelector("#btnIniciarSesion").style.display = "none";
        document.querySelector("#btnCerrarSesion").style.display = "block";
        document.querySelector("#mensajesInicioSesion").innerHTML = "";

        if (usuario.tipo === "admin") {
            document.querySelector("#btnAdministrarCompras").style.display = "block";
            document.querySelector("#btnCrearProducto").style.display = "block";
            document.querySelector("#btnAdministrarProductos").style.display = "block";
            document.querySelector("#btnInformeGanancias").style.display = "block";
        } else {
            document.querySelector("#btnAdministrarCompras").style.display = "none";
            document.querySelector("#btnCrearProducto").style.display = "none";
            document.querySelector("#btnAdministrarProductos").style.display = "none";
            document.querySelector("#btnInformeGanancias").style.display = "none";
        }

        mostrarProductos();
        cambiarSeccion("pantallaProductos");
    }
}

// Funciones para validación de usuario
function contieneNumero(cadena) {
    for (let i = 0; i < cadena.length; i++) {
        if ("0123456789".indexOf(cadena.charAt(i)) > -1) {
            return true;
        }
    }
    return false;
}

function contieneMayusculaYMinuscula(cadena) {
    let tieneMayuscula = false;
    let tieneMinuscula = false;
    for (let i = 0; i < cadena.length; i++) {
        let char = cadena.charAt(i);
        if (char >= 'A' && char <= 'Z') tieneMayuscula = true;
        if (char >= 'a' && char <= 'z') tieneMinuscula = true;
    }
    return tieneMayuscula && tieneMinuscula;
}

// Funciones para validación de tarjeta
function formatoTarjetaValido(numero) {
    if (numero.length !== 19) {
        return false;
    }
    for (let i = 0; i < numero.length; i++) {
        if (i === 4 || i === 9 || i === 14) {
            if (numero.charAt(i) !== '-') {
                return false;
            }
        } else {
            if (isNaN(Number(numero.charAt(i)))) {
                return false;
            }
        }
    }
    return true;
}

function validarTarjeta(nroTarjeta) {
    let tarjetaSinGuiones = "";
    for (let i = 0; i < nroTarjeta.length; i++) {
        if (nroTarjeta.charAt(i) !== '-') {
            tarjetaSinGuiones += nroTarjeta.charAt(i);
        }
    }

    let acumulador = 0;
    let digitoVerificar = Number(tarjetaSinGuiones.charAt(tarjetaSinGuiones.length - 1));
    let cont = 0;

    for (let i = tarjetaSinGuiones.length - 2; i >= 0; i--) {
        let valorAcumular = Number(tarjetaSinGuiones.charAt(i));
        if (cont % 2 === 0) {
            let duplicado = valorAcumular * 2;
            if (duplicado >= 10) {
                valorAcumular = Math.floor(duplicado / 10) + (duplicado % 10);
            } else {
                valorAcumular = duplicado;
            }
        }
        acumulador += valorAcumular;
        cont++;
    }

    let multiplicado = acumulador * 9;
    let digitoVerificador = Number(String(multiplicado).charAt(String(multiplicado).length - 1));
    return digitoVerificar === digitoVerificador;
}

// Función para manejar la compra de un producto
function manejoCompra() {
    let productoNombre = this.getAttribute("data-producto");
    let cantidad = document.querySelector(`input[data-producto="${productoNombre}"]`).value;
    comprarProducto(productoNombre, cantidad);
}

// Asignar la función de manejo a los botones de compra
function asignarManejoCompra() {
    let botonesComprar = document.querySelectorAll(".btnComprar");
    for (let i = 0; i < botonesComprar.length; i++) {
        botonesComprar[i].addEventListener("click", manejoCompra);
    }
}

// Función para mostrar productos disponibles
function mostrarProductos() {
    let productosDiv = document.querySelector("#listaProductos");
    productosDiv.innerHTML = "";

    for (let i = 0; i < sistema.productos.length; i++) {
        let producto = sistema.productos[i];
        if (producto.stock > 0 && producto.estado === "activo") {
            productosDiv.innerHTML += `
                <div class="producto">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">Precio: $${producto.precio}</p>
                    <p class="${producto.oferta ? "oferta" : "no-oferta"}">${producto.oferta ? "En oferta" : "Sin oferta"}</p>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
                    <input type="number" min="1" max="${producto.stock}" value="1" class="cantidad" data-producto="${producto.nombre}">
                    <button class="btnComprar" data-producto="${producto.nombre}">Comprar</button>
                </div>
            `;
        }
    }
    asignarManejoCompra();
}

// Función para mostrar ofertas
function mostrarOfertas() {
    let ofertasDiv = document.querySelector("#listaOfertas");
    ofertasDiv.innerHTML = "";

    for (let i = 0; i < sistema.productos.length; i++) {
        let producto = sistema.productos[i];
        if (producto.oferta && producto.stock > 0 && producto.estado === "activo") {
            ofertasDiv.innerHTML += `
                <div class="producto">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">Precio: $${producto.precio}</p>
                    <p class="${producto.oferta ? "oferta" : "no-oferta"}">${producto.oferta ? "En oferta" : "Sin oferta"}</p>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
                    <input type="number" min="1" max="${producto.stock}" value="1" class="cantidad" data-producto="${producto.nombre}">
                    <button class="btnComprar" data-producto="${producto.nombre}">Comprar</button>
                </div>
            `;
        }
    }
    asignarManejoCompra();
}

// Función para comprar productos
function comprarProducto(nombreProducto, cantidad) {
    let producto;
    for (let i = 0; i < sistema.productos.length; i++) {
        if (sistema.productos[i].nombre === nombreProducto) {
            producto = sistema.productos[i];
            break;
        }
    }
    cantidad = Number(cantidad);
    let totalCompra = producto.precio * cantidad;

    if (producto.stock >= cantidad) {
        let nuevaCompra = new Compra(producto, cantidad, "pendiente");
        sistema.usuarioLogueado.agregarCompra(nuevaCompra);
        alert("Has comprado " + cantidad + " unidades de " + producto.nombre + ".");
        mostrarProductos();
        mostrarOfertas();
        mostrarCompras();
    } else {
        alert("No hay suficiente stock para realizar la compra.");
    }
}

// Función para mostrar las compras del usuario comprador
function mostrarCompras() {
    let filtro = document.querySelector("#filtroEstadoCompras").value;
    let compras = sistema.usuarioLogueado.compras;
    let listaCompras = document.querySelector("#listaCompras");
    listaCompras.innerHTML = "";

    let totalAprobadas = 0;

    for (let i = 0; i < compras.length; i++) {
        let compra = compras[i];

        if (filtro === "all" || compra.estado === filtro) {
            listaCompras.innerHTML += `
                <div class="compra">
                    <p>Producto: ${compra.producto.nombre}</p>
                    <p>Cantidad: ${compra.cantidad}</p>
                    <p>Total: $${compra.total}</p>
                    <p>Estado: ${compra.estado}</p>
                    ${compra.estado === "pendiente" ? '<button class="btnCancelarCompra" data-indice-compra="' + i + '">Cancelar compra</button>' : ''}
                </div>
            `;
        }

        if (compra.estado === "aprobada") {
            totalAprobadas += compra.total;
        }
    }

    let saldoDisponible = sistema.usuarioLogueado.saldo;
    document.querySelector("#totalComprasAprobadas").innerHTML = "Monto total de compras aprobadas: $" + totalAprobadas;
    document.querySelector("#saldoUsuario").innerHTML = "Saldo disponible: $" + saldoDisponible;

    let botonesCancelarCompra = document.querySelectorAll(".btnCancelarCompra");
    for (let i = 0; i < botonesCancelarCompra.length; i++) {
        botonesCancelarCompra[i].addEventListener("click", manejoCompraCancelada);
    }
}

// Función para manejar la cancelación de una compra
function manejoCompraCancelada() {
    let indiceCompra = this.getAttribute("data-indice-compra");
    cancelarCompra(indiceCompra);
}

// Función para cancelar una compra
function cancelarCompra(indiceCompra) {
    let compra = sistema.usuarioLogueado.compras[indiceCompra];
    if (compra && compra.estado === "pendiente") {
        compra.estado = "cancelada";
        mostrarCompras();
    }
}

// Función para finalizar una compra
function finalizarCompra(nombreProducto) {
    let compra;
    for (let i = 0; i < sistema.usuarioLogueado.compras.length; i++) {
        if (sistema.usuarioLogueado.compras[i].producto.nombre === nombreProducto) {
            compra = sistema.usuarioLogueado.compras[i];
            break;
        }
    }

    let producto;
    for (let i = 0; i < sistema.productos.length; i++) {
        if (sistema.productos[i].nombre === nombreProducto) {
            producto = sistema.productos[i];
            break;
        }
    }

    if (compra.total <= sistema.usuarioLogueado.saldo && producto.stock >= compra.cantidad && producto.estado === "activo") {
        sistema.usuarioLogueado.saldo -= compra.total;
        producto.stock -= compra.cantidad;
        compra.estado = "aprobada";

        if (producto.stock === 0) {
            producto.estado = "pausado";
        }
    } else {
        compra.estado = "cancelada";
    }
    mostrarCompras();
}

// Función para mostrar las compras pendientes, aprobadas y canceladas por el administrador
function mostrarComprasAdmin() {
    let listaPendientes = document.querySelector("#listaComprasPendientes");
    let listaAprobadas = document.querySelector("#listaComprasAprobadas");
    let listaCanceladas = document.querySelector("#listaComprasCanceladas");

    listaPendientes.innerHTML = "";
    listaAprobadas.innerHTML = "";
    listaCanceladas.innerHTML = "";

    for (let i = 0; i < sistema.usuarios.length; i++) {
        let usuario = sistema.usuarios[i];
        for (let compra of usuario.compras) {
            let compraHtml = `
                <div class="compra">
                    <p>Usuario: ${usuario.nombreUsuario}</p>
                    <p>Producto: ${compra.producto.nombre}</p>
                    <p>Cantidad: ${compra.cantidad}</p>
                    <p>Total: $${compra.total}</p>
                    <p>Estado: ${compra.estado}</p>
                    ${compra.estado === "pendiente" ? `<button class="btnAprobar" data-nombreUsuario="${usuario.nombreUsuario}" data-producto="${compra.producto.nombre}">Aprobar compra</button>` : ''}
                    ${compra.estado === "pendiente" ? `<button class="btnCancelar" data-nombreUsuario="${usuario.nombreUsuario}" data-producto="${compra.producto.nombre}">Cancelar compra</button>` : ''}
                </div>
            `;

            if (compra.estado === "pendiente") {
                listaPendientes.innerHTML += compraHtml;
            } else if (compra.estado === "aprobada") {
                listaAprobadas.innerHTML += compraHtml;
            } else if (compra.estado === "cancelada") {
                listaCanceladas.innerHTML += compraHtml;
            }
        }
    }

    let botonesAprobar = document.querySelectorAll(".btnAprobar");
    for (let i = 0; i < botonesAprobar.length; i++) {
        let boton = botonesAprobar[i];
        boton.addEventListener("click", function() {
            let nombreUsuario = boton.getAttribute("data-nombreUsuario");
            let productoNombre = boton.getAttribute("data-producto");
            manejoCompraAprobada(nombreUsuario, productoNombre);
        });
    }

    let botonesCancelar = document.querySelectorAll(".btnCancelar");
    for (let i = 0; i < botonesCancelar.length; i++) {
        let boton = botonesCancelar[i];
        boton.addEventListener("click", function() {
            let nombreUsuario = boton.getAttribute("data-nombreUsuario");
            let productoNombre = boton.getAttribute("data-producto");
            manejoCompraCanceladaAdmin(nombreUsuario, productoNombre);
        });
    }
}

// Función para manejar la aprobación de una compra por el administrador
function manejoCompraAprobada(nombreUsuario, nombreProducto) {
    aprobarCompra(nombreUsuario, nombreProducto);
}

// Función para manejar la cancelación de una compra por el administrador
function manejoCompraCanceladaAdmin(nombreUsuario, nombreProducto) {
    cancelarCompraAdmin(nombreUsuario, nombreProducto);
}

// Función para aprobar una compra por el administrador
function aprobarCompra(nombreUsuario, nombreProducto) {
    let usuario = sistema.buscarUsuarioPorNombreUsuario(nombreUsuario);
    let compra;
    for (let i = 0; i < usuario.compras.length; i++) {
        if (usuario.compras[i].producto.nombre === nombreProducto) {
            compra = usuario.compras[i];
            break;
        }
    }

    let producto;
    for (let i = 0; i < sistema.productos.length; i++) {
        if (sistema.productos[i].nombre === nombreProducto) {
            producto = sistema.productos[i];
            break;
        }
    }

    if (compra.total <= usuario.saldo && producto.stock >= compra.cantidad && producto.estado === "activo") {
        usuario.saldo -= compra.total;
        producto.stock -= compra.cantidad;
        compra.estado = "aprobada";

        if (producto.stock === 0) {
            producto.estado = "pausado";
        }
    } else {
        compra.estado = "cancelada";
    }
    mostrarComprasAdmin();
}

// Función para cancelar una compra por el administrador
function cancelarCompraAdmin(nombreUsuario, nombreProducto) {
    let usuario = sistema.buscarUsuarioPorNombreUsuario(nombreUsuario);
    let compra;
    for (let i = 0; i < usuario.compras.length; i++) {
        if (usuario.compras[i].producto.nombre === nombreProducto) {
            compra = usuario.compras[i];
            break;
        }
    }
    if (compra.estado === "aprobada") {
        usuario.saldo += compra.total;
    }
    compra.estado = "cancelada";
    mostrarComprasAdmin();
}

// Función para crear un nuevo producto
function crearProducto() {
    let nombre = document.querySelector("#nombreProducto").value;
    let precio = document.querySelector("#precioProducto").value;
    let descripcion = document.querySelector("#descripcionProducto").value;
    let imagenCampo = document.querySelector("#imagenProducto").value;
    let stock = document.querySelector("#stockProducto").value;

    let mensajesError = "";

    if (nombre === "" || descripcion === "" || imagenCampo === "" || isNaN(precio) || precio <= 0 || isNaN(stock) || stock <= 0) {
        mensajesError += "Todos los campos son obligatorios y deben ser válidos.<br>";
    }

    if (mensajesError !== "") {
        document.querySelector("#mensajesErrorProducto").innerHTML = mensajesError;
    } else {
        let rutaFoto = "imgs/" + imagenCampo.substring(imagenCampo.lastIndexOf("\\") + 1);

        let producto = new Producto(nombre, descripcion, Number(precio), rutaFoto, Number(stock));
        sistema.agregarProducto(producto);

        document.querySelector("#mensajesErrorProducto").innerHTML = "Producto creado exitosamente.";
        document.querySelector("#nombreProducto").value = "";
        document.querySelector("#precioProducto").value = "";
        document.querySelector("#descripcionProducto").value = "";
        document.querySelector("#imagenProducto").value = "";
        document.querySelector("#stockProducto").value = "";
    }
}

// Función para mostrar los productos al administrador
function mostrarProductosAdmin() {
    let productosDiv = document.querySelector("#listaAdministrarProductos");
    productosDiv.innerHTML = "";

    for (let i = 0; i < sistema.productos.length; i++) {
        let producto = sistema.productos[i];
        productosDiv.innerHTML += `
            <div class="producto">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">Precio: $${producto.precio}</p>
                <p class="${producto.oferta ? "oferta" : "no-oferta"}">${producto.oferta ? "En oferta" : "Sin oferta"}</p>
                <p>Stock: ${producto.stock}</p>
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
                <label>Modificar Stock:</label>
                <input type="number" min="0" value="${producto.stock}" class="modificarStock" data-producto="${producto.nombre}">
                <label>Estado:</label>
                <select class="modificarEstado" data-producto="${producto.nombre}">
                    <option value="activo" ${producto.estado === "activo" ? "selected" : ""}>Activo</option>
                    <option value="pausado" ${producto.estado === "pausado" ? "selected" : ""}>Pausado</option>
                </select>
                <label>Oferta:</label>
                <select class="modificarOferta" data-producto="${producto.nombre}">
                    <option value="true" ${producto.oferta ? "selected" : ""}>Sí</option>
                    <option value="false" ${!producto.oferta ? "selected" : ""}>No</option>
                </select>
                <button class="btnGuardarCambios" data-producto="${producto.nombre}">Guardar Cambios</button>
            </div>
        `;
    }
    let botonesGuardar = document.querySelectorAll(".btnGuardarCambios");
    for (let i = 0; i < botonesGuardar.length; i++) {
        botonesGuardar[i].addEventListener("click", manejoGuardarCambios);
    }
}

// Función para manejar los cambios en los productos
function manejoGuardarCambios() {
    let productoNombre = this.getAttribute("data-producto");
    guardarCambiosProducto(productoNombre);
}

// Función para guardar los cambios en los productos
function guardarCambiosProducto(nombreProducto) {
    let producto;
    for (let i = 0; i < sistema.productos.length; i++) {
        if (sistema.productos[i].nombre === nombreProducto) {
            producto = sistema.productos[i];
            break;
        }
    }

    let nuevoStock = document.querySelector(`.modificarStock[data-producto="${nombreProducto}"]`).value;
    let nuevoEstado = document.querySelector(`.modificarEstado[data-producto="${nombreProducto}"]`).value;
    let nuevaOferta = document.querySelector(`.modificarOferta[data-producto="${nombreProducto}"]`).value;

    producto.stock = Number(nuevoStock);
    producto.estado = nuevoEstado;
    producto.oferta = (nuevaOferta === "true");

    if (producto.stock === 0) {
        producto.estado = "pausado";
    }

    mostrarProductosAdmin();
}

// Función para mostrar el informe de ganancias
function mostrarInformeGanancias() {
    let informeDiv = document.querySelector("#informeGanancias");
    informeDiv.innerHTML = "<h3>Informe de ganancias</h3>";

    let totalGanancias = 0;

    let tabla = `
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Unidades vendidas</th>
                    <th>Ganancias</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let productoIndex = 0; productoIndex < sistema.productos.length; productoIndex++) {
        let producto = sistema.productos[productoIndex];
        let totalVendido = 0;

        for (let usuarioIndex = 0; usuarioIndex < sistema.usuarios.length; usuarioIndex++) {
            let usuario = sistema.usuarios[usuarioIndex];

            for (let compraIndex = 0; compraIndex < usuario.compras.length; compraIndex++) {
                let compra = usuario.compras[compraIndex];

                if (compra.producto.nombre === producto.nombre && compra.estado === "aprobada") {
                    totalVendido += compra.cantidad;
                }
            }
        }

        let gananciasProducto = totalVendido * producto.precio;
        totalGanancias += gananciasProducto;

        tabla += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${totalVendido}</td>
                <td>$${gananciasProducto}</td>
            </tr>
        `;
    }
    tabla += `
            </tbody>
        </table>
        <h3>Total Ganancias: $${totalGanancias}</h3>
    `;
    informeDiv.innerHTML = tabla;
}
