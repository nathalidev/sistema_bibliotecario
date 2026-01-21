// ===== VARIÁVEIS GLOBAIS =====
const API_URL = "/api/livros";
const statusValidos = ["lido", "leitura_em_andamento", "leitura_nao_iniciada", "nao_lido"];

// ===== MAPA DE GÊNEROS =====
const GENEROS_MAPA = {
    "acao": "Ação",
    "aventura": "Aventura",
    "ficcao": "Ficção",
    "ficcao_cientifica": "Ficção Científica",
    "fantasia": "Fantasia",
    "fantasia_urbana": "Fantasia Urbana",
    "distopia": "Distopia",
    "romance": "Romance",
    "romance_contemporaneo": "Romance Contemporâneo",
    "romance_historico": "Romance Histórico",
    "romance_fantasia": "Romance Fantástico",
    "drama": "Drama",
    "suspense": "Suspense",
    "thriller": "Thriller",
    "misterio": "Mistério",
    "policial": "Policial",
    "terror": "Terror",
    "horror_psicologico": "Horror Psicológico",
    "biografia": "Biografia",
    "autobiografia": "Autobiografia",
    "memorias": "Memórias",
    "historia": "História",
    "historia_ficcional": "Ficção Histórica",
    "filosofia": "Filosofia",
    "sociologia": "Sociologia",
    "politica": "Política",
    "ciencia": "Ciência",
    "divulgacao_cientifica": "Divulgação Científica",
    "tecnologia": "Tecnologia",
    "computacao": "Computação",
    "inteligencia_artificial": "Inteligência Artificial",
    "autoajuda": "Autoajuda",
    "desenvolvimento_pessoal": "Desenvolvimento Pessoal",
    "psicologia": "Psicologia",
    "espiritualidade": "Espiritualidade",
    "religioso": "Religioso",
    "poesia": "Poesia",
    "contos": "Contos",
    "cronicas": "Crônicas",
    "ensaios": "Ensaios",
    "infantil": "Infantil",
    "juvenil": "Juvenil",
    "young_adult": "Young Adult (YA)",
    "educacao": "Educação",
    "didatico": "Didático",
    "academico": "Acadêmico",
    "negocios": "Negócios",
    "empreendedorismo": "Empreendedorismo",
    "economia": "Economia",
    "financas": "Finanças",
    "marketing": "Marketing",
    "direito": "Direito",
    "saude": "Saúde",
    "medicina": "Medicina",
    "gastronomia": "Gastronomia",
    "culinaria": "Culinária",
    "viagem": "Viagem",
    "turismo": "Turismo",
    "arte": "Arte",
    "fotografia": "Fotografia",
    "design": "Design",
    "arquitetura": "Arquitetura",
    "musica": "Música",
    "cinema": "Cinema",
    "quadrinhos": "Quadrinhos",
    "graphic_novel": "Graphic Novel",
    "manga": "Mangá",
    "humor": "Humor",
    "esportes": "Esportes",
    "jogos": "Jogos",
    "outros": "Outros"
};

// ===== FUNÇÃO: Carregar todos os livros =====
async function carregarLivros() {
    try {
        const resposta = await fetch(API_URL);
        const livros = await resposta.json();
        atualizarTabela(livros);
    } catch (erro) {
        alert("Erro ao carregar os livros!");
    }
}

