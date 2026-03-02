"""
Inicialização da aplicação Flask - Sistema de Biblioteca
"""
from flask import Flask
import os

def create_app():
    """Factory function para criar e configurar a aplicação Flask"""
    
    # Criar instância do Flask
    app = Flask(__name__)
    
    # Configurações básicas
    app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui-mude-em-producao'
    app.config['JSON_AS_ASCII'] = False  # Para suportar caracteres especiais (português)
    
    # Definir caminhos para pastas de dados e uploads
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app.config['DATA_DIR'] = os.path.join(BASE_DIR, 'data')
    app.config['UPLOAD_DIR'] = os.path.join(BASE_DIR, 'uploads')
    
    # Registrar rotas do arquivo views.py como blueprint
    from app.views import views
    app.register_blueprint(views)
    return app