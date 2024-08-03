$(document).ready(function() {
    let productIndex = 0;

    $('#addProduct').click(function() {
        productIndex++;
        let productHtml = `
        <div class="product mb-3">
            <h5>Produto ${productIndex}</h5>
            <div class="form-row">
                <div class="form-group col-md-3">
                    <label for="descricaoProduto">Produto</label>
                    <input type="text" class="form-control descricaoProduto" required>
                </div>
                <div class="form-group col-md-2">
                    <label for="unidadeMedida">UND. Medida</label>
                    <input type="text" class="form-control unidadeMedida" required>
                </div>
                <div class="form-group col-md-2">
                    <label for="qtdeEstoque">QTDE. em Estoque</label>
                    <input type="number" class="form-control qtdeEstoque" required>
                </div>
                <div class="form-group col-md-2">
                    <label for="valorUnitario">Valor Unitário</label>
                    <input type="number" class="form-control valorUnitario" required>
                </div>
                <div class="form-group col-md-2">
                    <label for="valorTotal">Valor Total</label>
                    <input type="number" class="form-control valorTotal" readonly>
                </div>
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-danger removeProduct">Remover</button>
                </div>
            </div>
        </div>`;
        $('#products').append(productHtml);
        updateProductIndices();
    });

    $(document).on('input', '.qtdeEstoque, .valorUnitario', function() {
        let product = $(this).closest('.product');
        let qtdeEstoque = parseFloat(product.find('.qtdeEstoque').val()) || 0;
        let valorUnitario = parseFloat(product.find('.valorUnitario').val()) || 0;
        let valorTotal = qtdeEstoque * valorUnitario;
        product.find('.valorTotal').val(valorTotal.toFixed(2));
    });

    $(document).on('click', '.removeProduct', function() {
        $(this).closest('.product').remove();
        updateProductIndices();
    });

    $('#addAttachment').click(function() {
        let attachmentHtml = `
        <div class="attachment mb-3">
            <div class="form-row">
                <div class="form-group col-md-10">
                    <label>Anexo</label>
                    <input type="file" class="form-control fileAttachment" required>
                </div>
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-primary viewAttachment">Visualizar</button>
                </div>
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-danger removeAttachment">Remover</button>
                </div>
            </div>
        </div>`;
        $('#attachments').append(attachmentHtml);
        updateAttachmentIndices();
    });

    $(document).on('click', '.viewAttachment', function() {
        let fileInput = $(this).closest('.attachment').find('.fileAttachment')[0];
        if (fileInput.files && fileInput.files[0]) {
            let fileURL = URL.createObjectURL(fileInput.files[0]);
            window.open(fileURL, '_blank');
        } else {
            alert('Nenhum arquivo selecionado para visualização.');
        }
    });

    $(document).on('click', '.removeAttachment', function() {
        $(this).closest('.attachment').remove();
        updateAttachmentIndices();
    });

    $('#supplierForm').submit(function(e) {
        e.preventDefault();
        let formData = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            endereco: $('#endereco').val(),
            numero: $('#numero').val(),
            complemento: $('#complemento').val(),
            bairro: $('#bairro').val(),
            municipio: $('#municipio').val(),
            estado: $('#estado').val(),
            nomeContato: $('#nomeContato').val(),
            telefoneContato: $('#telefone').val(),
            emailContato: $('#email').val(),
            produtos: [],
            anexos: []
        };

        $('.product').each(function(index) {
            let produto = {
                indice: index + 1,
                descricaoProduto: $(this).find('.descricaoProduto').val(),
                unidadeMedida: $(this).find('.unidadeMedida').val(),
                qtdeEstoque: $(this).find('.qtdeEstoque').val(),
                valorUnitario: $(this).find('.valorUnitario').val(),
                valorTotal: $(this).find('.valorTotal').val()
            };
            formData.produtos.push(produto);
        });

        $('.attachment').each(function(index) {
            let fileInput = $(this).find('.fileAttachment')[0];
            if (fileInput.files && fileInput.files[0]) {
                let attachment = {
                    indice: index + 1,
                    nomeArquivo: fileInput.files[0].name,
                    blobArquivo: fileInput.files[0].name // Utilize o nome do arquivo em vez do próprio blob
                };
                formData.anexos.push(attachment);
            }
        });

        let json = JSON.stringify(formData, null, 4);
        downloadJSON(json, 'fornecedor.json');
    });
});

function updateProductIndices() {
    $('.product').each(function(index) {
        $(this).find('h5').text(`Produto ${index + 1}`);
    });
}

function updateAttachmentIndices() {
    $('.attachment').each(function(index) {
        $(this).find('label').text(`Anexo ${index + 1}`);
    });
}

function fetchAddress() {
    let cep = $('#cep').val();
    if (cep.length === 8) {
        $.get(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
            if (!data.erro) {
                $('#endereco').val(data.logradouro);
                $('#bairro').val(data.bairro);
                $('#municipio').val(data.localidade);
                $('#estado').val(data.uf);
            } else {
                alert('CEP não encontrado!');
            }
        }).fail(function() {
            alert('Erro ao buscar CEP!');
        });
    } else {
        alert('CEP inválido!');
    }
}

function downloadJSON(json, filename) {
    let blob = new Blob([json], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.fetchAddress = fetchAddress;
