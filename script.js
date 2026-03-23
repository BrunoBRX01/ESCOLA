let usuarios = [];
let solicitacoes = [];

function mostrarTela(id) {
    const telas = document.querySelectorAll(".tela");
    telas.forEach(tela => tela.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");
}

const formUsuario = document.getElementById("formUsuario");
const formSolicitacao = document.getElementById("formSolicitacao");
const listaUsuarios = document.getElementById("listaUsuarios");
const listaSolicitacoes = document.getElementById("listaSolicitacoes");
const selectUsuarioSolicitacao = document.getElementById("usuarioSolicitacao");

formUsuario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    const matricula = document.getElementById("matriculaUsuario").value.trim();
    const tipo = document.getElementById("tipoUsuario").value;

    const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        matricula,
        tipo
    };

    usuarios.push(novoUsuario);
    renderizarUsuarios();
    atualizarSelectUsuarios();
    atualizarResumo();
    formUsuario.reset();
});

formSolicitacao.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.getElementById("tituloSolicitacao").value.trim();
    const descricao = document.getElementById("descricaoSolicitacao").value.trim();
    const usuario = document.getElementById("usuarioSolicitacao").value;
    const tipo = document.getElementById("tipoSolicitacao").value;
    const status = document.getElementById("statusSolicitacao").value;

    const novaSolicitacao = {
        id: Date.now(),
        titulo,
        descricao,
        usuario,
        tipo,
        status
    };

    solicitacoes.push(novaSolicitacao);
    renderizarSolicitacoes();
    atualizarResumo();
    formSolicitacao.reset();
});

function renderizarUsuarios() {
    listaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
        listaUsuarios.innerHTML = `<div class="vazio">Nenhum usuário cadastrado.</div>`;
        return;
    }

    usuarios.forEach(usuario => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h4>${usuario.nome}</h4>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Matrícula:</strong> ${usuario.matricula}</p>
            <p><strong>Tipo:</strong> ${usuario.tipo}</p>
        `;
        listaUsuarios.appendChild(div);
    });
}

function atualizarSelectUsuarios() {
    selectUsuarioSolicitacao.innerHTML = `<option value="">Selecione o usuário</option>`;

    usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.nome;
        option.textContent = usuario.nome;
        selectUsuarioSolicitacao.appendChild(option);
    });
}

function classeStatus(status) {
    if (status === "Pendente") return "pendente";
    if (status === "Em análise") return "analise";
    return "concluida";
}

function renderizarSolicitacoes() {
    listaSolicitacoes.innerHTML = "";

    if (solicitacoes.length === 0) {
        listaSolicitacoes.innerHTML = `<div class="vazio">Nenhuma solicitação cadastrada.</div>`;
        return;
    }

    solicitacoes.forEach(solicitacao => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h4>${solicitacao.titulo}</h4>
            <p><strong>Usuário:</strong> ${solicitacao.usuario}</p>
            <p><strong>Tipo:</strong> ${solicitacao.tipo}</p>
            <p><strong>Descrição:</strong> ${solicitacao.descricao}</p>
            <p><strong>Status:</strong> 
                <span class="status ${classeStatus(solicitacao.status)}" id="status-${solicitacao.id}">
                    ${solicitacao.status}
                </span>
            </p>

            <select onchange="alterarStatus(${solicitacao.id}, this.value)">
                <option value="Pendente" ${solicitacao.status === "Pendente" ? "selected" : ""}>Pendente</option>
                <option value="Em análise" ${solicitacao.status === "Em análise" ? "selected" : ""}>Em análise</option>
                <option value="Concluída" ${solicitacao.status === "Concluída" ? "selected" : ""}>Concluída</option>
            </select>
        `;

        listaSolicitacoes.appendChild(div);
    });
}

function alterarStatus(id, novoStatus) {
    const solicitacao = solicitacoes.find(s => s.id === id);

    if (solicitacao) {
        solicitacao.status = novoStatus;
        renderizarSolicitacoes();
        atualizarResumo();
    }
}

function atualizarResumo() {
    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalSolicitacoes").textContent = solicitacoes.length;
    document.getElementById("totalPendentes").textContent =
        solicitacoes.filter(s => s.status === "Pendente").length;
    document.getElementById("totalConcluidas").textContent =
        solicitacoes.filter(s => s.status === "Concluída").length;
}