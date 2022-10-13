function isEmail(email) {
    var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return EmailRegex.test(email);
}

function validateForm(mobile) {
    var concatMobile="";
    if(mobile) {
        concatMobile = "_MOBILE";
    }
    message = 'Por favor, informe: ';
    erros = 0;

    nome_val = document.getElementById("NOME"+concatMobile).value;
    if (nome_val === "") {
        message += '<br /> - Seu nome.';
        erros += 1;
    }

    email_val = document.getElementById("EMAIL"+concatMobile).value;
    if (!isEmail(email_val)) {
        message += '<br /> - Seu melhor e-mail.';
        erros += 1;
    }

    telefone_val = document.getElementById("NOME"+concatMobile).value;
    if (telefone_val === "") {
        message += '<br /> - Seu telefone.';
        erros += 1;
    }

    cnpj_val = document.getElementById("CNPJ"+concatMobile).value;
    if(cnpj_val != "" && !validarCNPJ(cnpj_val)) {
        message += '<br /> - CNPJ válido.';
        erros += 1;
    }

    if (erros > 0) {
        showSnack(message);
        return false;
    } else {
        envia_dados(mobile);
        return true;
    }
}

document.getElementById('form-facrisa').onsubmit = function (event) {
    event.preventDefault();
    validateForm(false);
};

document.getElementById('form-facrisa-mobile').onsubmit = function (event) {
    event.preventDefault();
    validateForm(true);
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

function buscaCep(mobile) {
    var concatMobile="";
    if(mobile) {
        concatMobile = "_MOBILE";
    }

    cep_val = document.getElementById("CEP"+concatMobile).value;

    let cep_field = cep_val.replace('-', '');
    if(cep_field.length == 8) {
        let url = 'https://viacep.com.br/ws/' + cep_field + '/json';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status = 200) {
                    json = JSON.parse(xhr.responseText);
                    if(!Boolean(json.erro)) {

                        if(document.getElementsByClassName('form-input-endereco'+concatMobile).length>0) {
                            cepField = document.getElementsByClassName('form-input-endereco'+concatMobile)[0];
                            cepField.classList.remove('form-input-endereco'+concatMobile);
                            cepField.classList.add('form-input-endereco'+concatMobile+'-active');
                        }
                        document.getElementById("ENDERECO"+concatMobile).value = json.logradouro;
                        document.getElementById("BAIRRO"+concatMobile).value = json.bairro;
                        document.getElementById("CIDADE"+concatMobile).value = json.localidade;
                        document.getElementById("ESTADO"+concatMobile).value = json.uf;

                        if(mobile) {
                            document.getElementById("NOME_MOBILE").scrollIntoView({behavior: 'smooth'});
                        }
                        document.getElementById("NUMERO"+concatMobile).focus();
                    }
                }
            }
        }
        xhr.send();
    }
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

function envia_dados(mobile) {

    showSnack('Enviando...', 'darkhakki');

    let url = 'service.php';
    let xhr = new XMLHttpRequest();

    if(mobile) {
        concatMobile = "_MOBILE";
    }

    var params = new Object();
    params.NOME = document.getElementById("NOME"+concatMobile).value;
    params.EMAIL = document.getElementById("EMAIL"+concatMobile).value;
    params.TELEFONE = document.getElementById("TELEFONE"+concatMobile).value;
    params.CEP = document.getElementById("CEP"+concatMobile).value;
    params.ENDERECO = document.getElementById("ENDERECO"+concatMobile).value;
    params.NUMERO = document.getElementById("NUMERO"+concatMobile).value;
    params.COMPLEMENTO = document.getElementById("COMPLEMENTO"+concatMobile).value;
    params.BAIRRO = document.getElementById("BAIRRO"+concatMobile).value;
    params.CIDADE = document.getElementById("CIDADE"+concatMobile).value;
    params.ESTADO = document.getElementById("ESTADO"+concatMobile).value;
    params.CNPJ = document.getElementById("CNPJ"+concatMobile).value;


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

function inputHandler(masks, max, event, mobile) {
    var c = event.target;

    if(c) {
        var v = c.value.replace(/\D/g, '');
        var m = c.value.length > max ? 1 : 0;
        VMasker(c).unMask();

        VMasker(c).maskPattern(masks[0]);
        c.value = VMasker.toPattern(v, masks[0]);
    }

    if(c.id=='CEP' || c.id == 'CEP_MOBILE') {
        handleCep(c.id == 'CEP_MOBILE');
    }
}

function handleCep(mobile) {
    var concatMobile="";
    if(mobile) {
        concatMobile = "_MOBILE";
    }
    let cep_val = document.getElementById("CEP"+concatMobile).value;

    let cep_field = cep_val.replace('-', '');

    if(cep_field.length == 8) {
        buscaCep(mobile);
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    var telMask = ['(99) 99999-9999'];
    var tel = document.querySelector('#TELEFONE');
    VMasker(tel).maskPattern(telMask[0]);
    tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

    var telMob = document.querySelector('#TELEFONE_MOBILE');
    VMasker(telMob).maskPattern(telMask[0]);
    telMob.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

    var docMask = ['99.999.999/9999-99'];
    var doc = document.querySelector('#CNPJ');
    VMasker(doc).maskPattern(docMask[0]);
    doc.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);
    var docMob = document.querySelector('#CNPJ_MOBILE');
    VMasker(docMob).maskPattern(docMask[0]);
    docMob.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);

    var cepMask = ['99999-999'];
    var cep = document.querySelector('#CEP');
    VMasker(cep).maskPattern(cepMask[0]);
    cep.addEventListener('input', inputHandler.bind(undefined, cepMask, 8), false);

    var cepMob = document.querySelector('#CEP_MOBILE');
    VMasker(cepMob).maskPattern(cepMask[0]);
    cepMob.addEventListener('input', inputHandler.bind(undefined, cepMask, 8), false);


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
