document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmarSenha").value;

  if (senha !== confirmar) return alert("As senhas não conferem!");

  const resp = await fetch("http://localhost:3000/cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha })
  });

  const data = await resp.json();
  alert(data.mensagem || data.erro);
  if (resp.ok) window.location.href = "login.html";
});
