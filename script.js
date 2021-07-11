var tipoTransacao = document.getElementById("operacao")
var nomeMercadoria = document.getElementById("nomeMercadoria");
var valor = document.getElementById("valor");

console.log("informacoesTabela");

var informacoesTabela = [];

//Mascara padrão 10,90
function mascaraMoeda(valorMoeda) {

  valorMoeda.value = valorMoeda.value.replace(/\D/g, "")
  valorMoeda.value = valorMoeda.value.replace(/(\d{1})(\d{14})$/, "$1.$2");
  valorMoeda.value = valorMoeda.value.replace(/(\d{1})(\d{11})$/, "$1.$2");
  valorMoeda.value = valorMoeda.value.replace(/(\d{1})(\d{8})$/, "$1.$2");
  valorMoeda.value = valorMoeda.value.replace(/(\d{1})(\d{5})$/, "$1.$2");

  if (valorMoeda.value.length < 5) {
    valorMoeda.value = (valorMoeda.value / 100).toFixed(2) + '';
    valorMoeda.value = valorMoeda.value.replace(".", ",");
  }

  valorMoeda.value = valorMoeda.value.replace(/(\d{1})(\d{2})$/, "$1,$2");

}

function numberToReal(numero) {
  var numero = numero.toFixed(2).split('.');
  numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
  return numero.join(',');
}

// Fechar menu
function closeMenu() {
  document.getElementsByClassName("responsive-menu ul").style.display = "none";
};


//Validação de formulário 
function validarCadastro(e) {
  var tipoTransacao = document.getElementById("operacao").value;
  var nomeMercadoria = document.getElementById("nomeMercadoria").value;
  var valor = document.getElementById("valor").value;

  var erro_nomeDaMercadoria = document.getElementById("erro_nomeDaMercadoria");
  var erro_valor = document.getElementById("erro_valor");

  var erro = false;

  if (nomeMercadoria == "") {
    erro = true
    erro_nomeDaMercadoria.innerHTML = "Preencher campo";
  } else {
    erro_nomeDaMercadoria.innerHTML = "";
  }

  if (valor == "") {
    erro = true
    erro_valor.innerHTML = "Preencher campo";
  } else {
    erro_valor.innerHTML = "";
  }
  if (!erro) {
    if (informacoesTabela == null){
        informacoesTabela = [];
        if(tipoTransacao =="Compra"){
          valor = valor*-1; 
      }else{
          valor = parseFloat(valor); 
      }
    }
    informacoesTabela.push({TipoTransacao: tipoTransacao, Mercadoria: nomeMercadoria, Valor: valor});
    console.log("informacoesTabela", informacoesTabela);
    localStorage.setItem("transacao", JSON.stringify(informacoesTabela));
    document.getElementById("nomeMercadoria").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("operacao").value = "";
  }
  
  return false;
  
  }

// inserir informações na tabela
 function adicionarTransacao() {
  var total = 0;
  for (let idx_aln in informacoesTabela) {
      console.log("PRODUTO", informacoesTabela[idx_aln].nomeMercadoria);
      total += parseFloat(informacoesTabela[idx_aln].valor);
      document.getElementById('tbody_transacoes').innerHTML += 
      `<div>
        <tr>
        <td> ` + informacoesTabela[idx_aln].nomeMercadoria + `</td>
        <td> ` + informacoesTabela[idx_aln].valor + `</td>
        </tr>
      </div>`
  }
  console.log("Total", total);
  document.getElementById('vlTotal').innerHTML +=`<span><strong>` + "R$" + total + ` </strong></span></td>`

}
adicionarTransacao();