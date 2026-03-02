"""
Arquivo principal para executar a aplicação Flask
"""
from app import create_app
import os

# Criar a aplicação
app = create_app()

if __name__ == '__main__':
    # Porta dinâmica para Render
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)