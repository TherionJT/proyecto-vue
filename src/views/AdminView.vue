<template>
  <div>
    <header>
      <div class="flex-gap">
        <img src="../assets/logo-uleam.png" alt="Logo" style="height: 90px;" />
        <h1><i class="fas fa-user-cog"></i> Administrador</h1>
      </div>
      <div class="header-buttons">
        <button class="btn" @click="cerrarSesion">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </header>

    <main>
      <div class="box">
        <h2><i class="fas fa-user-plus"></i> Crear Usuario</h2>
        <select v-model="nuevoUsuario.rol" @change="mostrarCampos">
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
        </select>
        <input v-model="nuevoUsuario.nombre" placeholder="Nombre completo" />
        <div v-if="nuevoUsuario.rol === 'estudiante'" id="camposEstudiante">
          <input v-model="nuevoUsuario.cedula" placeholder="Cédula" />
          <input v-model="nuevoUsuario.carrera" placeholder="Carrera" />
          <input v-model="nuevoUsuario.semestre" placeholder="Semestre" />
          <input v-model="nuevoUsuario.estado" placeholder="Estado (Regular, Bueno...)" />
        </div>
        <input v-model="nuevoUsuario.correo" placeholder="Correo institucional" />
        <input type="password" v-model="nuevoUsuario.contrasena" placeholder="Contraseña" />
        <button @click="crearUsuario"><i class="fas fa-save"></i> Crear Usuario</button>
      </div>

      <div class="box">
        <h2><i class="fas fa-user-tag"></i> Asignar Tutor a Estudiante</h2>
        <label for="estudianteSelect">Seleccionar estudiante:</label>
        <select v-model="seleccion.estudiante" id="estudianteSelect">
          <option v-for="e in estudiantes" :key="e.correo" :value="e.correo">{{ e.nombre }} - {{ e.cedula }}</option>
        </select>

        <label for="tutorSelect">Seleccionar profesor:</label>
        <select v-model="seleccion.profesor" id="tutorSelect">
          <option v-for="p in profesores" :key="p.correo" :value="p.nombre">{{ p.nombre }}</option>
        </select>

        <button @click="asignarTutor"><i class="fas fa-plus-circle"></i> Asignar Tutor</button>
        <button @click="removerTutor"><i class="fas fa-minus-circle"></i> Quitar Tutor</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "AdminView",
  data() {
    return {
      nuevoUsuario: {
        rol: "estudiante",
        nombre: "",
        cedula: "",
        carrera: "",
        semestre: "",
        estado: "",
        correo: "",
        contrasena: ""
      },
      seleccion: {
        estudiante: "",
        profesor: ""
      },
      estudiantes: [],
      profesores: []
    };
  },
  methods: {
    validarSesionAdmin() {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario || usuario.rol !== "administrador") {
        alert("Acceso no autorizado.");
        this.$router.push("/");
      }
    },
    cerrarSesion() {
      localStorage.removeItem("usuario");
      this.$router.push("/");
    },
    cargarUsuarios() {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      this.estudiantes = usuarios.filter(u => u.rol === "estudiante");
      this.profesores = usuarios.filter(u => u.rol === "profesor");
    },
    asignarTutor() {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const indexEstudiante = usuarios.findIndex(u => u.correo === this.seleccion.estudiante);
      if (indexEstudiante < 0) return alert("Estudiante no encontrado.");

      usuarios[indexEstudiante].tutor = this.seleccion.profesor;

      const profesor = usuarios.find(u => u.nombre === this.seleccion.profesor && u.rol === "profesor");
      if (!profesor) return alert("Profesor no encontrado.");

      if (!profesor.estudiantesAsignados.includes(this.seleccion.estudiante)) {
        profesor.estudiantesAsignados.push(this.seleccion.estudiante);
      }

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Tutor asignado correctamente.");
    },

    removerTutor() {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const indexEstudiante = usuarios.findIndex(u => u.correo === this.seleccion.estudiante && u.rol === 'estudiante');
      if (indexEstudiante < 0) {
        alert("Estudiante no encontrado.");
        return;
      }

      const tutorAsignado = usuarios[indexEstudiante].tutor;
      if (!tutorAsignado) {
        alert("El estudiante no tiene tutor asignado.");
        return;
      }

      const profesor = usuarios.find(u => u.nombre === tutorAsignado && u.rol === "profesor");
      if (profesor && profesor.estudiantesAsignados) {
        profesor.estudiantesAsignados = profesor.estudiantesAsignados.filter(correo => correo !== this.seleccion.estudiante);
      }

      usuarios[indexEstudiante].tutor = "";

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Tutor removido correctamente.");
    },

    crearUsuario() {
      const u = this.nuevoUsuario;

      if (u.rol === "estudiante" && !/^\d{10}$/.test(u.cedula)) {
        alert("La cédula debe contener exactamente 10 números.");
        return;
      }

      if (!u.rol || !u.nombre || !u.correo || !u.contrasena) {
        alert("Completa todos los campos obligatorios.");
        return;
      }

      if (u.rol === "profesor" && !u.correo.endsWith("@uleam.edu.ec")) {
        alert("El correo de profesor debe terminar en '@uleam.edu.ec'");
        return;
      }

      if (u.rol === "estudiante" && !u.correo.endsWith("@live.uleam.edu.ec")) {
        alert("El correo de estudiante debe terminar en '@live.uleam.edu.ec'");
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      if (usuarios.some(x => x.correo === u.correo)) {
        alert("Ya existe un usuario con ese correo.");
        return;
      }

      let nuevo = { rol: u.rol, correo: u.correo, contrasena: u.contrasena, nombre: u.nombre };

      if (u.rol === "estudiante") {
        Object.assign(nuevo, {
          cedula: u.cedula,
          carrera: u.carrera,
          semestre: u.semestre,
          estado: u.estado,
          tutor: "",
          tutorias: []
        });
      }

      if (u.rol === "profesor") {
        nuevo.estudiantesAsignados = [];
        nuevo.tutoriasAsignadas = [];
      }

      usuarios.push(nuevo);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("Usuario creado correctamente.");
      this.resetFormulario();
      this.cargarUsuarios();
    },
    resetFormulario() {
      this.nuevoUsuario = {
        rol: "estudiante",
        nombre: "",
        cedula: "",
        carrera: "",
        semestre: "",
        estado: "",
        correo: "",
        contrasena: ""
      };
    },
  },
  mounted() {
    this.validarSesionAdmin();
    this.cargarUsuarios();
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
  background-color: yellowgreen;
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
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
}

.header-buttons {
  display: flex;
  gap: 1em;
}

.btn {
  background-color: orange;
  color: #003366;
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

.btn:hover {
  background-color: #ffae42;
}

main {
  padding: 3em 2em;
  max-width: 1000px;
  margin: auto;
}

.box {
  background: white;
  padding: 2em;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

select, input, button {
  width: 100%;
  margin-top: 0.5em;
  padding: 0.9em;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 1em;
  font-size: 1.1em;
}

button {
  background-color: #17a2b8;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #138496;
}
</style>
