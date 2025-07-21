<template>
  <div>
    <header>
      <div class="flex-gap">
        <img src="../assets/logo-uleam.png" alt="Logo" />
        <h1><i class="fas fa-user-graduate"></i> Panel del Estudiante</h1>
      </div>
      <div class="header-buttons">
        <button class="btn-base btn-blue" @click="irATutorias">
          <i class="fas fa-calendar-alt"></i> Tutorías
        </button>
        <button class="btn-base btn-gray" @click="cerrarSesion">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </header>

    <main>
      <div class="info card">
        <h2><i class="fas fa-user-circle"></i> Bienvenido/a</h2>
        <p><strong>Nombre:</strong> {{ estudiante.nombre }}</p>
        <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
        <p><strong>Carrera:</strong> {{ estudiante.carrera }}</p>
        <p><strong>Semestre:</strong> {{ estudiante.semestre }}</p>
        <p><strong>Estado académico:</strong> {{ estudiante.estado }}</p>
        <p><strong>Tutor asignado:</strong> {{ estudiante.tutor || 'No asignado' }}</p>
        <p><strong>Proyecto:</strong> {{ estudiante.proyecto || 'Ninguno' }}</p>

        <h2><i class="fas fa-lightbulb"></i> Proyecto de Titulación</h2>
        <textarea v-model="proyecto" placeholder="Nombre del proyecto..." rows="2"></textarea>
        <br /><br />
        <button class="btn-base btn-green" @click="guardarProyecto">
          <i class="fas fa-save"></i> Guardar Proyecto
        </button>
      </div>

      <div class="notificaciones card">
        <h2><i class="fas fa-bell"></i> Notificaciones de Tutorías</h2>
        <div class="lista-tutorias">
          <div v-if="tutorias.length === 0">
            <p>No tienes tutorías programadas.</p>
          </div>
          <div class="tutoria" v-for="(t, index) in tutorias" :key="index">
            <p><strong>Fecha:</strong> {{ t.fecha }}</p>
            <p><strong>Hora:</strong> {{ t.hora }}</p>
            <p><strong>Asunto:</strong> {{ t.asunto }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "EstudianteView",
  data() {
    return {
      usuario: null,
      usuarios: [],
      estudiante: {
        nombre: "",
        cedula: "",
        carrera: "",
        semestre: "",
        estado: "",
        tutor: "",
        proyecto: "",
        tutorias: [],
      },
      proyecto: ""
    };
  },
  methods: {
    validarSesionEstudiante() {
      const u = JSON.parse(localStorage.getItem("usuario"));
      if (!u || u.rol !== "estudiante") {
        alert("Acceso no autorizado.");
        window.location.href = "index.html";
      }
      this.usuario = u;
    },
    cerrarSesion() {
      localStorage.removeItem("usuario");
      this.$router.push("/");
    },
    irATutorias() {
      this.$router.push("/tutorias");
    },
    cargarInformacionEstudiante() {
      this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const estudianteActual = this.usuarios.find(u => u.correo === this.usuario.correo);

      if (!estudianteActual) {
        alert("Estudiante no encontrado.");
        return;
      }

      this.estudiante = { ...estudianteActual };
      this.proyecto = estudianteActual.proyecto || "";
    },
    guardarProyecto() {
      const index = this.usuarios.findIndex(u => u.correo === this.usuario.correo);
      if (index >= 0) {
        this.usuarios[index].proyecto = this.proyecto.trim();
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
        this.estudiante.proyecto = this.proyecto.trim();
        alert("Proyecto guardado correctamente.");
      }
    }
  },
  computed: {
    tutorias() {
      return this.estudiante?.tutorias || [];
    }
  },
  mounted() {
    this.validarSesionEstudiante();
    this.cargarInformacionEstudiante();
  }
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  background-color: #eef6f8;
  margin: 0;
  font-size: 1.2em;
}

.flex-gap {
  display: flex;
  align-items: center;
  gap: 2em;
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
  font-family: 'Poppins', sans-serif;
  font-size: 2.2em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.header-buttons {
  display: flex;
  gap: 1em;
}

.btn-base {
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

.btn-green {
  background-color: green;
  color: white;
}
.btn-green:hover {
  background-color: darkgreen;
}

.btn-gray {
  background-color: #666;
  color: white;
}
.btn-gray:hover {
  background-color: #444;
}

.btn-blue {
  background-color: #17a2b8;
  color: white;
}
.btn-blue:hover {
  background-color: #138496;
}

main {
  padding: 3em 2em;
  max-width: 1000px;
  margin: auto;
}

.card {
  background: white;
  padding: 2em;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 2em;
  font-size: 1.1em;
}

h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.6em;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

textarea {
  width: 95%;
  padding: 1em;
  font-size: 1.1em;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
}

.lista-tutorias .tutoria {
  background-color: #f0f8ff;
  padding: 1.2em;
  border-radius: 10px;
  margin-bottom: 1em;
  border-left: 5px solid #0077cc;
}

img {
  height: 100px;
}
</style>
