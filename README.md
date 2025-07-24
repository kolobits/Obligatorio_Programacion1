# 🛍️ Obligatorio - Tienda Deportiva

Este es un proyecto desarrollado para la materia **Programación 1** en la carrera de **Analista en Tecnologías de la Información** de la Universidad ORT. Se trata de una tienda virtual de ropa y artículos deportivos, construida completamente con **HTML, CSS y JavaScript puro**, sin frameworks ni base de datos.

---

## 📌 Funcionalidades principales

- Registro de usuarios con validaciones de contraseña, CVC y tarjeta de crédito.
- Inicio de sesión con control de tipo de usuario (`comprador` o `admin`).
- Listado dinámico de productos deportivos con imágenes, stock y estado de oferta.
- Simulación de compras con saldo inicial y control de stock.
- Administración de productos y compras (solo para usuarios admin).
- Reporte final de ganancias basado en ventas realizadas.

---

## 🧠 Estructura del Código

El proyecto está modelado con programación orientada a objetos (POO) y una arquitectura basada en clases:

### 🔹 `Usuario`
Representa a cada persona en el sistema. Atributos:
- Datos personales y de acceso.
- Tipo (`admin` o `comprador`).
- Saldo inicial.
- Historial de compras.

### 🔹 `Compra`
Objeto que guarda cada transacción de compra. Incluye:
- Producto comprado.
- Cantidad y estado (`pendiente`, `aprobada`, `cancelada`).
- Total calculado automáticamente.

### 🔹 `Producto`
Contiene toda la información del artículo:
- Nombre, precio, stock, imagen.
- Estado (`activo` o `pausado`).
- Si está o no en oferta.

### 🔹 `Sistema`
Clase central que maneja toda la lógica:
- Registro y login de usuarios.
- Manejo de productos y compras.
- Control de sesiones y permisos.
- Reporte de ganancias para el administrador.

---

## 👨‍💻 Autor

**Camilo Pardo**  
Estudiante de Analista en Tecnologías de la Información  
Universidad ORT Uruguay  
