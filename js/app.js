$(document).ready(function() {
    let productIndex = 0;

    $('#addProduct').click(function() {
        $('#noProductsMessage').hide();
        productIndex++;
        let productHtml = `
        <div class="product mb-3 card">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-md-1">
                        <button type="button" class="btn btn-danger removeProduct">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                    <div class="col-md-11">
                        <div class="form-row align-items-center">
                            <div class="col-md-12">
                                <h5>Produto ${productIndex}</h5>
                            </div>
                            <div class="col-md-2">
                                <img src="img/caminho-para-icone-produto.png" alt="Produto" style="width: 150px; height: 150px;">
                            </div>
                            <div class="col-md-10">
                                <div class="form-row">
                                    <div class="col-md-12">
                                        <label for="descricaoProduto">Produto</label>
                                        <input type="text" class="form-control descricaoProduto" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="unidadeMedida">UND. Medida</label>
                                        <select class="form-control unidadeMedida" required>
                                            <option value="unidade">Unidade</option>
                                            <option value="kg">Kg</option>
                                            <option value="litros">Litros</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="qtdeEstoque">QTDE. em Estoque</label>
                                        <input type="number" class="form-control qtdeEstoque" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="valorUnitario">Valor Unitário</label>
                                        <input type="number" class="form-control valorUnitario" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="valorTotal">Valor Total</label>
                                        <input type="number" class="form-control valorTotal" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        if ($('.product').length === 0) {
            $('#noProductsMessage').show();
        }
    });

    $('#addAttachment').click(function() {
        $('#noAttachmentsMessage').hide();
        let attachmentHtml = `
        <div class="attachment mb-3">
            <div class="form-row">
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-danger removeAttachment">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-primary viewAttachment">
                        <i class="fa fa-eye"></i>
                    </button>
                </div>
                <div class="form-group col-md-10">
                    <label>Anexo</label>
                    <input type="file" class="form-control fileAttachment" required>
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
        if ($('.attachment').length === 0) {
            $('#noAttachmentsMessage').show();
        }
    });

    $('#supplierForm').submit(function(e) {
        e.preventDefault();

        if ($('.product').length === 0) {
            alert('Adicione pelo menos um produto antes de salvar o fornecedor.');
            return;
        }

        if ($('.attachment').length === 0) {
            alert('Adicione pelo menos um anexo antes de salvar o fornecedor.');
            return;
        }

        let formData = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
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
                    blobArquivo: fileInput.files[0].name
                };
                formData.anexos.push(attachment);
            }
        });

        let json = JSON.stringify(formData, null, 4);
        downloadJSON(json, 'fornecedor.json');
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
});