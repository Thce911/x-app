function cuentaElementos(cadena)
{
	return ( cadena == "" ? 0 : new String(cadena).split(",").length );
}

function esSect2(id) {
	if ( typeof(sect2[id]) != "undefined"  ) return true;
	return false;
}
function esSect1(id) {
	if ( typeof(sect1[id]) != "undefined"  ) return true;
	return false;
}
function estaDefinido(id) { return esSect1(id) || esSect2(id); }

function descendientes(id)
{
	if ( estaDefinido(id) == false ) return null;

	if ( esSect2(id) ) {
		// Nivel mas bajo: lista de ids de sect3
		return sect2[id];
	}

	// es un sect1.
	if ( sect1[id] == "" ) return "";

	var s1 = new String(sect1[id]).split(",");

	var elementos = "";
	for(i=0;i<s1.length;i++) {
		elementos += "," + s1[i];
		var hijos = descendientes(s1[i]);
		if ( cuentaElementos(hijos) > 0 ) elementos += "," + hijos;
	}

	return new String(elementos).substr(1,elementos.length);

}


function listToArray(listaElementos)
{
	var hijos = new Array();
	if ( listaElementos == "" ) return hijos;

	var s1 = new String(listaElementos).split(",");
	for(i=0;i<s1.length;i++) hijos[i] = s1[i];
	return hijos;
}


// devuelve los elem de subset que estan en set
function interseccion( sset, ssubset )
{
	if ( sset == "" || ssubset == null) return "";

	var set = new String(sset).split(",");
	var subset = new String(ssubset+",");	//suspend_data empieza por , y acaba sin ella

	var elementos=0;
	for (var i=0;i<set.length;i++ )
	{
		if ( subset.indexOf(","+set[i]+",")!= -1 ) elementos++;
	}
	return elementos;
}



// ------------------ Funciones toc  --------------------------

function decoratoc(total,vistos)
{
  // comprobar con las funciones de  estructura / core lesson
  // 	si se ha visto entero ( endturn.png ) 
  // 	se ha empezado pero no terminado ( edit.png )
  // 	o no se ha visto aun
  document.write("");
  document.write(
	(vistos?(total-vistos?"<i class='fa fa-adjust'></i>":"<i style='padding-left:5px;' class='fa fa-check-circle fa-1x'></i>")://se ha empezado pero no terminado:se ha visto entero
		"") // 	no se ha visto aun
	);
  document.write("");
}


// Variable cache.Guarda si el ultimo elemento procesado de toc a nivel de sect1 estaba completado
var cache_lastSect1Completo = null;

var enlaceAbierto = false;
function elementotoc(id)
{

	// Depende de las variables globales
	//	valorSuspendData : string con cmi.suspend_data
	//	hashmarcas : hash con las marcas individuales de cmi.suspend_data

	if ( !estaDefinido(id) ) {
		//para marcas no incluidas en seguimiento
		document.write("");
		enlaceAbierto = true;
		return;
	}
	var elementos_seccion = id + (descendientes(id)!=""?"," + descendientes(id):"");
	
	var total_elementos_seccion = cuentaElementos(elementos_seccion);
	
	var elementos_vistos = interseccion( elementos_seccion, valorSuspendData );
	

	decoratoc(total_elementos_seccion,elementos_vistos);
	//document.write("(" +  elementos_vistos + " de " + total_elementos_seccion +")" );

	/*if( hashmarcas[id] || seguimientoActivo()==false || cache_lastSect1Completo == true || cache_lastSect1Completo == null) {
		// abre enlace si la marca esta en corelesson o si el 
		// elemento inmediatamente anterior a este en la 
		// estructura del curso esta completado
		document.write("<a href=\""+url+"\">");
		enlaceAbierto = true;
	}else{
		document.write("</div>");	
	}*/

	document.write("");
	enlaceAbierto = true;

	//cache elemento completo
	if (  esSect1(id) ) cache_lastSect1Completo = (total_elementos_seccion==elementos_vistos ? true:false);
	// PENDIENTE HACER LO MISMO PARA SECT2

			
}

function cierreelementotoc(id)
{
	if(enlaceAbierto) {
		document.write("");	
		enlaceAbierto = false;
	}
}