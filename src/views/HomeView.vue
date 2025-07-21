<template>
  <div class="container">
    <!-- Panel izquierdo con logo -->
    <div class="left-panel">
      <img src="../assets/logo1.png" alt="Logo" style="height: 400px;"/>
    </div>

    <!-- Panel derecho con login -->
    <div class="right-panel">
      <div class="login-box">
        <h2>INICIO DE SESIÓN</h2>
        <form @submit.prevent="iniciarSesion">
          <label for="email">Correo institucional:</label>
          <input type="email" id="email" v-model="correo" required placeholder="usuario@live.uleam.edu.ec" />

          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="contrasena" required placeholder="••••••••" />

          <div class="remember">
            <input type="checkbox" id="remember" v-model="recordar" />
            <label for="remember">Recordar contraseña</label>
          </div>

          <button type="submit">Iniciar Sesión</button>
          <p id="message" :class="mensajeClase">{{ mensaje }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      correo: '',
      contrasena: '',
      recordar: false,
      mensaje: '',
      mensajeClase: '',
    };
  },
  mounted() {
    const adminPorDefecto = {
      rol: 'administrador',
      correo: 'admin@uleam.admin.edu.ec',
      contrasena: 'admin123',
    };

    let usuarios = JSON.parse(localStorage.getItem('usuarios'));

    if (!usuarios || usuarios.length === 0) {
      usuarios = [adminPorDefecto];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    } else {
      const existeAdmin = usuarios.some(u => u.correo === adminPorDefecto.correo);
      if (!existeAdmin) {
        usuarios.push(adminPorDefecto);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    }
  },
  methods: {
    iniciarSesion() {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuario = usuarios.find(
        u => u.correo === this.correo && u.contrasena === this.contrasena
      );

      if (!usuario) {
        this.mensaje = 'Correo o contraseña incorrectos.';
        this.mensajeClase = 'error';
        return;
      }

      localStorage.setItem('usuario', JSON.stringify(usuario));

      switch (usuario.rol) {
        case 'administrador':
          this.$router.push('/admin');
          break;
        case 'profesor':
          this.$router.push('/profesor');
          break;
        case 'estudiante':
          this.$router.push('/estudiante');
          break;
        default:
          this.mensaje = 'Rol no reconocido.';
          this.mensajeClase = 'error';
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body,
html,
.container {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
  display: flex;
}

.left-panel {
  width: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
}

.left-panel img {
  max-width: 80%;
  height: auto;
}

.right-panel {
  width: 50%;
  background: #f4f8fc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
}

.login-box {
  width: 100%;
  max-width: 550px;
  background: #ffffff;
  padding: 4em 3em;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.login-box:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.login-box h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 2em;
  margin-bottom: 1.5em;
  color: #003366;
  text-align: center;
}

.login-box label {
  font-weight: 500;
  margin-bottom: 0.4em;
  display: block;
  font-size: 1em;
  color: #333;
}

.login-box input[type="email"],
.login-box input[type="password"] {
  width: 100%;
  padding: 1em;
  margin-bottom: 1.2em;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1em;
}

.login-box .remember {
  display: flex;
  align-items: center;
  margin-bottom: 1.2em;
  font-size: 1em;
}

.login-box .remember input {
  margin-right: 0.5em;
}

.login-box button {
  width: 100%;
  padding: 1em;
  background: #0066cc;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  transition: background 0.3s ease;
}

.login-box button:hover {
  background: #004c99;
}

#message {
  margin-top: 1em;
  font-size: 0.9em;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
