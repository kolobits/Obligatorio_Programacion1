// Clase Usuario para representar a cada usuario del sistema
class Usuario {
    constructor(nombre, apellido, nombreUsuario, contrasena, tipo = "comprador", tarjetaCredito, cvc, saldo = 3000) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.tarjetaCredito = tarjetaCredito;
        this.cvc = cvc;
        this.compras = [];
        this.saldo = saldo;
        this.tipo = tipo;
        this.id = null;
    }

    // Método para agregar una compra al usuario
    agregarCompra(compra) {
        this.compras.push(compra);
    }
}
// Clase Compra para representa cada compra realizada por un usuario
class Compra {
    constructor(producto, cantidad, estado) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.estado = estado;
        this.total = producto.precio * cantidad;
    }
}

// Clase Producto para representar cada producto disponible en la tienda
class Producto {
    constructor(nombre, descripcion, precio, imagen, stock, estado = "activo", oferta = false) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
        this.estado = estado;
        this.oferta = oferta;
        this.id = null;
    }
}

// Clase Sistema para manejar la lógica del sistema
class Sistema {
    constructor() {
        this.usuarios = [];
        this.usuarioLogueado = null;
        this.productos = [];
        this.nextProductId = 1;
        this.nextUserId = 1;
    }

    // Método para agregar un usuario al sistema
    agregarUsuario(usuario) {
        usuario.id = this.nextUserId++;
        this.usuarios.push(usuario);
    }

    // Método para buscar un usuario por su nombre de usuario
    buscarUsuarioPorNombreUsuario(nombreUsuario) {
        for (let i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase()) {
                return this.usuarios[i];
            }
        }
        return null;
    }

    // Método para agregar un producto al sistema
    agregarProducto(producto) {
        producto.id = `PROD_ID_${this.nextProductId++}`;
        this.productos.push(producto);
    }
}
// Crear una instancia del sistema
let sistema = new Sistema();

// Precarga de usuarios adminitradores
sistema.agregarUsuario(new Usuario("Camilo", "Pardo", "kolo", "Hola1234", "admin"));
sistema.agregarUsuario(new Usuario("Luka", "Modric", "luka", "Croacia2", "admin"));
sistema.agregarUsuario(new Usuario("Cristiano", "Ronaldo", "cr7", "Portugal1", "admin"));
sistema.agregarUsuario(new Usuario("Luis", "Suarez", "pistolero", "Bolso1", "admin"));
sistema.agregarUsuario(new Usuario("Lionel", "Messi", "goat", "Argentina3", "admin"));

// Precarga de usuarios compradores
sistema.agregarUsuario(new Usuario("Juan", "Perez", "juan", "Hola1234", "comprador", "1234-5678-1234-5678", "123", 3000));
sistema.agregarUsuario(new Usuario("Martina", "Mendez", "Martina", "Hola1234", "comprador", "1234-5678-1234-5678", "956", 3000));
sistema.agregarUsuario(new Usuario("Santiago", "Fagnoni", "Santiago", "Programacion1", "comprador", "4016-5619-6473-5240", "532", 3000));
sistema.agregarUsuario(new Usuario("Agustina", "Rodriguez", "agustina", "Practicos1", "comprador", "5100-9187-2573-1211", "076", 3000));
sistema.agregarUsuario(new Usuario("Rodrigo", "Bouza", "rodrigo", "Diseno1", "comprador", "5102-6898-3694-6513", "423", 3000));

// Precarga de productos
sistema.agregarProducto(new Producto("Nike Phantom GX 2 Elite LV8", "Botines de Pasto Natural Unisex", 1299, "imgs/botines.png", 0, "pausado", false));
sistema.agregarProducto(new Producto("Nike Sportswear Tech Fleece", "Buzo con Capucha de Moda Unisex", 1099, "imgs/buzo.png", 3, "activo", true));
sistema.agregarProducto(new Producto("Nike Peak", "Gorro de Entrenamiento Unisex", 599, "imgs/gorro.png", 1, "activo", false));
sistema.agregarProducto(new Producto("Liverpool FC local 2023/24", "Camiseta de Fútbol para Hombre", 999, "imgs/camiseta.png", 2, "activo", true));
sistema.agregarProducto(new Producto("Air Jordan 1 Mid", "Zapatillas Jordan Unisex", 2199, "imgs/air.png", 4, "activo", true));
sistema.agregarProducto(new Producto("Nike Everyday Lightweight", "Medias de Entrenamiento Unisex", 399, "imgs/medias.png", 10, "activo", false));
sistema.agregarProducto(new Producto("Nike Air Force 1 Shadow", "Zapatillas de Moda para Mujer", 1599, "imgs/airForce.png", 4, "activo", false));
sistema.agregarProducto(new Producto("Premier League Pitch", "Pelota de Fútbol", 199, "imgs/pelota.png", 5, "pausado", true));
sistema.agregarProducto(new Producto("Nike Heritage", "Bandolera de Moda Unisex", 799, "imgs/bandolera.png", 2, "activo", true));
sistema.agregarProducto(new Producto("Nike Sportswear Classic Puffer", "Campera de Moda para Mujer", 2499, "imgs/campera.png", 2, "activo", true));

