// Enviar formulário via POST
document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nome", document.getElementById("nome").value);
  formData.append("cientifico", document.getElementById("cientifico").value);
  formData.append("familia", document.getElementById("familia").value);
  formData.append("origem", document.getElementById("origem").value);
  formData.append("usos", document.getElementById("usos").value);
  formData.append("principios", document.getElementById("principios").value);
  formData.append("parte", document.getElementById("parte").value);
  formData.append("preparo", document.getElementById("preparo").value);
  formData.append("contra", document.getElementById("contra").value);
  
  const imagem = document.getElementById("imagem").files[0];
  if (imagem) formData.append("imagem", imagem);

  try {
    const resp = await fetch("http://localhost:3000/plantas", {
      method: "POST",
      body: formData
    });

    const data = await resp.json();

    if (resp.ok) {
      alert("Planta cadastrada: " + data.nome);
      carregarPlantas();
      document.getElementById("formCadastro").reset();
    } else {
      alert(data.erro || "Erro ao cadastrar planta");
    }
  } catch (err) {
    console.error("Erro no fetch:", err);
    alert("Erro ao enviar dados ao servidor.");
  }
});


async function carregarPlantas() {
    try {
      const res = await fetch(`http://localhost:3000/plantas`);
      if (!res.ok) throw new Error("Erro ao carregar plantas");
  
      const plantas = await res.json();
      const row = document.querySelector(".container .row");
      if (!row) return console.error("Elemento .container .row não encontrado");
  
      row.innerHTML = "";
  
      plantas.forEach(planta => {
        const col = document.createElement("div");
        col.classList.add("col-md-3", "mb-3");
  
        const imagem = planta.imagem || "https://img.freepik.com/fotos-premium/prado-de-grama-verde-generico-no-dia-de-verao-com-ceu-azul-com-nuvens-brancas_636705-6721.jpg";
  
        col.innerHTML = `
          <div class="card h-100" style="font-size: 0.9rem;">
            <img class="card-img-top" src="${imagem}" alt="Imagem da planta" style="height: 150px; width: 100%; object-fit: cover;">
            <div class="card-body p-2">
              <h5 class="card-title fw-bold" style="font-size: 1rem;">${planta.nome}</h5>
              <p class="card-text mb-2" style="font-size: 0.85rem;">
                <strong>Família:</strong> ${planta.familia}<br>
                <strong>Origem:</strong> ${planta.origem}<br>
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-success btn-mais btn-sm" data-id="${planta.id}">
                    Mais Informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        row.appendChild(col);
      });
  
      // Listeners dos botões "Mais Informações"
      document.querySelectorAll(".btn-mais").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          try {
            const planta = plantas.find(p => p.id == id);
            if (!planta) return alert("Planta não encontrada");
  
            document.getElementById("modalTitulo").innerText = planta.nome;
            document.getElementById("modalCorpo").innerHTML = `
              <p><strong>Nome científico:</strong> ${planta.cientifico}</p>
              <p><strong>Família:</strong> ${planta.familia}</p>
              <p><strong>Origem:</strong> ${planta.origem}</p>
              <p><strong>Usos medicinais:</strong> ${planta.usos}</p>
              <p><strong>Princípios ativos:</strong> ${planta.principios}</p>
              <p><strong>Parte utilizada:</strong> ${planta.parte}</p>
              <p><strong>Modo de preparo:</strong> ${planta.preparo}</p>
              <p><strong>Contraindicações:</strong> ${planta.contra}</p>
            `;
  
            // Aqui você pode adicionar ações extras no botão
            const botao = document.getElementById("modalBotaoAcao");
            botao.innerText = "Fechar";
            botao.classList.remove("btn-success", "btn-danger");
            botao.classList.add("btn-secondary");
            botao.onclick = () => {
              bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
            };
  
            new bootstrap.Modal(document.getElementById("modalEvento")).show();
          } catch (err) {
            console.error(err);
            alert("Erro ao carregar informações da planta.");
          }
        });
      });
  
    } catch (err) {
      console.error("Erro ao carregar plantas:", err);
    }
  }
  
  carregarPlantas();
  
  
  function rolarPara(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth" });
    }
  }