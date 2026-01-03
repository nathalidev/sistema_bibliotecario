from flask import Flask
from time import sleep
from datetime import datetime
import json
import os
from views import *

app = Flask(__name__)

#rotas
@app.route("/")
def home():
    return 

if os.path.exists("livros.json"):
    with open("livros.json", "r", encoding="utf-8") as f:
        lista_livros = json.load(f)

ano_atual = datetime.now().year

print("Inicializando...")
sleep(2)

titulo_do_sistema = "="*6+"Biblioteca Virtual"+"="*6
print("\n"+titulo_do_sistema.center(150)+"\n") #titulo centralizado com o center(), \n buga tudo se estiver dentro da variavel do titulo

sleep(2)

while True:
    try:
        opcao_selecionada = int(input("Selecione a opção:\n1-Cadastro de livro\n2-Ver livros cadastrados\n3-Buscar livro\n4-Alterar informações de registro:\n0-Sair\nResposta: "))
        
        if opcao_selecionada == 1: 
            
            titulo_do_livro = input("\nQual o título do livro que você deseja adicionar: ")

            autor = input("\nQual o autor do livro que deseja adicionar: ")
            
            while True:
                ano_do_livro = int(input("\nQual o ano de lançamento do livro: "))
                if type(ano_do_livro) != int:
                    print("O ano de lançamento do livro precisa ser um número inteiro")
                    continue
            
                genero_do_livro = input("\nQual o gênero do livro que deseja adicionar: ")

                while True:
                    status_do_livro = input("\nO livro que está adicionando ja foi lido? [S/N] ").upper()
                    
                    if status_do_livro == "S" or status_do_livro == "SIM":
                        status_do_livro = True
                        
                    elif status_do_livro == "N" or status_do_livro == "NAO" or status_do_livro == "NÃO":
                        status_do_livro = False
                        
                    else:
                        print("Opção inválida")
                        continue #o continue não faz o loop inteiro do programa “seguir em frente”, ele só faz o loop onde ele está ir para a próxima iteração.
                    if ano_do_livro > ano_atual:
                        print("O ano de lançamento do livro precisa ser válido")
                        continue
            
                    else:
                        lista_livros.append({"Titulo do livro" : titulo_do_livro,
                                            "Autor" : autor,
                                            "Ano de lançamento" : ano_do_livro,
                                            "Gênero do livro" : genero_do_livro,
                                            "Já foi lido?" : status_do_livro})
                        
                        with open("livros.json", "w", encoding="utf-8") as f:
                            json.dump(lista_livros, f, indent=4, ensure_ascii=False)

        
        if opcao_selecionada == 2:
            print("\n"+"-"*164)
            for livro in lista_livros:
                for chave, valor in livro.items():
                    print(f"{chave} : {valor}")
                print("-"*164+"\n")
                # print("\n")
            sleep(2)
            
        if opcao_selecionada == 3:
            titulo_do_livro_na_busca = input("\nDigite o nome do livro que você quer buscar: ")
            encontrado = False
            for livro in lista_livros:
                if livro["Titulo do livro"].lower() == titulo_do_livro_na_busca.lower():
                    
                    print(livro)
                    encontrado = True
                    break

            if not encontrado:
                print("\nEsse livro não foi encontrado...\n")
                
        if opcao_selecionada == 0:
            print("Encerrando o sistema...")
            break
        
        if opcao_selecionada == 4:
            titulo_do_livro_na_busca = input("\nDigite o nome do livro para alteração de dados: ")
            encontrado = False
            for livro in lista_livros:
                
                if livro["Titulo do livro"].lower() == titulo_do_livro_na_busca.lower():
                    
                    encontrado = True
                    while True:
                        print("\nQual informação você gostaria de alterar? ")
                        
                        informacao_a_alterar = int(input("\n1-Titulo\n2-Autor\n3-Ano de lançamento\n4-Gênero\n5-Status de leitura\n0-Sair\nResposta: "))
                        
                        if informacao_a_alterar == 1:
                            novo_titulo = input("\nDefina o novo título do livro: ")
                            livro["Titulo do livro"] = novo_titulo
                            
                        elif informacao_a_alterar == 2:
                            novo_autor = input("\nDefina o novo autor do livro: ")
                            livro["Autor"] = novo_autor
                            
                        elif informacao_a_alterar == 3:
                            novo_ano_lancamento = int(input("\nDefina o novo ano de lançamento do livro: "))
                            livro["Ano de lançamento"] = novo_ano_lancamento
                            
                        elif informacao_a_alterar == 4:
                            novo_genero = input("\nDefina o novo gênero do livro: ")
                            livro["Gênero do livro"] = novo_genero
                            
                        elif informacao_a_alterar == 5:
                            
                            if livro["Já foi lido?"] == True:
                                livro["Já foi lido?"] = False
                                
                            else: 
                                livro["Já foi lido?"] = True
                        elif informacao_a_alterar == 0:
                            break
                        else:
                            print("\nOpção inválida\n")
                            continue
                    
                if not encontrado: 
                    print("\nEsse livro não foi encontrado...\n")
                    break

    except Exception as e:
        print(f"\nErro: {e}\n")
        continue 

if __name__ == "__main__": app.run(debug=True)

