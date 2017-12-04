/*******************************************************************************************************

	scormscriptWrapper v3.0 14/dic/2004 17:29

	Enlace del sco con los scripts de seguimiento.

	Funciones intermedias con reglas de seguimiento determinadas por el contenido.


	Modificaciones (v anterior 2.3BBVA )
	13/dic/2004 17:27
		- Llamada a callSyncFunction cada vez que desde registroAvance se
		  modifica el valor de cmi.core.score.raw

*********************************************************************************************************/

var SCORMSCRIPTWRAPPER = this;
var _Debug = false;

var scormscriptHandler = null;
scormscriptHandler = getScormScript();	// apunta al documento que incluya scormscript.js

/*********************************************************************************************************
 **
 ** 		1. Traspaso de llamadas a scormscript.js
 **		
 **		Se implementan las funciones 
 **
 **			ThrowSCORMEvent()
 **			SetSCORMValue()
 **			GetSCORMValue()
 **			getTotalPag()
 ** 		getMasteryScore()
 **
 *********************************************************************************************************/
function getMasteryScore() {
	if ( scormscriptHandler != null ) return scormscriptHandler.getMasteryScore();
	return 100;
}
function cumple_condiciones_finalizacion() {
	if ( scormscriptHandler != null ) return scormscriptHandler.cumple_condiciones_finalizacion();
	return false;
}
function getTotalPag() {
	if ( scormscriptHandler != null ) return scormscriptHandler.getTotalPag();
	return 0;
}
function getObjetivosObligatorios() {
	if ( scormscriptHandler != null ) return scormscriptHandler.getObjetivosObligatorios();
	return null;
}
function ThrowSCORMEvent(evento, valor) {
	if ( scormscriptHandler != null ) return scormscriptHandler.ThrowSCORMEvent(evento, valor);
}
function SetSCORMValue(variable,valor) {
	if ( scormscriptHandler != null ) return scormscriptHandler.SetSCORMValue(variable,valor);
}
function GetSCORMValue(variable) {
	if ( scormscriptHandler != null ) return scormscriptHandler.GetSCORMValue(variable);
}
function seguimientoActivo() {
	if ( scormscriptHandler != null ) 
		if ( scormscriptHandler.getTrackStyle() != null ) return true;
	return false;
}
function callSyncFunction(valor) {
	if ( scormscriptHandler != null ) return scormscriptHandler.callSyncFunction(valor);
}
/*********************************************************************************************************
 **
 ** 		2. Reglas de seguimiento
 **		
 **		Se implementan las funciones 
 **
 **			guardaMejorNota( nota )
 **			finalizaSiAprobado( nota )
 **			continuarUltimaPagina()
 **
 *********************************************************************************************************/
/******************************************************************************************
**
** Function guardaMejorNota(nota)
** Inputs:	nota - raw score de 0-100
** Return:		true si es almacenada
**			false si no lo es
**			null si no hay seguimiento
** Description:
**   Solo almacena la nota en la plataforma si es mayor que la ya almacenada
**
******************************************************************************************/
function guardaMejorNota(nota)
{
	if ( scormscriptHandler == null ) return null;
	var score = parseInt( GetSCORMValue("cmi.core.score.raw") );
	score = (score>nota?score:nota);
	SetSCORMValue("cmi.core.score.raw",score);
	return (score==nota?true:false);	
}
/******************************************************************************************
**
** Function finalizaSiAprobado(nota)
** Inputs:	nota - raw score de 0-100
** Return:		true si se da por finalizado el seguimiento
**			false si no
**			null si no hay seguimiento
** Description:
**   Envia un event.finish si la nota del alumno es mayor que 'nota', o nada en
**  caso contrario
**
******************************************************************************************/
function finalizaSiAprobado(nota)
{
	if ( scormscriptHandler == null ) return null;

	var score = parseInt( GetSCORMValue("cmi.core.score.raw") );

	if ( score >= nota ) {
		ThrowSCORMEvent('event.finish',null);
		return true;	
		}

	return false;
}
/******************************************************************************************
**
** Function continuarUltimaPagina()
** Inputs: none
** Return: none
** Description:
**   Redirige al navegador a la pagina almacenada en cmi.core.lesson_location
**
******************************************************************************************/
function continuarUltimaPagina()
{
	if ( scormscriptHandler == null ) return null;
	var lastpage = new String(GetSCORMValue('cmi.core.lesson_location'));
	if ( lastpage.indexOf(".htm")!=-1 ) location = lastpage;	
}

