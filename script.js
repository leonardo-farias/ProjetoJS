var tipoTransacao = document.getElementById("operacao")
var nomeMercadoria = document.getElementById("nomeMercadoria");
var valor = document.getElementById("valor");

console.log("informacoesTabela");

var informacoesTabela = [];

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

function closeMenu() {
  document.getElementsByClassName("responsive-menu ul").style.display = "none";
};



function validarCadastro() {
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
    informacoesTabela.push({transacao: tipoTransacao, Mercadoria: nomeMercadoria, valor: valor});
    localStorage.setItem("transacao", JSON.stringify(informacoesTabela));
  }
}

 function adicionarTransacao() {
   if(validarCadastro() == true);
   informaçõesTabela = JSON.parse(localStorage.getItem("transacao"));
   if(JSON.parse(localStorage.getItem("transacao"))!=null)
  document.querySelector("#tabelaJS").innerHTML = informaçõesTabela.map((tab) => {
    return 
    `
      <tr>
        <td class="borda-inferior">` + tab.tipoTransacao +`</td>
        <td class="borda-inferior spaceleft">` + tab.nomeMercadoria + `</td>
        <td class="borda-inferior spaceRigth">` + tab.valor + `</td>
      </tr>
    `
  }).join(``);
}
