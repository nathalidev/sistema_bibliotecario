from flask import Flask

app = Flask(__name__)

from views import *  # importa as rotas depois do app existir

if __name__ == "__main__":
    app.run(debug=True)
