-- Tabela de Usuários
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- 'Administrador' ou 'Usuário Comum'
    must_reset_password BOOLEAN DEFAULT FALSE
);

-- Tabela de Chamados
CREATE TABLE tickets (
    id TEXT PRIMARY KEY,
    requester_id TEXT NOT NULL,
    requester_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    extension TEXT,
    description TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Em aberto', 'Em análise', 'Em espera', 'Encerrado'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_response TEXT,
    FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- Tabela de Histórico de Chamados
CREATE TABLE ticket_history (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Tabela de Configurações do App
CREATE TABLE app_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    is_2fa_enabled BOOLEAN DEFAULT FALSE
);

-- Inserir usuário administrador padrão
INSERT INTO users (id, name, username, email, sector, password, role, must_reset_password)
VALUES ('admin-id', 'Administrador Sistema', 'admin', 'admin@empresa.com.br', 'TI', 'admin', 'Administrador', 0);

-- Inserir configuração inicial
INSERT INTO app_config (id, is_2fa_enabled) VALUES (1, 0);
