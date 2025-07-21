<template>
  <div>
    <header>
      <div class="header-left">
        <img src="../assets/logo-uleam.png" alt="Logo ULEAM" style="height: 90px"/>
        <h1><i class="fa-solid fa-clock"></i> Tutorías pendientes</h1>
      </div>
      <div class="header-buttons">
        <button class="btn2" @click="$router.push('/profesor')">
          <i class="fas fa-arrow-left"></i> Volver al Panel
        </button>
        <button class="btn2" @click="cerrarSesion">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </header>

    <main>
      <div v-if="tutorias.length === 0" class="sin-tutorias">
        <i class="fas fa-info-circle"></i> No hay tutorías pendientes para revisar.
      </div>

      <div
        v-for="(tutoria, i) in tutorias"
        :key="i"
        :class="['tutoria', { checked: tutoria.revisado, finalizada: tutoria.finalizada }]"
      >
        <p><strong>📌 Estudiante:</strong> {{ tutoria.estudiante }}</p>
        <p><strong>📅 Fecha:</strong> {{ tutoria.fecha }}</p>
        <p><strong>⏰ Hora:</strong> {{ tutoria.hora }}</p>
        <p><strong>📝 Asunto:</strong> {{ tutoria.asunto }}</p>

        <div v-if="tutoria.avance">
          <a class="btn btn-download" :href="tutoria.avance" :download="`avance-${tutoria.estudiante}.pdf`">
            <i class="fas fa-download"></i> Descargar Avance
          </a>
        </div>
        <p v-else>No hay archivo adjunto.</p>

        <div>
          <button
            v-if="!tutoria.revisado"
            class="btn btn-revisar"
            @click="marcarRevisado(i)"
          >
            <i class="fas fa-check-circle"></i> Marcar como Revisado
          </button>
          <button
            v-if="!tutoria.finalizada"
            class="btn btn-finalizar"
            @click="finalizarTutoria(i)"
          >
            <i class="fas fa-check-double"></i> Finalizar Tutoría
          </button>
        </div>

        <p
          v-if="tutoria.revisado && !tutoria.finalizada"
          class="estado revisado"
        >
          ✔ Avance Revisado
        </p>
        <p v-if="tutoria.finalizada" class="estado finalizada">
          ✔ Tutoría Finalizada
        </p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "TutoriasProfesorView",
  data() {
    return {
      usuario: null,
      usuarios: [],
      tutorias: [],
    };
  },
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!this.usuario || this.usuario.rol !== "profesor") {
      alert("Acceso no autorizado.");
      this.$router.push("/");
      return;
    }

    this.cargarTutorias();
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem("usuario");
      this.$router.push("/");
    },
    cargarTutorias() {
      const resultado = [];
      this.usuarios
        .filter(
          (u) => u.rol === "estudiante" && u.tutor === this.usuario.nombre
        )
        .forEach((est) => {
          (est.tutorias || []).forEach((tutoria) => {
            resultado.push({ ...tutoria, estudiante: est.nombre });
          });
        });
      this.tutorias = resultado;
    },
    marcarRevisado(index) {
      const tutoria = this.tutorias[index];
      const estudiante = this.usuarios.find(
        (u) => u.nombre === tutoria.estudiante
      );
      const t = estudiante.tutorias.find(
        (tt) =>
          tt.fecha === tutoria.fecha &&
          tt.hora === tutoria.hora &&
          tt.asunto === tutoria.asunto
      );
      if (t) {
        t.revisado = true;
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
        this.cargarTutorias();
      }
    },
    finalizarTutoria(index) {
      const tutoria = this.tutorias[index];
      const estudiante = this.usuarios.find(
        (u) => u.nombre === tutoria.estudiante
      );
      const t = estudiante.tutorias.find(
        (tt) =>
          tt.fecha === tutoria.fecha &&
          tt.hora === tutoria.hora &&
          tt.asunto === tutoria.asunto
      );
      if (t) {
        t.finalizada = true;
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
        this.cargarTutorias();
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400;500&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

body {
  font-family: "Roboto", sans-serif;
  background: url("https://www.transparenttextures.com/patterns/paper-fibers.png")
    #eef6f8;
  margin: 0;
  font-size: 1.2em;
}

header {
  background-color: #7965c1;
  color: white;
  padding: 1.5em 2.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

header h1 {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 2em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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

.btn2 {
  background-color: #0077cc;
  color: white;
  padding: 0.8em 1.5em;
  border: none;
  font-size: 1.2em;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 1em;
}

.btn2:hover {
  background-color: #005fa3;
}

main {
  padding: 2em;
  max-width: 1100px;
  margin: auto;
}

.tutoria {
  background: white;
  padding: 1.8em;
  margin-bottom: 1.8em;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 7px solid #0077cc;
  transition: transform 0.2s;
}

.tutoria:hover {
  transform: scale(1.01);
}

.tutoria.checked {
  border-left-color: #28a745;
  background-color: #e6f9ec;
}

.tutoria.finalizada {
  border-left-color: #dc3545;
  background-color: #fceaea;
}

.tutoria p {
  margin: 0.6em 0;
  font-size: 1.1em;
}

.estado {
  font-weight: bold;
  margin-top: 1em;
  font-size: 1.1em;
}

.estado.revisado {
  color: #218838;
}

.estado.finalizada {
  color: #c82333;
}

.btn {
  background-color: #0077cc;
  color: white;
  padding: 0.6em 1.4em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 0.6em 0.6em 0 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  font-size: 1em;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}

.btn:hover {
  background-color: #005fa3;
}

.btn-download {
  background-color: #007bff;
}

.btn-revisar {
  background-color: #28a745;
}

.btn-finalizar {
  background-color: #dc3545;
}

.sin-tutorias {
  text-align: center;
  font-size: 1.3em;
  color: #555;
  padding: 2em;
}
</style>