// Precarga de compras
function precargarCompras(usuario, productos) {

    let compras = [
        new Compra(productos[6], 1, "pendiente"),
        new Compra(productos[1], 2, "pendiente"),
        new Compra(productos[2], 1, "pendiente"),
        new Compra(productos[3], 1, "pendiente"),
        new Compra(productos[8], 1, "pendiente")
    ];

    for (let i = 0; i < compras.length; i++) {
        usuario.agregarCompra(compras[i]);
    }
}

let usuarioJuan;
for (let i = 0; i < sistema.usuarios.length; i++) {
    if (sistema.usuarios[i].nombreUsuario === "juan") {
        usuarioJuan = sistema.usuarios[i];
        break;
    }
}

if (usuarioJuan) {
    precargarCompras(usuarioJuan, sistema.productos);
}

// Función para cambiar de sección en la interfaz de usuario
function cambiarSeccion(idSeccion) {
    let secciones = document.querySelectorAll(".seccion");
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }
    document.querySelector(`#${idSeccion}`).style.display = "block";

    let mensajeExito = document.querySelector("#mensajeExito");
    mensajeExito.style.display = "none";
}

// Eventos de la interfaz de usuario
document.querySelector("#btnRegistrarse").addEventListener("click", function () {
    cambiarSeccion("pantallaRegistro");
});

document.querySelector("#btnIniciarSesion").addEventListener("click", function () {
    cambiarSeccion("pantallaInicioSesion");
});

document.querySelector("#btnEnviarRegistro").addEventListener("click", function () {
    registrarUsuario();
});

document.querySelector("#btnEnviarInicioSesion").addEventListener("click", function () {
    iniciarSesion();
});

document.querySelector("#filtroEstadoCompras").addEventListener("change", function () {
    mostrarCompras();
});

document.querySelector("#btnVerCompras").addEventListener("click", function () {
    mostrarCompras();
    cambiarSeccion("pantallaCompras");
});

document.querySelector("#btnVerOfertas").addEventListener("click", function () {
    mostrarOfertas();
    cambiarSeccion("pantallaOfertas");
});

document.querySelector("#btnAdministrarCompras").addEventListener("click", function () {
    mostrarComprasAdmin();
    cambiarSeccion("pantallaAdministrarCompras");
});

document.querySelector("#btnCerrarSesion").addEventListener("click", function () {
    sistema.usuarioLogueado = null;
    document.querySelector("#btnVerCompras").style.display = "none";
    document.querySelector("#btnVerOfertas").style.display = "none";
    document.querySelector("#btnAdministrarCompras").style.display = "none";
    document.querySelector("#btnCrearProducto").style.display = "none";
    document.querySelector("#btnAdministrarProductos").style.display = "none";
    document.querySelector("#btnInformeGanancias").style.display = "none";
    document.querySelector("#btnRegistrarse").style.display = "block";
    document.querySelector("#btnIniciarSesion").style.display = "block";
    document.querySelector("#btnCerrarSesion").style.display = "none";
    cambiarSeccion("pantallaBienvenida");
});

document.querySelector("#btnEnviarProducto").addEventListener("click", function () {
    crearProducto();
});

document.querySelector("#btnAdministrarProductos").addEventListener("click", function () {
    mostrarProductosAdmin();
    cambiarSeccion("pantallaAdministrarProductos");
});

document.querySelector("#btnCrearProducto").addEventListener("click", function () {
    cambiarSeccion("pantallaCrearProducto");
});

document.querySelector("#btnInformeGanancias").addEventListener("click", function () {
    mostrarInformeGanancias();
    cambiarSeccion("pantallaGanancias");
});
