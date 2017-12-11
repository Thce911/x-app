/**********************************************************************************************************
	
	scormscript.js  3.0 14/dic/2004 17:29	

	Modificaciones (v.anterior 2.3BBVA) :

	13/dic/2004 17:26
		- Llamada a funcion sincronizacion : callSyncFunction
		  callSyncFunction debe apuntar a una funcion del curso establecida
		  al inicio
		- cumple_condiciones_finalizacion() : valida las paginas, los objetivos,...Determina
		  si la leccion debe marcarse como completa

**********************************************************************************************************/
var _debug = false;
var SCORMSCRIPT = this;
var frame_contenido = null;	
var flag_completed = false;

/*********************************************************************************************************
 ** 		1. Llmamadas de seguimiento realizadas desde el SCO
 **			Initialize()
 **			ThrowSCORMEvent()
 **			SetSCORMValue(event.lmsfinish|event.finish|event.commit)
 **			GetSCORMValue()
 **			Finalize()
 *********************************************************************************************************/
function getTotalPag() {return totalPag;}

function getObjetivosObligatorios() {
	if ( typeof(objetivos_obligatorios) == "undefined" ) return null;
	return objetivos_obligatorios;
}
function getMasteryScore()
{
	var ms = parseInt(GetSCORMValue("cmi.student_data.mastery_score"),10);
	if ( isNaN(ms) ) return 100;
	if ( ms>100) return 100;
	return ms;
}
function cumple_condiciones_finalizacion()
{
	// Tanto si el porcentaje ha llegado al 100% o se han visitado todas las páginas,
	// se da la unidad asignable por finalizada.

	var MAXPAG        = getTotalPag();  //maxpag: Número total de páginas que tiene la unidad asignable.
	var MASTERY_SCORE = getMasteryScore();
	var score         = GetSCORMValue('cmi.core.score.raw');
	var suspend_data  = GetSCORMValue("cmi.suspend_data");

	// sea cadena null o "" length =1. Numero de marcas = length-1
	var cadarray = new String(suspend_data).split(",");
	var num_paginas = cadarray.length-1;
	
	//alert("condiciones:" + num_paginas + " de " + MAXPAG + ", % " + score + "(" + MASTERY_SCORE + ")" );
	if ( (score >= MASTERY_SCORE) || ( num_paginas>=MAXPAG )) 
	{
		// Antes de finalizar, ver si estan los objetivos obligatorios...
		if ( objetivosCompletados() == true ) return true;
	}
	return false;
}
function Initialize(fp,inicio)
{
	if (!inicio) {
		alert("scormscript:Pagina de inicio no definida");
		return;
	}

	var inicializado = false;
	inicializado = eventInitialize();

	if ( inicializado && fp ) {
		frame_contenido = fp;

		if(cargaLessonLocation)	{
			ultimaPagina = new String(GetSCORMValue("cmi.core.lesson_location"));
			if ( ultimaPagina.indexOf(".htm")!=-1 )
				fp.location = ultimaPagina;
			else 
				fp.location.href = inicio
			}
		else
			fp.location.href = inicio

		// PEND:Sincronizacion con frameset y el registro de la funcion!
		// seria un argumento de initialize
		callSyncFunction(parseInt(GetSCORMValue('cmi.core.score.raw')));
		
		// Prototipos
		var MAXPAG = getTotalPag();
		var cadena = GetSCORMValue("cmi.suspend_data");
		if(cadena == null) return; // Sin seguimiento
		if(cadena == "") return; // Sin seguimiento
		cadarray = new String(cadena).split(",");
		var result = (cadarray.length-1)*100 / parseFloat(MAXPAG);
		callSyncFunction(parseInt(result));
		// Prototipos
	}
	else {
		fp.location.href = inicio;
	}
}
function Finalize()
{
	if (cumple_condiciones_finalizacion()) ThrowSCORMEvent('event.finish',null);
	ThrowSCORMEvent("event.lmsfinish",null);
}
//Funcion de sincronizacion de nota/progreso
function callSyncFunction(nota)
{
	if( typeof(syncFunction)=='undefined') return;
	if ( syncFunction == null ) return;
	eval("syncFunction("+nota+")");
}
function ThrowSCORMEvent(evento, valor)
{
   	if(_debug) alert("SCO:ThrowSCORMEvent( "+evento+" , "+valor+" )");

   	if ( evento == "event.commit" )	{
        	eventCommit(flag_completed);
	 	if ( valor != null ) window.location.href=valor;
   	}
   	if ( evento == "event.lmsfinish" || evento == "event.abort" ) {
	        eventCommit(flag_completed);
	        eventFinish();
	 	if ( valor != null ) window.location.href=valor;
   	}
   	else if ( evento == "event.finish" ) {
		flag_completed = true;
   	}
}
function SetSCORMValue(variable,valor) { return eventSetSCORMValue(variable,valor); }
function GetSCORMValue(variable)       { return eventGetSCORMValue(variable);       }

