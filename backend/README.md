# Tripleten web_project_api:full_19

Autor

Dayana Davila

# Around the U.S. - API Backend

Este es el servidor encargado de gestionar la base de datos, la autenticación de usuarios y las operaciones CRUD para las tarjetas de la aplicación.

## 🚀 Tecnologías Utilizadas
* **Node.js y Express**: Framework del servidor.
* **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
* **JWT (JSON Web Tokens)**: Para la autenticación segura.
* **Bcryptjs**: Encriptación de contraseñas.
* **PM2**: Gestor de procesos para mantener el servidor activo 24/7.

## 🔒 Seguridad y Configuración
* **CORS**: Configurado para permitir peticiones desde el dominio del frontend.
* **HTTPS**: Conexión cifrada mediante certificados de **Certbot / Let's Encrypt**.
* **Nginx**: Actúa como Proxy Inverso enviando las peticiones al puerto `3000`.

## 📁 Estructura del Proyecto
* `/models`: Esquemas de Mongoose (User, Card).
* `/controllers`: Lógica de las peticiones.
* `/routes`: Definición de endpoints (users, cards).
* `/middleware`: Validaciones de autenticación.
