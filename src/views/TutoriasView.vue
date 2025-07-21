<template>
  <div>
    <header>
      <div class="header-left">
        <img src="../assets/logo-uleam.png" alt="Logo ULEAM" style="height: 100px;"/>
        <h1>Mis Tutorías</h1>
      </div>
      <div class="header-buttons">
        <button class="btn1 btn-volver" @click="$router.push('/estudiante')">
          <i class="fas fa-arrow-left"></i> Volver al Panel
        </button>
        <button class="btn1 btn-cerrar" @click="cerrarSesion">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </header>

    <main>
      <h2><i class="fas fa-calendar-check"></i> Tutorías Pendientes</h2>

      <div v-if="tutorias.length === 0">
        <p>No tienes tutorías registradas.</p>
      </div>

      <div
        v-for="(tutoria, i) in tutorias"
        :key="i"
        :class="['tutoria', { confirmado: tutoria.confirmada }]"
      >
        <p><strong>📅 Fecha:</strong> {{ tutoria.fecha }}</p>
        <p><strong>⏰ Hora:</strong> {{ tutoria.hora }}</p>
        <p><strong>📌 Asunto:</strong> {{ tutoria.asunto }}</p>

        <template v-if="tutoria.confirmada">
          <p style="color:green;"><strong>✅ Confirmada</strong></p>

          <p v-if="tutoria.finalizada" class="finalizada-msg">
            ❌ El tutor finalizó esta tutoría
          </p>

          <template v-else>
            <div v-if="tutoria.avance">
              <p>
                <strong>📄 Avance subido:</strong> <em>PDF cargado</em>
              </p>
              <button class="btn" @click="remplazarArchivo(i)">
                <i class="fas fa-file-upload"></i> Reemplazar archivo
              </button>
              <button class="btn btn-cerrar" @click="eliminarArchivo(i)">
                <i class="fas fa-trash"></i> Eliminar archivo
              </button>
            </div>

            <div v-else>
              <label class="archivo-label">📤 Subir avance (PDF):</label>
              <input type="file" accept="application/pdf" @change="subirAvance($event, i)" />
            </div>
          </template>
        </template>

        <template v-else>
          <button class="btn" @click="confirmarTutoria(i)">
            <i class="fas fa-check-circle"></i> Aceptar tutoría
          </button>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "MisTutoriasView",
  data() {
    return {
      usuario: null,
      usuarios: [],
      tutorias: [],
    };
  },
  mounted() {
    this.validarSesionEstudiante();
    this.mostrarTutoriasPendientes();
  },
  methods: {
    validarSesionEstudiante() {
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      if (!this.usuario || this.usuario.rol !== "estudiante") {
        alert("Acceso no autorizado.");
        this.$router.push("/");
      }
    },
    cerrarSesion() {
      localStorage.removeItem("usuario");
      this.$router.push("/");
    },
    guardarUsuarios() {
      localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    },
    mostrarTutoriasPendientes() {
      const estudiante = this.usuarios.find(
        (u) => u.correo === this.usuario.correo
      );
      this.tutorias = estudiante?.tutorias || [];
    },
    confirmarTutoria(index) {
      const estudiante = this.usuarios.find(
        (u) => u.correo === this.usuario.correo
      );
      estudiante.tutorias[index].confirmada = true;
      this.guardarUsuarios();
      this.mostrarTutoriasPendientes();
      alert("Tutoría confirmada.");
    },
    subirAvance(event, index) {
      const archivo = event.target.files[0];
      if (!archivo || archivo.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF.");
        return;
      }

      const lector = new FileReader();
      lector.onload = () => {
        const base64 = lector.result;
        const estudiante = this.usuarios.find(
          (u) => u.correo === this.usuario.correo
        );
        estudiante.tutorias[index].avance = base64;
        this.guardarUsuarios();
        this.mostrarTutoriasPendientes();
        alert("Avance subido correctamente.");
      };
      lector.readAsDataURL(archivo);
    },
    remplazarArchivo(index) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.onchange = (event) => this.subirAvance(event, index);
      input.click();
    },
    eliminarArchivo(index) {
      if (!confirm("¿Estás seguro de que deseas eliminar el archivo subido?"))
        return;

      const estudiante = this.usuarios.find(
        (u) => u.correo === this.usuario.correo
      );
      delete estudiante.tutorias[index].avance;
      this.guardarUsuarios();
      this.mostrarTutoriasPendientes();
      alert("Archivo eliminado.");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400;500&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

body {
  font-family: "Roboto", sans-serif;
  background-color: #eef6f8;
  margin: 0;
  font-size: 1.2em;
}

header {
  background-color: skyblue;
  color: white;
  padding: 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

header h1 {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 2.2em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2.5em;
}

.header-buttons {
  display: flex;
  gap: 1em;
}

.btn1 {
  color: white;
  padding: 0.8em 1.6em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}

.btn {
  background-color: #0077cc;
  color: white;
  padding: 0.8em 1.2em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  margin: 0.4em 0.2em;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.btn:hover {
  background-color: #005fa3;
}

.btn-volver {
  background-color: #17a2b8;
}

.btn-volver:hover {
  background-color: #138496;
}

.btn-cerrar {
  background-color: #666;
}

.btn-cerrar:hover {
  background-color: #444;
}

main {
  padding: 3em;
  max-width: 1000px;
  margin: auto;
}

h2 {
  font-family: "Poppins", sans-serif;
  font-size: 2em;
}

.tutoria {
  background-color: #ffffff;
  padding: 2em;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2em;
  border-left: 6px solid #0077cc;
}

.tutoria.confirmado {
  border-left-color: green;
}

.archivo-label {
  margin-top: 1em;
  display: block;
  font-weight: 500;
}

input[type="file"] {
  margin-top: 0.5em;
  font-size: 1em;
}

.finalizada-msg {
  color: red;
  font-weight: bold;
  margin-top: 1em;
  font-size: 1.1em;
}

p {
  margin: 0.5em 0;
}
</style>