/*********************************************************************************************************
 ** 		2. Seguimiento API/HACP
 *********************************************************************************************************/
/*********************************************************************************************************
 ** 		2.1. Determinar el tipo de seguimiento : hacp o api
 *********************************************************************************************************/
// Variables

var seguimiento_api = null; 	// null : sin seguimiento
				// true : api
				// false: hacp
var apiWrapper = null;		// handle para apiWrapper.js
var hacpWrapper = null;		// handle para hacpWrapper.js

/***************************************************************************
 *	getTrackStyle()
 *
 *	Devuelve 
 *		true : API
 *		false : HACP
 *		null : sin seguimiento
 *
 *	Establece los valores para apiWrapper y hacpWrapper
 ***************************************************************************/
function getTrackStyle()
{
	if ( seguimiento_api == null ) 
	{
		apiWrapper = getAPIWrapperHandle();
		if (apiWrapper!=null) 
		{
			// Ver si apiWrapper encuentra el API proporcionado por el LMS
			if ( apiWrapper.getAPIHandle() != null ) return true;
		}
		hacpWrapper = getHACPWrapperHandle();
		if (hacpWrapper!=null) return false;
	}

	return seguimiento_api;
}
/*************************************************************************************************
 **
 **	2.2 Interactuacion con los sistemas API/HACP de seguimiento
 **		eventInitialize()
 **		eventFinish()
 **		eventSetSCORMValue()
 **		eventGetSCORMValue()
 *************************************************************************************************/

// Variables
var estado_Initialized = false;		// true si se ha establecido comunicacion con LMS
var estado_Finished = false;		// true si se ha finalizado el seguimiento
var startDate = null;			// tiempo de inicio del seguimiento

// Variables para el protocolo AICC
var API_STATUS_PASSED     	= "passed";
var API_STATUS_COMPLETED  	= "completed";
var API_STATUS_INCOMPLETE 	= "incomplete";
var API_STATUS_NOT_ATTEMPTED 	= "not attempted";

/***************************************************************************
 * 	eventInitialize()
 *
 *	Inicio del seguimiento
 * 	Devuelve:
 * 	 true:seguimiento iniciado
 * 	 false:seguimiento no iniciado
 ***************************************************************************/
function eventInitialize()
{
	seguimiento_api = getTrackStyle();

	if (_debug) 
		alert( "Seguimiento " + (seguimiento_api==null?"deshabilitado":(seguimiento_api?"API":"HACP")));

	if ( seguimiento_api == null )	return false; // Sin seguimiento

	if ( seguimiento_api )
	{
		estado_Initialized = apiWrapper.LMSInitialize("");
		
		if (_debug) { 
	  		var status = apiWrapper.LMSGetValue("cmi.core._children");
			alert("Valores API implementados en LMS : " +status);
		}

  		var status = apiWrapper.LMSGetValue("cmi.core.lesson_status");
		if (_debug) alert("Estado ultimo de la leccion : " + status );
      		if (status == apiWrapper.API_STATUS_NOT_ATTEMPTED)
		{
        		apiWrapper.LMSSetValue( "cmi.core.lesson_status", API_STATUS_INCOMPLETE );
		}
	}
	else
	{
		// leer los argumentos url [ NOTA:scormscript.js debe estar en
		//				un lugar donde lleguen los parametros
		//				si se usa hacp!!!! ]
		var url_aicc_url = getUrlArgument("AICC_URL",false);
		var url_aicc_sid = getUrlArgument("AICC_SID",false);
		//var url_curso    = getUrlArgument("curso",false);    ///?

		if ( url_aicc_url == "" || url_aicc_sid == "" ) 
		{
			if(_debug) alert("Error en los parametros para hacp");
			estado_Initialized = false;
		}
		else {
			if ( url_aicc_url.search("http")!=0 ) {
				url_aicc_url="http://".concat(url_aicc_url);
			}
			estado_Initialized = hacpWrapper.HACPInitialize(url_aicc_url,url_aicc_sid);
		}
	}
	if ( _debug ) 
	{		
		if ( estado_Initialized == false )
			alert("Error inicializando seguimiento.");
		else
			alert("Seguimiento " + (seguimiento_api?"API":"HACP") + " inicializado")
	}


	// Empieza a contar el tiempo
	startDate = new Date().getTime();

	return estado_Initialized;
}

