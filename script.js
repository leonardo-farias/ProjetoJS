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
function menuMobile(){
  document.getElementById("menu").style.display="block";
}

// limpar 

function limpar(){
  var escolha= confirm("Você ira limpar todo extrato!");
   if(escolha==true){
     localStorage.clear();
     window.location.reload();
   }
     


//Validação de formulário 
function validarCadastro(e) {
  var tipoTransacao = document.getElementById("operacao").value;
  var nomeMercadoria = document.getElementById("nomeMercadoria").value;
  var valor = document.getElementById("valor").value;

  var erro_nomeDaMercadoria = document.getElementById("erro_nomeDaMercadoria");
  var erro_valor = document.getElementById("erro_valor");

  var erro = false;

  if (nomeMercadoria == "") {''
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
          valor = parseFloat(valor)*-1; 
      }else{
          valor = parseFloat(valor); 
      }
    }
    
    informacoesTabela.push({TipoTransacao: tipoTransacao, Mercadoria: nomeMercadoria, Valor: valor});
   
    localStorage.setItem("transacao", JSON.stringify(informacoesTabela));
    document.getElementById("nomeMercadoria").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("operacao").value = "";

    adicionarTransacao(); // BRUNO - FALTOU CHAMAR AQUI A FUNCAO PARA ATUALIZAR O EXTRATO APÓS INSERIR
  }
  
  return false;
  
  }

// inserir informações na tabela
 function adicionarTransacao() {
  informacoesTabela = JSON.parse(localStorage.getItem('transacao')) //BRUNO - FICOU FALTANDO ESSA LINHA  

  var total = 0;

  //BRUNO - QUERO LIMPAR AS TRANSAÇÕES ANTES DE INSERIR NOVAMENTE
  document.getElementById('tbody_transacoes').innerHTML = "";
  for (let idx_aln in informacoesTabela) {
      console.log("PRODUTO", informacoesTabela[idx_aln].Mercadoria); //BRUNO - ESTAVA USANDO nomeMercadoria E O CORRETO É Mercadoria 
      total += parseFloat(informacoesTabela[idx_aln].Valor); // BRUNO - ESTAVA USANDO valor E O CORRETO É Valor
      document.getElementById('tbody_transacoes').innerHTML += 
      `<div>
        <tr>
        <td> <td>
        <td> ` + informacoesTabela[idx_aln].Mercadoria + `</td>
        <td> ` + informacoesTabela[idx_aln].Valor + `</td>
        </tr>
      </div>`

      //BRUNO - ESTAVA USANDO nomeMercadoria E O CORRETO É Mercadoria 
      // BRUNO - ESTAVA USANDO valor E O CORRETO É Valor
  }
  console.log("Total", total);
  
  //BRUNO - AQUI EU TROQUEI += POR = POIS QUERO QUE ELE SOBRESCREVA O VALOR
  document.getElementById('vlTotal').innerHTML =`<span><strong>` + "R$" + total + ` </strong></span></td>`

}
adicionarTransacao();

// gravar no servidor airtable

function gravarServidor(){
  transacao=JSON.stringify(localStorage.getItem("transacao"));
 var alunos=[]
 
  if(transacao!=null){
 
// buscar informações nas transações 

fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?fields=Aluno&fields=Json',{
  headers:{
    Authorization: 'Bearer key2CwkHb0CKumjuM'
  }

}).then((resp)=>{

    return resp.json()
}  
  ).then((data)=>{
    alunos=data.records

   
     alunos.forEach(element => {
      
     if(element.fields.Aluno=="9864"){
       found=element.fields.Aluno.toString();
       id=element.id.toString();
     } 
     
    
    })
   
  
  })


if(found!="9864"){
  
  // gravar primeira na transação  

  fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico',{
  method:"POST",
   headers:{
    Authorization: 'Bearer key2CwkHb0CKumjuM',
     'Content-Type':'application/json'
   },body: JSON.stringify(
     {
       records:[{
          fields: {
            Aluno:'9864',
            Json:transacao
          }
          
       }

       ]
     
     }
   )
      

   
 })

}else{
   
 // update nas transações 

  fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico/"+id,{
    method:"PUT",
    headers:{
      Authorization: 'Bearer key2CwkHb0CKumjuM',
       'Content-Type':'application/json'
     },body:JSON.stringify({

      records:[{
        fields: {
          Aluno:'9864',
          Json:transacao
        }
        
     }

     ]
     })
  })




}





  }else{
    alert("Nenhuma transação cadastrada")
  }
} 