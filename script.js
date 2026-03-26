const menuButtons = document.querySelectorAll(".menu-btn");
const pages = document.querySelectorAll(".page");

const formCadastro = document.getElementById("formCadastro");
const formSolicitacao = document.getElementById("formSolicitacao");

const listaUsuarios = document.getElementById("listaUsuarios");
const listaSolicitacoes = document.getElementById("listaSolicitacoes");
const usuarioSolicitacao = document.getElementById("usuarioSolicitacao");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
let usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual")) || null;

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    menuButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const target = button.dataset.target;
    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    if (target === "perfil") mostrarPerfil();
  });
});

formCadastro.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoUsuario = {
    id: Date.now(),
    nome: document.getElementById("nomeCadastro").value,
    email: document.getElementById("emailCadastro").value,
    matricula: document.getElementById("matriculaCadastro").value,
    tipo: document.getElementById("tipoCadastro").value
  };

  usuarios.push(novoUsuario);
  usuarioAtual = novoUsuario;

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual));

  formCadastro.reset();
  renderUsuarios();
  atualizarSelectUsuarios();
  mostrarPerfil();

  alert("Usuário cadastrado!");
});

formSolicitacao.addEventListener("submit", (e) => {
  e.preventDefault();

  const usuarioId = Number(usuarioSolicitacao.value);
  const usuario = usuarios.find(u => u.id === usuarioId);

  if (!usuario) {
    alert("Selecione um usuário.");
    return;
  }

 const novaSolicitacao = {
  id: Date.now(),
  usuario: usuario.nome,
  tipo: document.getElementById("tipoSolicitacao").value,
  descricao: document.getElementById("descricaoSolicitacao").value,
  status: "Pendente"
};

  solicitacoes.push(novaSolicitacao);
  localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));

  formSolicitacao.reset();
  renderSolicitacoes();

  alert("Solicitação registrada!");
});

function renderUsuarios() {
  if (usuarios.length === 0) {
    listaUsuarios.innerHTML = `<p class="empty">Nenhum usuário cadastrado.</p>`;
    return;
  }

  listaUsuarios.innerHTML = usuarios.map(usuario => `
    <div class="item">
      <strong>${usuario.nome}</strong>
      <span>${usuario.email}</span><br>
      <span>Matrícula: ${usuario.matricula}</span><br>
      <span>Tipo: ${usuario.tipo}</span>
    </div>
  `).join("");
}

function atualizarSelectUsuarios() {
  usuarioSolicitacao.innerHTML = `
    <option value="">Selecione</option>
    ${usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join("")}
  `;
}

function renderSolicitacoes() {
  if (solicitacoes.length === 0) {
    listaSolicitacoes.innerHTML = `<p class="empty">Nenhuma solicitação.</p>`;
    return;
  }

  listaSolicitacoes.innerHTML = solicitacoes.map(s => `
    <div class="item">
      <strong>${s.usuario}</strong>
      <span>Tipo: ${s.tipo}</span><br>
      <span>${s.descricao}</span><br>
      <span>Status: <b>${s.status}</b></span><br><br>

      <button onclick="mudarStatus(${s.id}, 'Pendente')">🟡</button>
      <button onclick="mudarStatus(${s.id}, 'Em análise')">🔵</button>
      <button onclick="mudarStatus(${s.id}, 'Concluída')">🟢</button>
    </div>
  `).join("");
}

function mostrarPerfil() {
  if (!usuarioAtual) return;

  document.getElementById("perfilNomeTitulo").textContent = usuarioAtual.nome;
  document.getElementById("perfilTipoTitulo").textContent = usuarioAtual.tipo;

  document.getElementById("perfilNome").value = usuarioAtual.nome;
  document.getElementById("perfilEmail").value = usuarioAtual.email;
  document.getElementById("perfilMatricula").value = usuarioAtual.matricula;
  document.getElementById("perfilTipo").value = usuarioAtual.tipo;
}
function resetarDados() {
  if (confirm("Tem certeza que quer apagar tudo?")) {
    localStorage.clear();
    location.reload();
  }
}

// BLOQUEAR EDIÇÃO (somente visualização)
document.querySelectorAll("#perfil input, #perfil select").forEach(el => {
  el.setAttribute("readonly", true);
  el.setAttribute("disabled", true);
});
function mudarStatus(id, novoStatus) {
  solicitacoes = solicitacoes.map(s => {
    if (s.id === id) {
      s.status = novoStatus;
    }
    return s;
  });

  localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
  renderSolicitacoes();
}

renderUsuarios();
renderSolicitacoes();
atualizarSelectUsuarios();
mostrarPerfil();
//localStorage.clear();