/***************************************************************************
 *	eventCommit()
 *
 * 	Escribe tiempo,estado leccion y realiza commit
 *	Si leccion_finalizada = true  => leccion terminada
 *	Si leccion_finalizada = false => leccion abortada
 ***************************************************************************/
function eventCommit(leccion_finalizada)
{
	if ( estado_Finished ) 
	{
		if ( _debug ) alert("El seguimiento ya ha finalizado");
		return;
	}	

   	seguimiento_api = getTrackStyle();
   	if ( seguimiento_api == null )	return;

	// Almacenar la ultima pagina visitada. Si ha completado la leccion (en esta sesion) no la guarda

	if ( frame_contenido != null )	{
		SetSCORMValue("cmi.core.lesson_location", (leccion_finalizada?"":frame_contenido.location.href) );
	}
		
	// comprobar que se hayan visto todos los objetivos
	//??? if ( objetivosCompletados() == false ) SetSCORMValue("cmi.core.lesson_status","incomplete");

	if (seguimiento_api) {
		var completed = (leccion_finalizada?API_STATUS_COMPLETED:apiWrapper.LMSGetValue("cmi.core.lesson_status"));
	    	if ( completed != API_STATUS_COMPLETED &&  completed != API_STATUS_PASSED ) {
			apiWrapper.LMSSetValue( "cmi.core.lesson_status", API_STATUS_INCOMPLETE );
		}
		else {
			apiWrapper.LMSSetValue( "cmi.core.lesson_status", completed );
		}
		apiWrapper.LMSSetValue( "cmi.core.session_time", timeSpan(startDate) );
		apiWrapper.LMSCommit();
	}
	else {
		hacpWrapper.HACPCommit(leccion_finalizada,timeSpan(startDate));
	}

}
function eventFinish(leccion_finalizada)
{
	if ( estado_Finished ) 	{
		if ( _debug ) alert("El seguimiento ya ha finalizado");
		return;
	}
   	seguimiento_api = getTrackStyle();
   	if ( seguimiento_api == null )	return;

	//apiWrapper.LMSSetValue( "cmi.core.exit", "" );
  	estado_Finished = (seguimiento_api?apiWrapper.LMSFinish():hacpWrapper.HACPFinish());
}
function eventSetSCORMValue(variable,valor)
{
	if ( estado_Finished ) {
		if ( _debug ) alert("El seguimiento ya ha finalizado");
		return;
		}
	seguimiento_api = getTrackStyle();

   	if ( seguimiento_api == null ) return; // NO HAY SEGUIMIENTO

 	if ( seguimiento_api ) 	{
		//FALTA: Verificar que la plataforma soporta la propiedad
		apiWrapper.LMSSetValue(variable,valor);
		apiWrapper.LMSCommit()
		}
	else {
		hacpWrapper.HACPSetValue(variable,valor);
		}
}
function eventGetSCORMValue(variable)
{
	if ( estado_Finished ) {
		if ( _debug ) alert("El seguimiento ya ha finalizado");
		return;
	}
	seguimiento_api = getTrackStyle();

   	if ( seguimiento_api == null ) return null; // NO HAY SEGUIMIENTO

 	if ( seguimiento_api ) 	{
		//FALTA: Verificar que la plataforma soporta la propiedad
		return apiWrapper.LMSGetValue(variable);
		}
	else {
		return hacpWrapper.HACPGetValue(variable);
		}
}
/*********************************************************************************************************
 **
 ** 		3. Funciones soporte objetivos
 **
 *********************************************************************************************************/
function Objective(index,id,score,status)
{
	this.index=index;
	this.id=id;
	this.score=score;
	this.status=status;
}
function getObjectiveIndexByName(id)
{
	total = parseInt(GetSCORMValue("cmi.objectives._count"),10);
	if(isNaN(total)) return -1;
	for(var i=0;i<total;i++) 
	{
		if ( GetSCORMValue("cmi.objectives."+i+".id") == id ) return i;
	}
	return -1;
}
function getObjective(id)
{
	if ( (index = getObjectiveIndexByName(id)) == -1 ) return null;
	
	return new Objective(
			index,
			GetSCORMValue("cmi.objectives."+index+".id"),
			GetSCORMValue("cmi.objectives."+index+".score.raw"),
			GetSCORMValue("cmi.objectives."+index+".status"));
}
function setObjective(id,score,status)
{
	var index = getObjectiveIndexByName(id);

	if ( index == -1 ) index = parseInt(GetSCORMValue("cmi.objectives._count"),10);
	if ( isNaN(index) ) return null;
	
	SetSCORMValue('cmi.objectives.'+index+'.id',	   id);
	SetSCORMValue('cmi.objectives.'+index+'.score.raw',parseInt(score,10));
	SetSCORMValue('cmi.objectives.'+index+'.status',   status);

	return new Objective(index,id,score,status);
}
function objetivosCompletados()
{
	var objetivos_obligatorios = getObjetivosObligatorios();
	if ( objetivos_obligatorios == null ) { alert("error leyendo declaracion objetivos obligatorios");return true;}

	for(var i=0; i<objetivos_obligatorios.length ; i++)
		if( getObjective(objetivos_obligatorios[i]) == null ) return false;

	return true;
}
/*********************************************************************************************************
 **
 ** 		2.3 Funciones para la localizacion de APIWrapper y HACPWrapper
 **
 *********************************************************************************************************/