/******************************************************************************************
**
** Función registroAvance()
** Descripción:
** 	Esta función representa el progreso de una unidad asignable en la plataforma y 
**  	comprueba que se han visitado todas las páginas antes de dar por finalizada la unidad.
**  	Se utilizan las variables "cmi.suspend_data" para almacenar las páginas y 
**  	"cmi.core.score.raw" para guardar la nota.
**  
*********************************************************************************************/
function registroAvance(pag) // pag: identificador (unico) de pagina
{
	var primeravez = false;
	var sw = 0;
	var result = 0;
	var aux = new String(","+pag);

	var cadena = GetSCORMValue("cmi.suspend_data");
	
	if(cadena == null) return; // Sin seguimiento
	
	var MAXPAG = getTotalPag();

	// Si es la primera vez que se visita la unidad, se almacena el id de la primera página.
	if (cadena=="") {
		SetSCORMValue("cmi.suspend_data",aux);
		primeravez = true;
	}
	
	// Cada vez que se visita una página se comprueba si se ha visitado anteriormente. 	
	cadarray = new String(cadena).split(",");
	for (i=0;i<cadarray.length;i++) {
		if (cadarray[i] == aux.substring(1,aux.length)) {sw = 1;break;}
	}
	
	// Si no se ha visitado la página anteriormente se almacena el id en plataforma.
	if (sw != 1) {
		cadena = cadena + aux;

		result = (cadarray.length)*100 / parseFloat(MAXPAG);
		if( result > 100 ) result=100;

		SetSCORMValue("cmi.suspend_data",cadena);  
		SetSCORMValue("cmi.core.score.raw",""); //Nota: Se quito el valor de parseInt(result) para que no promediara la calificación.
		callSyncFunction(parseInt(result));
	}
	if (cumple_condiciones_finalizacion()) ThrowSCORMEvent('event.finish',null);
}

/*********************************************************************************************************
 **
 ** 		3. Funciones soporte objetivos
 **
 *********************************************************************************************************/

function getObjective(id){if ( scormscriptHandler != null ) return scormscriptHandler.getObjective(id);}
function setObjective(id,score,status){	
	var r;
	if ( scormscriptHandler != null ) r = scormscriptHandler.setObjective(id,score,status);
	if (cumple_condiciones_finalizacion()) ThrowSCORMEvent('event.finish',null);
	return r;
}
function objetivosCompletados(){if ( scormscriptHandler != null ) return scormscriptHandler.objetivosCompletados();}

/*********************************************************************************************************
 **
 ** 		4. Funciones para la localizacion de scormscript
 **
 *********************************************************************************************************/
/******************************************************************************************
**
** Function findScormScript(win)
** Inputs:	win - a Window Object
** Return:	If an SCORMSCRIPT object is found, it is returned, otherwise null is returned.
**
** Description:
** This function looks for an object named SCORMSCRIPT in the supported window hierarchy,
**
******************************************************************************************/
function findScormScript(win)
{

   // Search the window hierarchy for an object named "SCORMSCRIPT"
   // Look in the current window (win) and recursively look in any child frames


   if (_Debug)
   {
      alert("win is: "+win.location.href);
   }


   if (win.SCORMSCRIPT != null)
   {
      if (_Debug)
      {
         alert("found api in this window");
      }
      return win.SCORMSCRIPT;
   }

   if (win.length > 0)  // does the window have frames?
   {
      if (_Debug)
      {
         alert("looking for api in windows frames");
      }

      for (var i=0;i<win.length;i++)
      {

         if (_Debug)
         {
            alert("looking for api in frames["+i+"]");
         }
         var theAPI = findScormScript(win.frames[i]);
         if (theAPI != null)
         {
            return theAPI;
         }
      }
   }

   if (_Debug)
   {
      alert("didn't find api in this window (or its children)");
   }
   return null;

}


/******************************************************************************************
**
** Function getScormScript()
** Inputs:	none
** Return:	If an API object is found, it is returned, otherwise null is returned.
**
** Description:
** This function looks for an object named API, first in the current window's hierarchy,
**  and then, if necessary, in the current window's opener window hierarchy (if there is
**  an opener window).
******************************************************************************************/

function getScormScript()
{

   // start at the topmost window - findScormScript will recurse down through
   // all of the child frames
   var theAPI = findScormScript(this.top);

   if (theAPI == null)
   {
      // the API wasn't found in the current window's hierarchy.  If the
      // current window has an opener (was launched by another window),
      // check the opener's window hierarchy.
      if (_Debug)
      {
         alert("checking to see if this window has an opener");
         alert("window.opener typeof is> "+typeof(window.opener));
      }

      if (typeof(this.opener) != "undefined")
      {
         if (_Debug)
         {
            alert("checking this windows opener");
         }
         if (this.opener != null)
         {
            if (_Debug)
            {
               alert("this windows opener is NOT null - looking there");
            }
            theAPI = findScormScript(this.opener.top);
         }
         else
         {
            if (_Debug)
            {
               alert("this windows opener is null");
            }
         }
      }
   }

   return theAPI;
}

