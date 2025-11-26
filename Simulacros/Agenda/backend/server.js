const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "agenda",
  password: "chile",
  port: 5432,
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  // Obtener todos los contactos
  if (req.url === "/contactos" && req.method === "GET") {
    const result = await pool.query("SELECT * FROM contactos ORDER BY id DESC");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.rows));
  }

  // Crear contacto
  else if (req.url === "/contactos" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const data = JSON.parse(body);
      const query = `
        INSERT INTO contactos (nombre, apellidos, telefono, empresa, puesto, email, linkedin)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
      `;
      await pool.query(query, [
        data.nombre,
        data.apellidos,
        data.telefono,
        data.empresa,
        data.puesto,
        data.email,
        data.linkedin,
      ]);

      res.writeHead(201);
      res.end("OK");
    });
  }

  // Editar contacto
  else if (req.url.startsWith("/contactos/") && req.method === "PUT") {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const data = JSON.parse(body);
      const query = `
        UPDATE contactos
        SET nombre=$1, apellidos=$2, telefono=$3, empresa=$4, puesto=$5, email=$6, linkedin=$7
        WHERE id=$8
      `;
      await pool.query(query, [
        data.nombre,
        data.apellidos,
        data.telefono,
        data.empresa,
        data.puesto,
        data.email,
        data.linkedin,
        id,
      ]);

      res.writeHead(200);
      res.end("OK");
    });
  }

  // Eliminar contacto
  else if (req.url.startsWith("/contactos/") && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    await pool.query("DELETE FROM contactos WHERE id=$1", [id]);
    res.writeHead(200);
    res.end("OK");
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () =>
  console.log("Servidor escuchando en http://localhost:3000")
);
