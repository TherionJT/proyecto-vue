<template>
  <div>
    <header>
      <div class="header-left">
        <img src="../assets/logo-uleam.png" alt="Logo" />
        <h1><i class="fas fa-chalkboard-teacher"></i> Panel del Profesor</h1>
      </div>
      <div>
        <button class="btn" @click="irATutorias"><i class="fas fa-calendar-alt"></i> Tutorías</button>
        <button class="btn" @click="cerrarSesion"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</button>
      </div>
    </header>

    <main>
      <div class="card bienvenida">👋 Bienvenido, {{ usuario?.nombre }}</div>

      <div class="contenedor-flex">
        <div class="card asignar-tutoria">
          <h2><i class="fas fa-user-plus"></i> Asignar Tutoría</h2>
          <div class="form-control">
            <label for="estudiante"><i class="fas fa-user-graduate"></i> Seleccionar estudiante:</label>
            <select id="estudiante" v-model="correoEstudianteSeleccionado" @change="mostrarInfoEstudiante">
              <option v-for="est in estudiantes" :key="est.correo" :value="est.correo">
                {{ est.nombre }} - {{ est.carrera }}
              </option>
            </select>
          </div>
          <div class="form-control">
            <label for="fecha"><i class="fas fa-calendar-day"></i> Fecha:</label>
            <input type="date" v-model="fecha" required />
          </div>
          <div class="form-control">
            <label for="hora"><i class="fas fa-clock"></i> Hora:</label>
            <input type="time" v-model="hora" required />
          </div>
          <div class="form-control">
            <label for="asunto"><i class="fas fa-book-open"></i> Asunto:</label>
            <input type="text" v-model="asunto" placeholder="Tema de la tutoría" required />
          </div>
          <div class="form-control">
            <button @click="asignarTutoria"><i class="fas fa-paper-plane"></i> Asignar</button>
          </div>
        </div>

        <div class="info-estudiante card" v-if="infoEstudiante">
          <p v-for="campo in camposEstudiante" :key="campo[0]">
            <i class="fas" :class="'fa-' + campo[0]"></i>
            <strong>{{ campo[1] }}:</strong> {{ campo[2] }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "ProfesorView",
  data() {
    return {
      usuario: null,
      estudiantes: [],
      correoEstudianteSeleccionado: null,
      infoEstudiante: null,
      fecha: "",
      hora: "",
      asunto: "",
    };
  },
  computed: {
    camposEstudiante() {
      if (!this.infoEstudiante) return [];
      return [
        ["user", "Nombre", this.infoEstudiante.nombre],
        ["id-card", "Cédula", this.infoEstudiante.cedula || "N/A"],
        ["envelope", "Correo", this.infoEstudiante.correo],
        ["graduation-cap", "Carrera", this.infoEstudiante.carrera],
        ["layer-group", "Semestre", this.infoEstudiante.semestre || "N/A"],
        ["balance-scale", "Estado académico", this.infoEstudiante.estado || "N/A"],
        ["user-tie", "Tutor", this.infoEstudiante.tutor || "Sin asignar"],
        ["project-diagram", "Proyecto", this.infoEstudiante.proyecto || "Ninguno"],
      ];
    },
  },
  methods: {
    getUsuarios() {
      return JSON.parse(localStorage.getItem("usuarios")) || [];
    },
    getUsuarioActual() {
      return JSON.parse(localStorage.getItem("usuario"));
    },
    validarSesion() {
      this.usuario = this.getUsuarioActual();
      if (!this.usuario || this.usuario.rol !== "profesor") {
        alert("Acceso no autorizado.");
        this.$router.push("/");
      }
    },
    cargarEstudiantes() {
      const usuarios = this.getUsuarios();
      this.estudiantes = usuarios.filter(
        (u) => u.rol === "estudiante" && u.tutor === this.usuario.nombre
      );
      if (this.estudiantes.length > 0) {
        this.correoEstudianteSeleccionado = this.estudiantes[0].correo;
        this.mostrarInfoEstudiante();
      }
    },
    mostrarInfoEstudiante() {
      const usuarios = this.getUsuarios();
      this.infoEstudiante = usuarios.find(
        (u) => u.correo === this.correoEstudianteSeleccionado
      );
    },
    asignarTutoria() {
      if (!this.fecha || !this.hora || !this.asunto) {
        alert("Completa todos los campos.");
        return;
      }
      const usuarios = this.getUsuarios();
      const estudiante = usuarios.find(
        (u) => u.correo === this.correoEstudianteSeleccionado
      );
      if (!estudiante) {
        alert("Estudiante no encontrado.");
        return;
      }
      const nuevaTutoria = {
        fecha: this.fecha,
        hora: this.hora,
        asunto: this.asunto,
        estudiante: estudiante.nombre,
        estudianteCorreo: estudiante.correo
      };
      estudiante.tutorias = estudiante.tutorias || [];
      estudiante.tutorias.push({ ...nuevaTutoria });

      const profesor = usuarios.find(
        (u) => u.correo === this.usuario.correo && u.rol === "profesor"
      );
      if (profesor) {
        profesor.tutoriasAsignadas = profesor.tutoriasAsignadas || [];
        profesor.tutoriasAsignadas.push({ ...nuevaTutoria });
      }

      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      alert("📌 Tutoría asignada con éxito.");

      this.fecha = "";
      this.hora = "";
      this.asunto = "";
    },

    cerrarSesion() {
      localStorage.removeItem("usuario");
      this.$router.push("/");
    },
    irATutorias() {
      this.$router.push("/tutorias-profesor");
    },
  },
  mounted() {
    this.validarSesion();
    this.cargarEstudiantes();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400;500&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

body {
  font-family: 'Roboto', sans-serif;
  background: url('https://www.transparenttextures.com/patterns/paper-fibers.png') #eef6f8;
  font-size: 1.2em;
}

header {
  background-color: #7965C1;
  color: white;
  padding: 1.5em 2.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2.5em;
}

.header-left img {
  height: 90px;
}

header h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 2em;
  margin: 0;
}

.btn {
  background-color: #0077cc;
  color: white;
  padding: 0.8em 1.5em;
  border: none;
  font-size: 1.2em;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 1em;
  transition: background 0.3s;
}

.btn:hover {
  background-color: #005fa3;
}

main {
  padding: 3em;
  max-width: 1750px;
  margin: auto;
}

.card {
  background: white;
  padding: 2.5em;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  margin-bottom: 2.5em;
}

.bienvenida {
  font-size: 1.8em;
  text-align: center;
  font-weight: bold;
  color: #003366;
}

.contenedor-flex {
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
}

.asignar-tutoria {
  flex: 1.5;
  min-width: 400px;
}

.asignar-tutoria h2 {
  font-family: 'Poppins', sans-serif;
  color: #003366;
  text-align: center;
  font-size: 1.6em;
  margin-top: 0;
}

.form-control {
  margin-bottom: 1.5em;
}

.form-control label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.form-control input,
.form-control select {
  width: 100%;
  padding: 0.8em;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
}

.form-control button {
  background-color: #0077cc;
  color: white;
  padding: 1em 2em;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.3s;
}

.form-control button:hover {
  background-color: #005fa3;
}

.info-estudiante {
  flex: 1.5;
  background-color: #ffffffcc;
  padding: 2em;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  font-size: 1.2em;
  min-width: 400px;
}

.info-estudiante p {
  margin: 1em 0;
  display: flex;
  align-items: center;
  gap: 0.6em;
}

.info-estudiante i {
  color: #0077cc;
}
</style>
