// JavaScript Document
document.write('<div id="sidebar"  class="nav-collapse hidden-xs hidden-sm">\n'+
'<ul class="sidebar-menu" id="nav-accordion">\n'+
	'<li><a id="MENU" href="menu.html?MENU"> <i class="fa fa-tasks"></i><span>Menú</span></a></li>\n'+

	// 1. Introducción
	'<li class="sub-menu">\n'+ '<a href="javascript:;"><strong>1</strong> <span>Introducción</span></a>\n'+
		'<ul class="sub">\n'+

			'<li><a id="BIE" href="bienvenida.html?BIE">Bienvenida<div class="pull-right"><script>elementotoc("BIE");</script><script>cierreelementotoc("BIE");</script></div></a></li>\n'+

			'<li><a id="COM" href="competencias.html?COM">Competencias<div class="pull-right"><script>elementotoc("COM");</script><script>cierreelementotoc("COM");</script></div></a></li>\n'+

			'<li><a id="MET" href="metodologia.html?MET">Metodología<div class="pull-right"><script>elementotoc("MET");</script><script>cierreelementotoc("MET");</script></div></a></li>'+

		'</ul>\n'+
	'</li>\n'+

	// 2. Contenido
	'<li class="sub-menu">\n'+ '<a href="javascript:;"><strong>2</strong> <span>Contenido</span></a>\n'+
		'<ul class="sub">\n'+

			'<li><a id="CON" href="contexto.html?CON">Contexto<div class="pull-right"><script>elementotoc("CON");</script><script>cierreelementotoc("CON");</script></div></a></li>\n'+

			'<li><a id="T1" href="tema1.html?T1">Tema 1<div class="pull-right"><script>elementotoc("T1");</script><script>cierreelementotoc("T1");</script></div></a></li>\n'+

			'<li><a id="T2" href="tema2.html?T2">Tema 2<div class="pull-right"><script>elementotoc("T2");</script><script>cierreelementotoc("T2");</script></div></a></li>\n'+

			'<li><a id="T3" href="tema3.html?T3">Tema 3<div class="pull-right"><script>elementotoc("T3");</script><script>cierreelementotoc("T3");</script></div></a></li>\n'+

			'<li><a id="T4" href="tema4.html?T4">Tema 4<div class="pull-right"><script>elementotoc("T4");</script><script>cierreelementotoc("T4");</script></div></a></li>\n'+

		'</ul>\n'+
	'</li>\n'+

	// Conclusión
	'<li><a id="COC" href="conclusion.html?COC"><strong>3</strong> <span>Conclusión</span><div class="pull-right"><script>elementotoc("COC");</script><script>cierreelementotoc("COC");</script></div> </a></li>\n'+

'</ul></div>');


var STR = location.href;
var separar = STR.split("?");
var ELEMENTO = document.getElementById(separar[1]);
var padre = ELEMENTO.parentNode.parentNode.parentNode;
var clasepadre = padre.getAttribute('Class');
if (clasepadre == "sub-menu"){
	//padre.firstChild.classList.add("active");
	padre.childNodes[1].classList.add("active");
	ELEMENTO.classList.add("clase2");
	
}else{
	ELEMENTO.classList.add("clase2");
}

// Oculta Menu principal.
function sidebarScript(){
	if ($('#sidebar > ul').is(":visible") === true) {
		$('#main-content').css({
			'margin-left': '0px'
		});
		$('#sidebar').css({
			'margin-left': '-210px'
		});
		$('#sidebar > ul').hide();
		$("#container").addClass("sidebar-closed");
	} else {
		$('#main-content').css({
			'margin-left': '210px'
		});
		$('#sidebar > ul').show();
		$('#sidebar').css({
			'margin-left': '0'
		});
		$("#container").removeClass("sidebar-closed");
	}
  
};
