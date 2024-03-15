<h1 align="center">Challenge Backend - Brain-AG</h1>

### 📌 Requisitos
O teste tem como objetivo acurar as habilidades do candidato em resolver alguns problemas relacionados à lógica de programação, regra de negócio e orientação à objetos.

O mesmo consiste em um cadastro de produtor rural com os seguintes dados:

- CPF ou CNPJ
- Nome do produtor
- Nome da Fazenda
- Cidade
- Estado
- Área total em hectares da fazenda
- Área agricultável em hectares
- Área de vegetação em hectares
- Culturas plantadas (Soja, Milho, Algodão, Café, Cana de Açucar)

### Requisitos de negócio

- O usuário deverá ter a possibilidade de cadastrar, editar, e excluir produtores rurais.
- O sistema deverá validar CPF e CNPJ digitados incorretamente.
- A soma de área agrícultável e vegetação, não deverá ser maior que a área total da fazenda
- Cada produtor pode plantar mais de uma cultura em sua Fazenda.
- Exibir: 
  * Total de fazendas em quantidade
  * Total de fazendas em hectares (área total)

<h2>👷 Como Utilizar</h2>

🚧 Requerido! Instalar [git](https://git-scm.com/), [node](https://nodejs.org/en/),[docker](https://www.docker.com/) e [docker compose](https://docs.docker.com/compose/)

```bash
# Clone Repositório
$ git clone https://github.com/dmoura97/brain-ag-back-nestjs.git

# Ir para a pasta do projeto
$ cd brain-ag-back-nestjs

# Crie o seu arquivo .env seguindo .env.example
# Caso queira, pode mudar também as configurações do docker-compose.local
# Execute o comando para subir os containers
$ docker-compose -f docker-compose.local.yml up -d

# Entre no container da aplicação nestjs
$ docker exec -it app bash

# Instale as dependências
$ npm i

# Rode as migrations
$ npm run migration:run

# Iniciar a aplicação
$ npm run start:dev

# Caso queria rodar os test
$ npm run test
```
<h2> 📄 Documentação da API</h2>
A documentação da API está disponível no Swagger UI. Você pode acessá-la navegando até <strong>/api</strong> no seu navegador após iniciar a aplicação. Caso você não tenha alterado a porta da API, a URL será <strong>http://localhost:3001/api</strong>