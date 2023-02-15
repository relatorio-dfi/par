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
  
  var database = firebase.database();
    database.ref("REVISTA").once("value", function(snapshot) {
    var dados = snapshot.val();

    Object.values(dados).forEach(function(grupo){
      let atualizacao = $.grep(grupo, function(dado){
        return dado
      })[0]
      let timestamp = atualizacao.dataAtualizacao
      let data = new Date(timestamp)
      let data_formatada = data.toLocaleString("pt-BR")
      $('#dataAtualizacaoRelatorio').html(data_formatada+' hs');

      grupo.forEach(function(item){
    // dados.forEach(function(item, index){

        switch(item.PRIORIDADE){
          case 'PRIORITARIO':
            var criticidade = `<td data-order="0" style="color:red; font-weight: bold;">${item.PRIORIDADE}</td>`
            break;
          case 'ALTO':
            var criticidade = `<td data-order="1" style="color:red; font-weight: bold;">${item.PRIORIDADE}</td>`
            break;
          case 'MODERADO':
            var criticidade = `<td data-order="2" style="color:orange; font-weight: bold;">${item.PRIORIDADE}</td>`
            break;
          case 'BAIXO':
            var criticidade = `<td data-order="3" style="color:green; font-weight: bold;">${item.PRIORIDADE}</td>`
            break;
          default:
            var criticidade = `<td data-order="4" style="font-weight: bold;">${item.PRIORIDADE}</td>`
        }

        var linha =
          `
            <tr> 
              <td>${item.UF}</td> 
              <td>${item.CIDADE}</td> 
              <td>${item.EMPREENDIMENTO}</td> 
              <td>${item.TIPO_DE_DANO}</td> 
              ${criticidade} 
              <td>${(item.Imprensa == 1 ? 'SIM' : 'NÃO')}</td> 
              <td>${item.DATA_ORIGEM}</td> 
              <td>${item.updated_at}</td> 
              <td>${item.statusDFI}</td> 
              <td>${(item.dataPrevistaConclusao != null ? item.dataPrevistaConclusao : 'a definir')}</td>
              <td>
                <a class="btn btn-primary btn-sm" href="empreendimento.html?id=${item.idDfi}" role="button">Detalhamento</a>
              </td>
            </tr>
          `;
          
        $(linha).appendTo('#tblImoveisPar>tbody');
      });

    _datatableSoExcel('tblImoveisPar', '4', 'asc', 'imoveis_par_dfi', 10)
  });
  $('.loadingPagina').css('display', 'none');
});   
});