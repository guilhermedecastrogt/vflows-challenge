# Cadastro de Fornecedores

Este projeto é um sistema de cadastro de fornecedores e produtos, desenvolvido como parte de um teste técnico para a empresa vflows. O sistema permite o registro de fornecedores, seus produtos e anexos relevantes, utilizando tecnologias como HTML, CSS, Bootstrap e jQuery.

## Funcionalidades

- Cadastro de fornecedores com informações detalhadas.
- Adição de produtos associados a cada fornecedor.
- Upload de anexos relacionados aos fornecedores.
- Cálculo automático do valor total do estoque dos produtos.
- Validação de formulários e exibição de mensagens de erro.

## Tecnologias Utilizadas

- HTML5
- CSS3
- Bootstrap 4
- jQuery

## Estrutura do Projeto

- `index.html`: Página principal contendo o formulário de cadastro.
- `css/styles.css`: Arquivo de estilos personalizados.
- `js/app.js`: Arquivo JavaScript contendo a lógica de manipulação do DOM e validações.

## Como Executar o Projeto

1. Clone o repositório:
    ```bash
    git clone https://github.com/guilhermedecastrogt/vflows-challenge.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd vflows-challenge
    ```
3. Abra o arquivo `index.html` em seu navegador preferido.

## Uso

1. Preencha os dados do fornecedor no formulário.
2. Adicione produtos clicando no botão "Adicionar Produto".
3. Adicione anexos clicando no botão "Incluir Anexo".
4. Após preencher todas as informações necessárias, clique em "Salvar Fornecedor" para gerar um arquivo JSON com os dados cadastrados.

## Exemplo de Dados Gerados

```json
{
    "razaoSocial": "Empresa Exemplo LTDA",
    "nomeFantasia": "Exemplo",
    "cnpj": "00.000.000/0001-00",
    "inscricaoEstadual": "123456789",
    "inscricaoMunicipal": "987654321",
    "nomeContato": "João Silva",
    "telefoneContato": "(11) 99999-9999",
    "emailContato": "contato@exemplo.com",
    "produtos": [
        {
            "indice": 1,
            "descricaoProduto": "Produto 1",
            "unidadeMedida": "Unidade",
            "qtdeEstoque": 10,
            "valorUnitario": 5.0,
            "valorTotal": 50.0
        }
    ],
    "anexos": [
        {
            "indice": 1,
            "nomeArquivo": "documento.pdf",
            "blobArquivo": "documento.pdf"
        }
    ]
}
```