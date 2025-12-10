let teams = JSON.parse(localStorage.getItem("teams")) || [];
let players = JSON.parse(localStorage.getItem("players")) || [];

const playersContainer = document.getElementById("players");

// Guardar en localStorage
function saveData() {
  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem("players", JSON.stringify(players));
}

// Limpiar inputs
function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("role").value = "";
}

// Renderizar select de equipos
function renderTeamSelect() {
  const selects = [
    document.getElementById("teamSelect"),
    document.getElementById("filterTeam"),
  ];
  selects.forEach((select) => {
    select.innerHTML = '<option value="">Selecciona equipo</option>';
    teams.forEach((team) => {
      const option = document.createElement("option");
      option.value = team;
      option.textContent = team;
      select.appendChild(option);
    });
  });
}

// Renderizar jugadores
function renderPlayers(filter = {}) {
  playersContainer.innerHTML = "";
  let filteredPlayers = players;
  if (filter.team)
    filteredPlayers = filteredPlayers.filter((p) => p.team === filter.team);
  if (filter.role)
    filteredPlayers = filteredPlayers.filter((p) => p.role === filter.role);

  filteredPlayers.forEach((player, index) => {
    const card = document.createElement("div");
    card.className = "col-md-6 mb-3"; // ← ahora dos tarjetas por fila
    card.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${player.name}</h5>
          <p class="card-text"><strong>Edad:</strong> ${player.age}</p>
          <p class="card-text"><strong>Puesto:</strong> ${player.role}</p>
          <p class="card-text"><strong>Equipo:</strong> ${player.team}</p>
          <p class="card-text">${player.description}</p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-warning btn-sm" onclick="editPlayer(${index})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletePlayer(${index})">Eliminar</button>
          </div>
        </div>
      </div>`;
    playersContainer.appendChild(card);
  });
}

// Añadir equipo
document.getElementById("addTeam").addEventListener("click", () => {
  const name = document.getElementById("teamName").value.trim();
  if (!name)
    return Swal.fire(
      "Error",
      "El nombre del equipo no puede estar vacío",
      "error"
    );
  if (teams.includes(name))
    return Swal.fire("Error", "El equipo ya existe", "error");
  teams.push(name);
  saveData();
  renderTeamSelect();
  document.getElementById("teamName").value = "";
  Swal.fire("Éxito", `Equipo ${name} añadido`, "success");
});

// Añadir jugador
document.getElementById("addPlayer").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const role = document.getElementById("role").value;
  const team = document.getElementById("teamSelect").value;

  if (!name || !age || !role || !team) {
    return Swal.fire("Error", "Rellena todos los campos", "error");
  }

  const descriptions = {
    colocador: "Especialista en organizar el juego y colocar el balón.",
    central: "Jugador clave en bloqueo y ataques rápidos.",
    ala: "Atacante y receptor versátil en las bandas.",
    opuesto: "Potente atacante desde zona 2.",
    libero: "Especialista defensivo y en recepción.",
  };

  players.push({ name, age, role, description: descriptions[role], team });
  saveData();
  renderPlayers();
  clearInputs();
  Swal.fire("Éxito", `${name} añadido a ${team}`, "success");
});

// Filtrar jugadores
document.getElementById("filterTeam").addEventListener("change", () => {
  renderPlayers({
    team: document.getElementById("filterTeam").value,
    role: document.getElementById("filterRole").value,
  });
});
document.getElementById("filterRole").addEventListener("change", () => {
  renderPlayers({
    team: document.getElementById("filterTeam").value,
    role: document.getElementById("filterRole").value,
  });
});

// Mostrar jugadores de un equipo
document.getElementById("showTeamPlayers").addEventListener("click", () => {
  const team = document.getElementById("teamSelect").value;
  if (!team) return Swal.fire("Error", "Selecciona un equipo", "error");
  const teamPlayers = players.filter((p) => p.team === team);
  if (teamPlayers.length === 0)
    return Swal.fire("Info", "No hay jugadores en este equipo", "info");

  const html = teamPlayers
    .map((p) => `<p>${p.name} - ${p.role} (${p.age} años)</p>`)
    .join("");
  Swal.fire({ title: `Jugadores de ${team}`, html, width: "600px" });
});

// Eliminar jugador
function deletePlayer(index) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Eliminar a ${players[index].name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      players.splice(index, 1);
      saveData();
      renderPlayers();
      Swal.fire("Eliminado!", "El jugador ha sido eliminado", "success");
    }
  });
}

// Editar jugador
function editPlayer(index) {
  const player = players[index];
  Swal.fire({
    title: "Editar jugador",
    html:
      `<input id="swalName" class="swal2-input" placeholder="Nombre" value="${player.name}">` +
      `<input id="swalAge" class="swal2-input" type="number" placeholder="Edad" value="${player.age}">` +
      `<select id="swalRole" class="swal2-input">
         <option value="">Selecciona puesto</option>
         <option value="colocador">Colocador</option>
         <option value="central">Central</option>
         <option value="ala">Ala</option>
         <option value="opuesto">Opuesto</option>
         <option value="libero">Líbero</option>
       </select>` +
      `<select id="swalTeam" class="swal2-input"></select>`,
    didOpen: () => {
      const roleSelect = document.getElementById("swalRole");
      roleSelect.value = player.role;
      const teamSelect = document.getElementById("swalTeam");
      teams.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        teamSelect.appendChild(opt);
      });
      teamSelect.value = player.team;
    },
    preConfirm: () => {
      const newName = document.getElementById("swalName").value.trim();
      const newAge = document.getElementById("swalAge").value;
      const newRole = document.getElementById("swalRole").value;
      const newTeam = document.getElementById("swalTeam").value;
      if (!newName || !newAge || !newRole || !newTeam)
        Swal.showValidationMessage("Rellena todos los campos");
      return { newName, newAge, newRole, newTeam };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const desc = {
        colocador: "Especialista en organizar el juego y colocar el balón.",
        central: "Jugador clave en bloqueo y ataques rápidos.",
        ala: "Atacante y receptor versátil en las bandas.",
        opuesto: "Potente atacante desde zona 2.",
        libero: "Especialista defensivo y en recepción.",
      };
      player.name = result.value.newName;
      player.age = result.value.newAge;
      player.role = result.value.newRole;
      player.team = result.value.newTeam;
      player.description = desc[player.role];
      saveData();
      renderPlayers();
      Swal.fire(
        "Actualizado",
        `${player.name} actualizado correctamente`,
        "success"
      );
    }
  });
}

// Inicializar
renderTeamSelect();
renderPlayers();
