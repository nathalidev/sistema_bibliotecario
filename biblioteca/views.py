from flask import render_template, request, redirect, url_for, jsonify
from main import app
import json
import os
from datetime import datetime

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


# ---------------- ROTAS ----------------

@app.route("/")
def home():
    ano_atual = datetime.now().year
    
    return render_template("index.html", ANO_ATUAL=ano_atual)



@app.route("/api/livros", methods=["GET"])
def listar_livros():
    return jsonify(carregar_livros())


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
