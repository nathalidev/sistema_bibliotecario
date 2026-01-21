from flask import render_template, request, redirect, url_for, jsonify, send_file
from main import app
import json
import os
from datetime import datetime
from fpdf import FPDF
from io import BytesIO

ARQUIVO = "livros.json"
ANO_ATUAL = datetime.now().year
STATUS_VALIDOS = ["lido", "leitura_em_andamento", "leitura_nao_iniciada", "nao_lido"]


def carregar_livros():
    if not os.path.exists(ARQUIVO):
        return []
    with open(ARQUIVO, "r", encoding="utf-8") as f:
        return json.load(f)


def salvar_livros(livros):
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(livros, f, indent=4, ensure_ascii=False)

def formatar_status(status):
    """Formata o status para exibição"""
    mapa = {
        "lido": "Lido",
        "leitura_em_andamento": "Leitura em andamento",
        "leitura_nao_iniciada": "Leitura nao iniciada",
        "nao_lido": "Nao lido"
    }
    return mapa.get(status, status)

def gerar_pdf_livros(livros):
    """Gera um PDF com a lista de livros"""
    pdf = FPDF()
    pdf.add_page()
    
    # Configurar fonte
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Meus Livros", ln=True, align="C")
    
    pdf.set_font("Arial", "", 10)
    pdf.ln(5)
    
    # Cabeçalhos da tabela
    pdf.set_font("Arial", "B", 10)
    pdf.cell(60, 8, "Titulo", border=1)
    pdf.cell(40, 8, "Autor", border=1)
    pdf.cell(50, 8, "Status", border=1)
    pdf.cell(30, 8, "Ano", border=1, ln=True)
    
    # Conteúdo da tabela
    pdf.set_font("Arial", "", 9)
    for livro in livros:
        status_formatado = formatar_status(livro.get("status", ""))
        pdf.cell(60, 8, livro.get("titulo", "")[:50], border=1)
        pdf.cell(40, 8, livro.get("autor", "")[:50], border=1)
        pdf.cell(50, 8, status_formatado[:50], border=1)
        pdf.cell(30, 8, str(livro.get("ano", "")), border=1, ln=True)
    
    return pdf

def exportar_livros_pdf():
    livros = carregar_livros()
    pdf = gerar_pdf_livros(livros)
    
    # Gerar PDF em memória (retorna bytes)
    pdf_output = pdf.output(dest='S').encode('latin-1')
    pdf_bytes = BytesIO(pdf_output)
    pdf_bytes.seek(0)
    
    # Retornar o arquivo para download
    return send_file(
        pdf_bytes,
        mimetype='application/pdf',
        as_attachment=True,
        download_name='meus_livros.pdf'
    )



# ---------------- ROTAS ----------------

@app.route("/")
def home():
    ano_atual = datetime.now().year
    
    return render_template("index.html", ANO_ATUAL=ano_atual)

@app.route("/api/livros", methods=["GET"])
def listar_livros():
    return jsonify(carregar_livros())

@app.route("/api/exportar-pdf", methods=["GET"])
def exportar_pdf():
    return exportar_livros_pdf()

@app.route("/api/livros", methods=["POST"])
def cadastrar_livro():
    dados = request.json

    # Validações
    if int(dados["ano"]) > ANO_ATUAL:
        return {"erro": "Ano inválido"}, 400
    
    if dados.get("status") not in STATUS_VALIDOS:
        return {"erro": "Status inválido"}, 400

    livros = carregar_livros()

    ids_existentes = [livro.get("id", 0) for livro in livros]

    maior_id = max(ids_existentes) if ids_existentes else 0

    novo_id = maior_id + 1

    livros.append({
        "id": novo_id,
        "titulo": dados["titulo"],
        "autor": dados["autor"],
        "ano": int(dados["ano"]),
        "genero": dados["genero"],
        "status": dados["status"]
    })

    salvar_livros(livros)
    return {"status": "Livro cadastrado com sucesso", "id": novo_id}, 201

@app.route("/api/livros/<int:id>", methods=["GET"])
def buscar_livro(id):
    livros = carregar_livros()
    for livro in livros:
        if livro.get("id") == id:
            return jsonify(livro)

    return {"erro": "Livro não encontrado"}, 404

@app.route("/api/livros/<int:id>", methods=["PUT"])
def atualizar_livro(id):
    dados = request.json
    livros = carregar_livros()

    for livro in livros:
        if livro.get("id") == id:
            livro["titulo"] = dados.get("titulo", livro["titulo"])
            livro["autor"] = dados.get("autor", livro["autor"])
            livro["ano"] = int(dados.get("ano", livro["ano"]))
            livro["genero"] = dados.get("genero", livro["genero"])
            livro["status"] = dados.get("status", livro["status"])
            salvar_livros(livros)
            return {"status": "Livro atualizado com sucesso"}, 200

    return {"erro": "Livro não encontrado"}, 404

@app.route("/api/livros/<int:id>", methods=["DELETE"])
def deletar_livro(id):
    livros = carregar_livros()
    for i, livro in enumerate(livros):
        if livro.get("id") == id:
            del livros[i]
            salvar_livros(livros)
            return {"status": "Livro deletado com sucesso"}, 200

    return {"erro": "Livro não encontrado"}, 404
