   

// Datos a modificar:
var titulo_diplomado = "Diplomado en Dirección Estratégica de Ventas";
var titulo_trayecto = "[Nombre del trayecto]";
var titulo_curso = "[Nombre del curso]";
var titulo_curso2 = "[Nombre del curso]";



/***********************************************************************/


// Inserta título del curso en todas las páginas
$("#titulo_diplomado").append(titulo_diplomado);
$("#titulo_trayecto").append(titulo_trayecto);
$("#titulo_curso").append(titulo_curso);
$("#titulo_curso2").append(titulo_curso2);



// Flecha subir al inicio de la página
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});

	$('.scrollup').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});


//Inserta botón Menu en dispositivos
$("#botonMenu").html('<div class="hidden-md hidden-lg"><div class="row"><div class="col-md-12" ><ul class="nav nav-pills"><li role="presentation" class="pull-right"><a style="margin-right:25px" href="menu.html"><i class="fa fa-home"></i> MENU</a></li></ul></div></div></div>');


// Abre modal de créditos
document.body.innerHTML =
'<div id="creditos" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">\n'+
	'<div class="modal-dialog modal-md">\n'+
		'<div class="modal-content">\n'+
			//Título del Modal
			'<div class="modal-header">\n'+
				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n'+
				'<h4 class="modal-title" id="mySmallModalLabel">Créditos</h4>\n'+
			'</div>\n'+
			// Contenido del Modal
			'<div class="modal-body" align="center">\n'+
				'<p><strong>Autor:</strong></p>\n'+
				'<p>[Nombre]<br><br></p>\n'+
				'<p></p>\n'+
				'<p><strong>Equipo de diseño y producción:</strong></p>\n'+
				'<br>\n'+
				'<img class="img-responsive img-rounded" src="comunes/imagenes/logo_tec.png" alt="" style="max-width:259px;"><br>\n'+
				'<p style="font-size:11px;">D.R.© Instituto Tecnológico y de Estudios Superiores de Monterrey, México<br><br></p>\n'+
			'</div>\n'+
			'<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button></div>\n'+
		'</div>\n'+
	'</div>\n'+
'</div>' + document.body.innerHTML;


function creditos2(){
	$("#creditos").modal('show');
}


// Valida que campos de texto no esten vacios
document.body.innerHTML = '<div id="atencion" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="mySmallModalLabel">¡Atención!</h4></div><div class="modal-body"><br><br><p text.align="center">Completa el campo correspondiente para ver la retroalimentación.</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button></div></div></div></div>' + document.body.innerHTML;

function validarCampo(campo,retro){
	var campo = document.getElementById(campo).value;
	
	if (campo == ""){
		$("#atencion").modal('show');
		return false;
	}else{				
		$(retro).modal('show');
	}
}

// tooltip de tipo de recursos      
$(window).load(function() {
   $('.botonmenu').tooltip({
		placement : 'right',
		title : 'Ocultar menú / Desplegar menú'
	});
});


//Inserta leyenda continuar en el siguiente subtema o tema
$("#contexto").html('<div class="alert alert-info pull-right" role="alert"><i class="fa fa-exclamation-circle"></i>  Has concluido con el estudio del contexto.</div>');

$("#sig_subtema").html('<div class="alert alert-info pull-right" role="alert"><i class="fa fa-exclamation-circle"></i>  Continúa con el estudio del siguiente subtema.</div>');

$("#sig_tema").html('<div class="alert alert-info pull-right" role="alert"><i class="fa fa-exclamation-circle"></i>  Has concluido con el estudio del tema.</div>');

//Inhabilita copiar textos de las páginas
document.oncontextmenu = function(){return false}
document.onselectstart=function(){return false}
//document.onmousedown=function(){return false}