function isEmail(email) {
    var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return EmailRegex.test(email);
}

document.getElementById('form-facrisa').onsubmit = function (event) {
    event.preventDefault();

    message = 'Por favor, informe: ';
    erros = 0;

    nome_val = document.getElementById("NOME").value;
    if (nome_val === "") {
        message += '<br /> - Seu nome.';
        erros += 1;
    }

    email_val = document.getElementById("EMAIL").value;
    if (!isEmail(email_val)) {
        message += '<br /> - Seu melhor e-mail.';
        erros += 1;
    }

    telefone_val = document.getElementById("NOME").value;
    if (telefone_val === "") {
        message += '<br /> - Seu telefone.';
        erros += 1;
    }

    cnpj_val = document.getElementById("CNPJ").value;
    if(cnpj_val != "" && !validarCNPJ(cnpj_val)) {
        message += '<br /> - CNPJ válido.';
        erros += 1;
    }

    if (erros > 0) {
        showSnack(message);
        return false;
    } else {
        envia_dados();
        return true;
    }
};

function showSnack(message, background) {
    if (!background) {
        document.getElementById("snackbar").style.backgroundColor = 'firebrick';
    } else {
        document.getElementById("snackbar").style.backgroundColor = background;
    }
    // Get the snackbar DIV
    var snack = document.getElementById("snackbar");

    snack.innerHTML = message;

    snack.className = "show";

    setTimeout(function () { snack.className = snack.className.replace("show", ""); }, 3000);
}

function buscaCep() {
    cep_val = document.getElementById("CEP").value;
    let cep_field = cep_val.replace('-', '');
    let url = 'http://viacep.com.br/ws/' + cep_field + '/json';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status = 200) {
                json = JSON.parse(xhr.responseText);
                if(!Boolean(json.erro)) {
                    document.getElementById("ENDERECO").value = json.logradouro;
                    document.getElementById("BAIRRO").value = json.bairro;
                    document.getElementById("CIDADE").value = json.localidade;
                    document.getElementById("ESTADO").value = json.uf;
                    document.getElementById("NUMERO").focus();
                }
            }
        }
    }
    xhr.send();
}

serialize = function (obj, prefix) {
    var str = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

function envia_dados() {

    debugger;
    showSnack('Enviando...', 'darkhakki');

    let url = 'service.php';
    let xhr = new XMLHttpRequest();

    var params = new Object();
    params.NOME = document.getElementById("NOME").value;
    params.EMAIL = document.getElementById("EMAIL").value;
    params.TELEFONE = document.getElementById("TELEFONE").value;
    params.CEP = document.getElementById("CEP").value;
    params.ENDERECO = document.getElementById("ENDERECO").value;
    params.NUMERO = document.getElementById("NUMERO").value;
    params.COMPLEMENTO = document.getElementById("COMPLEMENTO").value;
    params.BAIRRO = document.getElementById("BAIRRO").value;
    params.CIDADE = document.getElementById("CIDADE").value;
    params.ESTADO = document.getElementById("ESTADO").value;
    params.CNPJ = document.getElementById("CNPJ").value;


    xhr.open("POST", url, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            showSnack('Agradecemos o interesse,<br />Em breve entraremos em contato.', 'darkolivegreen');
        }
    }
    xhr.send(serialize(params));
}

function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();

        VMasker(c).maskPattern(masks[0]);
        c.value = VMasker.toPattern(v, masks[0]);
}

document.addEventListener("DOMContentLoaded", function(e) {
    var telMask = ['(99) 99999-9999'];
    var tel = document.querySelector('#TELEFONE');
    VMasker(tel).maskPattern(telMask[0]);
    tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

    var docMask = ['99.999.999/9999-99'];
    var doc = document.querySelector('#CNPJ');
    VMasker(doc).maskPattern(docMask[0]);
    doc.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);


    var cepMask = ['99999-999'];
    var cep = document.querySelector('#CEP');
    VMasker(cep).maskPattern(cepMask[0]);
    cep.addEventListener('input', inputHandler.bind(undefined, cepMask, 14), false);

});

function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g,'');

    if(cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;

    return true;

}
