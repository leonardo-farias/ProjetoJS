var tipoTransacao = document.getElementById("operacao")
var nomeMercadoria = document.getElementById("nomeMercadoria");
var valor = document.getElementById("valor");
var branco = null
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
function menuMobile() {
  document.getElementById("menu").style.display = "block";
}

// limpar 

function limpar() {
  var escolha = confirm("Você ira limpar todo extrato!");
  if (escolha == true) {
    localStorage.clear();
    window.location.reload();
  }
}



//Validação de formulário 
function validarCadastro(e) {
  var tipoTransacao = document.getElementById("operacao").value;
  var nomeMercadoria = document.getElementById("nomeMercadoria").value;
  var valor = document.getElementById("valor").value;

  var erro_nomeDaMercadoria = document.getElementById("erro_nomeDaMercadoria");
  var erro_valor = document.getElementById("erro_valor");

  var erro = false;

  if (nomeMercadoria == "") {
    ''
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
    if (informacoesTabela == null) {
      informacoesTabela = []
    };

    valor = valor.replace(".", "").replace(",", ".");


    if (tipoTransacao == "Compra") {
      valor = parseFloat(valor) * -1
    } else {
      valor = parseFloat(valor)
    };

    informacoesTabela.push({
      TipoTransacao: tipoTransacao,
      Mercadoria: nomeMercadoria,
      Valor: valor
    });

    localStorage.setItem("transacao", JSON.stringify(informacoesTabela));
    document.getElementById("nomeMercadoria").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("operacao").value = "";

    adicionarTransacao()
  }

  return false;

}


// inserir informações na tabela
function adicionarTransacao() {
  informacoesTabela = JSON.parse(localStorage.getItem('transacao'))

  var total = 0;


  document.getElementById('areaTransacoes').innerHTML = "";
  for (let idx_aln in informacoesTabela) {
    console.log("PRODUTO", informacoesTabela[idx_aln].Mercadoria);
    total += parseFloat(informacoesTabela[idx_aln].Valor);
    document.getElementById('areaTransacoes').innerHTML +=
      `<div>
          <tr>
          <td> </td>
          <td> ` + informacoesTabela[idx_aln].Mercadoria + `</td>
          <td class="spaceRigth"> ` + informacoesTabela[idx_aln].Valor.toString().replace(".", ",") + `</td>
          </tr>
          </div>`
  }




  // Valor final das transações
  console.log("Total", total);

  if (total >= 0) {
    document.getElementById("vlTotal").innerHTML = `<span><strong>` + "R$" + total + ` </strong></span>`
    document.getElementById("retornoTransicao").innerHTML = `<span><strong>` + "Lucro" + `</strong></span>`
  } else if (total < 0) {
    document.getElementById("vlTotal").innerHTML = `<span><strong>` + "R$" + total + ` </strong></span></td>`
    document.getElementById("retornoTransicao").innerHTML = `<span><strong>` + "Prejuízo" + `</strong></span>`
  }
}

adicionarTransacao();

function limparDados() {
  var escolha = confirm("Você ira limpar todo extrato!");
  if (escolha == true) {
    localStorage.clear();
    window.location.reload();
  }

}

function SalvarTrsc() {

  if (transacao.length > 0) {

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {

      headers: {
        Authorization: 'Bearer key2CwkHb0CKumjuM',
      }
    }).then((resp) => {
      return resp.json()
    }).then((data) => {
      alunos = data.records

      alunos.map((aluno) => {


        if (aluno.fields.Aluno == "9864") {

          Found = aluno.fields.Aluno;
          Id = aluno.id;


        }



      })
    }).then(() => {

      console.log("Aluno=" + Found + " ID=" + Id)

      if (Found == "9864") {

        console.log("entrou PATCH")


        fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
          method: "PATCH",
          headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM',
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({

            "records": [{
              "id": Id,
              "fields": {
                "Aluno": "9864",
                "Json": JSON.stringify(transacao),
              }
            }]

          })
        });
      } else {

        console.log("entrou POST")

        fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico', {
          method: "POST",
          headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({

            "records": [{
              "fields": {
                "Aluno": "9864",
                "Json": JSON.stringify(transacao),
              }
            }]

          })
        })
      }

    })


    alert("salvo com sucesso")
  } else {
    alert('Nenhuma transacao a ser salva')
  }

}