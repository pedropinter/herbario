document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const resp = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await resp.json();

    if (resp.ok) {
      alert("Login realizado com sucesso!");
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert(data.erro || "Erro ao realizar login.");
    }
  } catch (error) {
    console.error("Erro no fetch:", error);
    alert("Erro de conexão com o servidor.");
  }
});
