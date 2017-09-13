$(document).ready(function () {
    $('#country-codes li a').on('click', function () {
        $('span.value').text($(this).attr('value'));
        $('span.bandera').empty();
        if ($(this).attr('value') == "+51") {
            $('span.bandera').append($('<img src="assets/img/peru.png" width="25px">'));
            $('input').attr('pattern', '[0-9]{2} [0-9]{9}');
            $('input').attr('placeholder', '+51 989999999');
        } else if ($(this).attr('value') == "+56") {
            $('span.bandera').append($('<img src="assets/img/mexico.png" width="25px">'));
            $('input').attr('placeholder', '+56-11234567');
        } else if ($(this).attr('value') == "+52") {
            $('span.bandera').append($('<img src="assets/img/chile.png" width="25px">'));
            $('input').attr('placeholder', '+52 125-345-3455');
        }

    });

    $('#num-aleatorio').on('click', function () {
        let myNumero = Math.floor(Math.random() * 899) + 100;
        $('#cod').append("<h4>LAB-" + myNumero + "</h4>");
        $('#gd-id').on('click', function () {
            let allNum = [];
            let data = [];
            data.push(myNumero);
            allNum.push(data);
            allNum = JSON.stringify(allNum);
            console.log(allNum)
            localStorage.setItem('codus',allNum);
            
        });
    });
    
    $('#registra').on('click',function(){
        let allDatos = [];
        let datos = [];
        datos.push($('#username').val());
        datos.push($('#usermail').val());
        allDatos.push(datos);
        listJson = JSON.stringify(alldatos);
        localStorage.setItem('lista',listJson);
        JSON.parse(listJson);
    });
    
});
