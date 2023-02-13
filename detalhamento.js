function _datatableSoExcel (idTabela, ordenaColuna, ordenaForma, tituloPlanilha, quantidadePagina = 10){
  $('#' + idTabela).DataTable({
    "order": [[ ordenaColuna, ordenaForma ]],
    "pageLength": quantidadePagina,
    "language": {
      "decimal": ",",
      "thousands": ".",
      "sEmptyTable": "Nenhum registro encontrado",
      "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
      "sInfoFiltered": "(Filtrados de _MAX_ registros)",
      "sInfoPostFix": "",
      "sInfoThousands": ".",
      "sLengthMenu": "Mostrar _MENU_ resultados por página",
      "sLoadingRecords": "Carregando...",
      "sProcessing": "Processando...",
      "sZeroRecords": "Nenhum registro encontrado",
      "sSearch": "Pesquisar",
      "oPaginate": {
        "sNext": "Próximo",
        "sPrevious": "Anterior",
        "sFirst": "Primeiro",
        "sLast": "Último"
      },
      "oAria": {
        "sSortAscending": ": Ordenar colunas de forma ascendente",
        "sSortDescending": ": Ordenar colunas de forma descendente"
      }
    },
    "columnDefs": [
      { "type": 'numeric-comma', "targets": 5 }
    ],
    "dom": 'Bfrtip',
    "buttons": 
      [
        {
          extend: 'excel',
          text: 'Gerar Excel',
          title: tituloPlanilha, 
        },
      ],
  });
}

$( document ).ready(function() {
  $('.loadingPagina').css('display', 'block')
  
  const params = new URLSearchParams(window.location.search)
  
  const id = parseInt(params.get('id'))

  dados.forEach(function(item, index) {
    let idDados = item.idDfi
    if (idDados == id) {
      switch(item.PRIORIDADE){
        case 'MUITO ALTO':
          var criticidade = `<b style="color:red;">${item.PRIORIDADE}</b>`
          break;
        case 'ALTO':
          var criticidade = `<b style="color:red;">${item.PRIORIDADE}</b>`
          break;
        case 'MEDIO':
          var criticidade = `<b style="color:orange;">${item.PRIORIDADE}</b>`
          break;
        case 'BAIXO':
          var criticidade = `<b style="color:green;">${item.PRIORIDADE}</b>`
          break;
        case 'MUITO BAIXO':
          var criticidade = `<b style="color:green;">${item.PRIORIDADE}</b>`
          break;
        default:
          var criticidade = `<b style=">${item.PRIORIDADE}</b>`
      }

      $('#nomeEmpreendimento').html(item.EMPREENDIMENTO)
      $('#nomeCidade').html(`<b>${item.CIDADE}</b>`)
      $('#nomeUF').html(`<b>${item.UF}</b>`)
      $('#nomeDano').html(`<b>${item.TIPO_DE_DANO}</b>`)
      $('#nomeCriticidade').html(criticidade)
      $('#nomeDataOrigem').html(`<b>${item.DATA_ORIGEM}</b>`)
      $('#nomeStatus').html(`<b>${item.statusDFI}</b> <small class="text-muted">(atualizado em ${item.updated_at})</small>`)
      if(item.foto != null && item.visivelFoto == 1){
        $('#fotoEmp').html(`<img class="imagemFoto" src='data:image/png;base64, ${item.foto}'/>`)
      }else{
        $('#fotoEmp').html(`<small class="text-muted">Não há fotos.</small>`)
      }
      // $('#nomeUF').html(item.UF)
    }
  });

  imprensa.forEach(function(item, index) {
    let idDados = item.idDfi
    if (idDados == id){
      if(item.visivel == 1){
        var dataPublic = item.dataPublicacao
        if(dataPublic != null){
          var dataPublicacaoFormat = dataPublic.split("-")
          var dataPublicacaoFormatada = dataPublicacaoFormat[2] + '/' + dataPublicacaoFormat[1] + '/' + dataPublicacaoFormat[0]
        }else{
          var dataPublicacaoFormatada = 'Não há'
        }

        var cardImprensa = 
        `
          <div class="card mb-2">
            <div class="card-header">
              <p class="card-text">Imprensa</p>
            </div>
            <div class="card-body">
              <p class="card-text">Tipo de Imprensa: <b>${(item.tipoImprensa != null ? item.tipoImprensa : 'Não há')}</b></p>
              <p class="card-text">Abrangencia: <b>${(item.abrangencia != null ? item.abrangencia : 'Não há')}</b></p>
              <p class="card-text">Veículo de Informação: <b>${(item.veiculoInformacao != null ? item.veiculoInformacao : 'Não há')}</b></p>
              <p class="card-text">Data da Publicação: <b>${dataPublicacaoFormatada}</b></p>
              <p class="card-text">Detalhamento: </p>
              <div>
                ${(item.observacao != null ? $.parseHTML(item.observacao) : 'Não há')}
              </div>
            </div>
          </div>
        `
        $(cardImprensa).appendTo('#dadosImprensa');
      }
    }
    // else{
    //   $('#semDadosImprensa').html(`: <span class="text-muted">Não há dados de Imprensa.</span>`)
    // }
  });

  historico.forEach(function(item, index) {
    let idDados = item.idDfi
    if (idDados == id){
      if(item.visivel == 'S'){
        var dataPublic = item.created_at
        var dataPublicacaoFormat = dataPublic.split("T")[0].split("-")
        var dataPublicacaoFormatada = dataPublicacaoFormat[2] + '/' + dataPublicacaoFormat[1] + '/' + dataPublicacaoFormat[0]

        var cardHistorico = 
        `
        <div class="card mb-1">
          <div class="card-header">
            Criado em: <b>${dataPublicacaoFormatada}</b> por <b>${item.matriculaCriacao}</b>
          </div>
          <div class="card-body">
            ${item.observacao}
          </div>
        </div>
        `
        $(cardHistorico).appendTo('#dadosHistorico');
      }
    }
  });
  
  $('.loadingPagina').css('display', 'none')

})
 