// ===== FUNÇÃO: Atualizar a tabela HTML =====
function atualizarTabela(livros) {
    const tabela = document.querySelector("table tbody");
    
    // Limpar TODA a tabela (tbody não tem header)
    tabela.innerHTML = "";

    // Adicionar cada livro na tabela
    livros.forEach(livro => {
        const status = formatarStatus(livro.status);
        const genero = formatarGenero(livro.genero);
        const linha = `
            <tr>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.ano}</td>
                <td>${genero}</td>
                <td>${status}</td>
                <td>
                    <button onclick="abrirEdicao(${livro.id})" class="btn-editar">Editar</button>
                    <button onclick="deletarLivro(${livro.id})" class="btn-deletar">Deletar</button>
                </td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

// ===== FUNÇÃO: Formatar gênero para exibição =====
function formatarGenero(genero) {
    return GENEROS_MAPA[genero] || genero;
}

// ===== FUNÇÃO: Formatar status para exibição =====
function formatarStatus(status) {
    const mapa = {
        "lido": "Lido",
        "leitura_em_andamento": "Leitura em andamento",
        "leitura_nao_iniciada": "Leitura não iniciada",
        "nao_lido": "Não lido"
    };
    return mapa[status] || "-";
}

// ===== FUNÇÃO: Cadastrar novo livro =====
async function cadastrarLivro(evento) {
    evento.preventDefault(); // Impede recarregar a página

    // Pegar valores do formulário
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano = document.getElementById("ano").value;
    const genero = document.getElementById("genero").value;
    const status = document.getElementById("status_leitura").value;

    // Validações no frontend
    if (!titulo || !autor || !ano || !genero || !status) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    if (status && !statusValidos.includes(status)) {
        alert("Status inválido!");
        return;
    }

    // Preparar dados para enviar
    const dados = {
        titulo: titulo,
        autor: autor,
        ano: parseInt(ano),
        genero: genero,
        status: status
    };

    try {
        // Enviar para o backend
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Livro cadastrado com sucesso!");
            
            // Limpar formulário
            document.querySelector("form").reset();
            
            // Recarregar tabela
            carregarLivros();
        } else {
            alert(`Erro: ${resultado.erro}`);
        }
    } catch (erro) {
        alert("Erro ao cadastrar o livro!");
    }
}

// ===== FUNÇÃO: Buscar livro por título =====
async function buscarLivro(evento) {
    evento.preventDefault();

    const metodo = document.getElementById("metodo_de_busca").value;
    
    if (!metodo) {
        alert("Selecione um filtro de busca!");
        return;
    }

    let valorBusca = "";
    
    if (metodo === "titulo") {
        valorBusca = document.getElementById("titulo_busca").value.trim();
    } else if (metodo === "autor") {
        valorBusca = document.getElementById("autor_busca").value.trim();
    } else if (metodo === "ano") {
        valorBusca = document.getElementById("ano_busca").value.trim();
    } else if (metodo === "genero") {
        valorBusca = document.getElementById("genero_busca").value;
    } else if (metodo === "status_leitura") {
        valorBusca = document.getElementById("status_busca").value;
    }

    if (!valorBusca) {
        alert("Preencha o campo de busca!");
        return;
    }

    try {
        const resposta = await fetch(API_URL);
        const livros = await resposta.json();
        let livrosFiltrados = [];

        if (metodo === "titulo") {
            livrosFiltrados = livros.filter(livro =>
                livro.titulo.toLowerCase().includes(valorBusca.toLowerCase())
            );
        } else if (metodo === "autor") {
            livrosFiltrados = livros.filter(livro =>
                livro.autor.toLowerCase().includes(valorBusca.toLowerCase())
            );
        } else if (metodo === "ano") {
            livrosFiltrados = livros.filter(livro =>
                String(livro.ano) === valorBusca
            );
        } else if (metodo === "genero") {
            livrosFiltrados = livros.filter(livro =>
                livro.genero === valorBusca
            );
        } else if (metodo === "status_leitura") {
            livrosFiltrados = livros.filter(livro =>
                livro.status === valorBusca
            );
        }

        if (livrosFiltrados.length > 0) {
            atualizarTabela(livrosFiltrados);
        } else {
            alert("Nenhum livro encontrado com esse filtro!");
            atualizarTabela([]);
        }
    } catch (erro) {
        alert("Erro ao buscar o livro!");
    }
}

async function listarTodosLivros() {
    carregarLivros();
}

// ===== FUNÇÃO: Exportar livros para PDF =====
async function exportarPDF() {
    try {
        const resposta = await fetch("/api/exportar-pdf");

        if (resposta.ok) {
            // Converter resposta em blob (arquivo)
            const blob = await resposta.blob();
            
            // Criar um URL temporário para o arquivo
            const url = window.URL.createObjectURL(blob);
            
            // Criar um link e simular clique para download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'meus_livros.pdf';
            document.body.appendChild(link);
            link.click();
            
            // Limpar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert("PDF baixado com sucesso!");
        } else {
            alert("Erro ao exportar PDF!");
        }
    } catch (erro) {
        alert(`Erro ao exportar PDF!\n${erro.message}`);
    }
}

async function abrirEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        const livro = await resposta.json();

        // Preencher formulário com dados atuais
        document.getElementById("titulo").value = livro.titulo;
        document.getElementById("autor").value = livro.autor;
        document.getElementById("ano").value = livro.ano;
        document.getElementById("genero").value = livro.genero;
        document.getElementById("status_leitura").value = livro.status;

        // Adicionar atributo ao formulário para saber que está editando
        const formulario = document.getElementById("livrosForm");
        formulario.dataset.editandoId = id;
        
        // Mudar texto do botão
        const botao = formulario.querySelector("button[type='submit']");
        botao.textContent = "Atualizar Livro";

    } catch (erro) {
        alert("Erro ao abrir edição!");
    }
}

// ===== FUNÇÃO: Deletar livro =====
async function deletarLivro(id) {
    if (!confirm("Tem certeza que deseja deletar este livro?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Livro deletado com sucesso!");
            carregarLivros();
        } else {
            alert(`Erro: ${resultado.erro}`);
        }
    } catch (erro) {
        alert("Erro ao deletar o livro!");
    }
}

// ===== FUNÇÃO: Atualizar livro (edição) =====
async function atualizarLivro(id, dados) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Livro atualizado com sucesso!");
            
            // Limpar formulário e remover atributo de edição
            const formulario = document.getElementById("livrosForm");
            formulario.reset();
            delete formulario.dataset.editandoId;
            
            // Restaurar texto do botão
            const botao = formulario.querySelector("button[type='submit']");
            botao.textContent = "Cadastrar";
            
            // Recarregar tabela
            carregarLivros();
        } else {
            alert(`Erro: ${resultado.erro}`);
        }
    } catch (erro) {
        alert("Erro ao atualizar o livro!");
    }
}

// Função para mostrar/esconder campos de filtro conforme método selecionado
function atualizarCamposFiltro() {
    const metodo = document.getElementById("metodo_de_busca").value;
    // Esconde todos os campos e botões
    document.getElementById("campo_titulo").style.display = "none";
    document.getElementById("campo_autor").style.display = "none";
    document.getElementById("campo_ano").style.display = "none";
    document.getElementById("campo_genero").style.display = "none";
    document.getElementById("campo_status").style.display = "none";
    document.getElementById("btnPesquisar").style.display = "none";
    document.getElementById("btnListarTodos").style.display = "none";

    valor_busca = ""; // Limpa o valor do campo de busca

    // Mostra o campo correspondente e os botões se algum filtro for selecionado
    if (metodo === "titulo") {
        valor_busca = document.getElementById("titulo_busca").value.trim();
        document.getElementById("campo_titulo").style.display = "block";
        document.getElementById("btnPesquisar").style.display = "inline-block";
        document.getElementById("btnListarTodos").style.display = "inline-block";
    } else if (metodo === "autor") {
        valor_busca = document.getElementById("autor_busca").value.trim();
        document.getElementById("campo_autor").style.display = "block";
        document.getElementById("btnPesquisar").style.display = "inline-block";
        document.getElementById("btnListarTodos").style.display = "inline-block";
    } else if (metodo === "ano") {
        valor_busca = document.getElementById("ano_busca").value.trim();
        document.getElementById("campo_ano").style.display = "block";
        document.getElementById("btnPesquisar").style.display = "inline-block";
        document.getElementById("btnListarTodos").style.display = "inline-block";
    } else if (metodo === "genero") {
        valor_busca = document.getElementById("genero_busca").value.trim();
        document.getElementById("campo_genero").style.display = "block";
        document.getElementById("btnPesquisar").style.display = "inline-block";
        document.getElementById("btnListarTodos").style.display = "inline-block";
    } else if (metodo === "status_leitura") {
        valor_busca = document.getElementById("status_busca").value.trim();
        document.getElementById("campo_status").style.display = "block";
        document.getElementById("btnPesquisar").style.display = "inline-block";
        document.getElementById("btnListarTodos").style.display = "inline-block";
    }

    // O .value.trim()pega o valor de um campo de formulário e remove espaços em branco do início e do fim do texto digitado pelo usuário.

    return valor_busca;
}
// ===== MODIFICAR FORMULÁRIO DE CADASTRO =====
document.addEventListener("DOMContentLoaded", function() {
    // Pegar o formulário de cadastro pelo ID específico
    const formulario = document.getElementById("livrosForm");
    
    // Modificar o comportamento do submit
    formulario.onsubmit = function(evento) {
        evento.preventDefault();

        // Verificar se está editando
        const idEditando = this.dataset.editandoId;


        if (idEditando) {
            // Está editando um livro
            
            const titulo = document.getElementById("titulo").value.trim();
            const autor = document.getElementById("autor").value.trim();
            const ano = document.getElementById("ano").value;
            const genero = document.getElementById("genero").value;
            const status = document.getElementById("status_leitura").value;

            if (!titulo || !autor || !ano || !genero || !status) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const dados = {
                titulo: titulo,
                autor: autor,
                ano: parseInt(ano),
                genero: genero,
                status: status
            };

            atualizarLivro(parseInt(idEditando), dados);
        } else {
            // Está cadastrando um novo livro
            cadastrarLivro(evento);
        }
    };

    // Carregar livros quando a página inicia
    carregarLivros();


    // Adicionar evento ao select de filtro
    const selectMetodo = document.getElementById("metodo_de_busca");
    if (selectMetodo) {
        selectMetodo.addEventListener("change", atualizarCamposFiltro);
        atualizarCamposFiltro(); // Chama uma vez para garantir que o campo inicial apareça
    }

    // Adicionar evento ao formulário de busca
    const formularioBusca = document.querySelectorAll("form")[1];
    if (formularioBusca) {
        formularioBusca.onsubmit = buscarLivro;
    }

    // Adicionar evento ao botão "Listar Todos"
    const btnListarTodos = document.getElementById("btnListarTodos");
    if (btnListarTodos) {
        btnListarTodos.addEventListener("click", carregarLivros);
    }

    // Adicionar evento ao botão "Exportar PDF"
    const btnExportarPDF = document.getElementById("btnExportarPDF");
    if (btnExportarPDF) {
        btnExportarPDF.addEventListener("click", exportarPDF);
    }
});

// ===== FUNÇÃO: Filtrar livros =====
function filtrarLivros(metodo) {
    const valorBusca = atualizarCamposFiltro();
    let livrosFiltrados = [];
    if (metodo === "titulo") {
        livrosFiltrados = livros.filter(livro =>
            livro.titulo.toLowerCase().includes(valorBusca.toLowerCase())
        );
    } else if (metodo === "autor") {
        livrosFiltrados = livros.filter(livro =>
            livro.autor.toLowerCase().includes(valorBusca.toLowerCase())
        );
    } else if (metodo === "ano") {
        livrosFiltrados = livros.filter(livro =>
            String(livro.ano) === valorBusca
        );
    } else if (metodo === "genero") {
        livrosFiltrados = livros.filter(livro =>
            livro.genero === valorBusca
        );
    } else if (metodo === "status_leitura") {
        livrosFiltrados = livros.filter(livro =>
            livro.status === valorBusca
        );
    }

    atualizarTabela(livrosFiltrados);
}

