-- Criar tabela de grupos primeiro (sem dependências)
CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    grupo VARCHAR(255) NOT NULL UNIQUE,
    desafiado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de contratos (sem dependências de usuários ainda)
CREATE TABLE contratos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    gerente_geral INTEGER,
    gerente_operacoes INTEGER,
    coordenador INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de usuários
CREATE TABLE usuarios (
    matricula INTEGER PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'usuario' CHECK (role IN ('admin', 'membro', 'usuario')),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    contrato_id INTEGER REFERENCES contratos(id),
    grupo_id INTEGER REFERENCES grupos(id),
    password_hash VARCHAR(255) NOT NULL,
    pass_sub BOOLEAN DEFAULT FALSE,
    escolaridade VARCHAR(100),
    estado_civil VARCHAR(50),
    data_nascimento DATE,
    assinatura_digital TEXT,
    funcao VARCHAR(255),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar foreign keys para contratos após criar tabela de usuários
ALTER TABLE contratos 
ADD CONSTRAINT fk_contratos_gerente_geral 
FOREIGN KEY (gerente_geral) REFERENCES usuarios(matricula);

ALTER TABLE contratos 
ADD CONSTRAINT fk_contratos_gerente_operacoes 
FOREIGN KEY (gerente_operacoes) REFERENCES usuarios(matricula);

ALTER TABLE contratos 
ADD CONSTRAINT fk_contratos_coordenador 
FOREIGN KEY (coordenador) REFERENCES usuarios(matricula);

-- Criar índices para performance
CREATE INDEX idx_usuarios_telefone ON usuarios(telefone);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_contrato ON usuarios(contrato_id);
CREATE INDEX idx_usuarios_grupo ON usuarios(grupo_id);
CREATE INDEX idx_contratos_codigo ON contratos(codigo);
CREATE INDEX idx_contratos_gerente_geral ON contratos(gerente_geral);
CREATE INDEX idx_contratos_gerente_operacoes ON contratos(gerente_operacoes);
CREATE INDEX idx_contratos_coordenador ON contratos(coordenador);

-- Habilitar RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS simples - verificar apenas se usuário está autenticado
CREATE POLICY "Usuários autenticados podem acessar dados" ON usuarios FOR ALL TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem acessar grupos" ON grupos FOR ALL TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem acessar contratos" ON contratos FOR ALL TO authenticated USING (true);

-- Conceder permissões às roles
GRANT SELECT, INSERT, UPDATE, DELETE ON usuarios TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON grupos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON contratos TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE grupos_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE contratos_id_seq TO authenticated;

-- Dados iniciais para grupos
INSERT INTO grupos (grupo, desafiado) VALUES 
('Grupo Alpha', true),
('Grupo Beta', false),
('Grupo Gamma', true);

-- Dados iniciais para contratos
INSERT INTO contratos (codigo, descricao) VALUES 
('0010A', 'Gerdau Ouro Branco'),
('0020B', 'Vale do Rio Doce'),
('0030C', 'Petrobras Santos');

-- Criar usuário administrador padrão (senha: acad1001)
-- Hash bcrypt para 'acad1001': $2a$10$glI9d9JfdbgxWQ40v43fNeFNZHtSDQmPXevqljIRBwYWj4pPrAz.e
INSERT INTO usuarios (
    matricula, 
    nome, 
    email, 
    telefone, 
    role, 
    status, 
    password_hash,
    pass_sub,
    funcao
) VALUES (
    1001,
    'Administrador do Sistema',
    'admin@academialideres.com',
    '+5511999999999',
    'admin',
    'ativo',
    '$2a$10$glI9d9JfdbgxWQ40v43fNeFNZHtSDQmPXevqljIRBwYWj4pPrAz.e',
    false,
    'Administrador de Sistema'
);