var _finddebug = false;

/******************************************************************************
**
** Function getAPIWrapperHandle()
** Inputs:  None
** Return:  value contained by APIHandle
**
** Description:
** Returns the handle to API object if it was previously set,
** otherwise it returns null
**
*******************************************************************************/
function getAPIWrapperHandle()
{
   if (apiWrapper == null)
   {
      apiWrapper = getVar("APIWRAPPER");
   }

   return apiWrapper;
}

/******************************************************************************
**
** Function getHACPWrapperHandle()
** Inputs:  None
** Return:  value contained by HACPHandle
**
** Description:
** Returns the handle to API object if it was previously set,
** otherwise it returns null
**
*******************************************************************************/
function getHACPWrapperHandle()
{
   if (hacpWrapper == null)
   {
      hacpWrapper = getVar("HACPWRAPPER");
   }

   return hacpWrapper;
}
function varFinder(win,vn)
{

   // Search the window hierarchy for an object named vn  
   // Look in the current window (win) and recursively look in any child frames   

   if (win[vn] != null)
   {
      return win[vn];
   }

   if (win.length > 0)  // does the window have frames?
   {
      for (var i=0;i<win.length;i++)
      {
         var theAPI = varFinder(win.frames[i],vn);
         if (theAPI != null)
         {
            return theAPI;
         }
      }
   }

   return null;
}
function getVar(vn)
{

   // start at the topmost window - findAPI will recurse down through
   // all of the child frames
   var theAPI = varFinder(this.top,vn);

   if (theAPI == null)
   {
      // the API wasn't found in the current window's hierarchy.  If the
      // current window has an opener (was launched by another window),
      // check the opener's window hierarchy. 
      if (typeof(this.opener) != "undefined")
      {
         if (this.opener != null)
         {
            theAPI = varFinder(this.opener.top,vn);
         }
      }
   }
   return theAPI;
}
/*********************************************************************************************************
 **
 ** 		2.4 Parse Argumentos de la url
 **
 *********************************************************************************************************/
// arg : nombre del argumento
// caseSensitive : true => case sensitive

function getUrlArgument( arg,caseSensitive )
{
	var start;
	var result = "";
	arg = unescape( arg + "=" );
	var argumentos = unescape(document.URL);

	if ( caseSensitive )
		start = argumentos.indexOf( arg );
	else 
		start = argumentos.toUpperCase().indexOf( arg.toUpperCase() );

	if ( start != -1 )
	{
		argumentos = argumentos.substring( start + arg.length );
		var end = argumentos.indexOf( "&" );
		if ( end != -1 )
		{
			argumentos = argumentos.substring( 0, end );
		}
		result = argumentos;
	}
	return result;
}
function trimSpaces(wordIn)
{
  if(! wordIn) return "";
  retVal = new String(wordIn);
  while(retVal.charAt(0)==" ") retVal = retVal.substring(1,retVal.length-1);
  while(retVal.charAt(retVal.length)==" ") retVal = retVal.substring(0,retVal.length-1);
  return retVal;
}
/**************************************************************************************************
 ** 		2.4. Calculo del tiempo
 *************************************************************************************************/
function convertTotalSeconds(ts) {
	var remainder = ts%3600;                                     
  	var hours = "" + (ts - remainder)/3600;
  	remainder=remainder%60;
	var minutes = "" +  (ts - hours*3600 - remainder)/60;
	var seconds = "" + Math.round(remainder);                      
	if(seconds == "60") {
		seconds = "00";
		minutes = "" + (minutes + 1);
		}
	while (hours.length < 2) {hours = "0" + hours;}
	while (minutes.length < 2) {minutes = "0" + minutes;}
	while (seconds.length <2) {seconds = "0" + seconds;}
	return hours + ":" +minutes + ":" + seconds;
}
function timeSpan( startTime ) {
	var time = "00:00:00";
	if ( startTime != 0 && startTime != null ) {
    		var endTime = new Date().getTime();
    		var seconds = ( (endTime - startTime) / 1000 );
    		time = convertTotalSeconds( seconds );
		}
 	return time;
}
