/*************************************************************
 	v2003.10.22

	Compatibilidad IE5, IE6, NS7.01

*************************************************************/
var ns4 = (document.layers)?true:false;
var ie4 = (document.all)?true:false;
var moz = (navigator.userAgent.toLowerCase().indexOf("gecko")>-1)?true:false;

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_nbGroup(event, grpName) { //v6.0

  var i,img,nbArr,args=MM_nbGroup.arguments;
  if (event == "init" && args.length > 2) {
    if ((img = MM_findObj(args[2])) != null && !img.MM_init) {
      img.MM_init = true; img.MM_up = args[3]; img.MM_dn = img.src;
      if ((nbArr = document[grpName]) == null) nbArr = document[grpName] = new Array();
      nbArr[nbArr.length] = img;
      for (i=4; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
        if (!img.MM_up) img.MM_up = img.src;
        img.src = img.MM_dn = args[i+1];
        nbArr[nbArr.length] = img;
    } }
  } else if (event == "over") {
    document.MM_nbOver = nbArr = new Array();
    for (i=1; i < args.length-1; i+=3) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = (img.MM_dn && args[i+2]) ? args[i+2] : ((args[i+1])? args[i+1] : img.MM_up);
      nbArr[nbArr.length] = img;
    }
  } else if (event == "out" ) {
    for (i=0; i < document.MM_nbOver.length; i++) {
      img = document.MM_nbOver[i]; img.src = (img.MM_dn) ? img.MM_dn : img.MM_up; }
  } else if (event == "down") {
    nbArr = document[grpName];
    if (nbArr)
      for (i=0; i < nbArr.length; i++) { img=nbArr[i]; img.src = img.MM_up; img.MM_dn = 0; }
    document[grpName] = nbArr = new Array();
    for (i=2; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = img.MM_dn = (args[i+1])? args[i+1] : img.MM_up;
      nbArr[nbArr.length] = img;
  } }
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function newWindow(url,name,w,h)
 {
 LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
 var win_opt = "screenX=0,screenY=0,left=" + LeftPosition + ",top=" + TopPosition + ",toolbar=0,menubar=0,location=0, directories=0, status=0,";
 win_opt += "scrollbars=1, resizable=1, copyhistory=0,";
 win_opt += "width=" + w + ",height=" + h;
 msgWindow = window.open(url,name,win_opt);
 msgWindow.focus();
 }
  
function newWindow2(url,name,w,h)
 {
 LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
 var win_opt = "screenX=0,screenY=0,left=" + LeftPosition + ",top=" + TopPosition + ",toolbar=0,menubar=0,location=0, directories=0, status=0,";
 win_opt += "scrollbars=0, resizable=0, copyhistory=0,";
 win_opt += "width=" + w + ",height=" + h;
 msgWindow = window.open(url,name,win_opt);
 msgWindow.focus();
 }

function verif01() {
 if (document.forma.preg1.value=="0" || document.forma.preg2.value=="0" || document.forma.preg3.value=="0" || document.forma.preg4.value=="0" || document.forma.preg5.value=="0")
    {
	alert('Para ver la retroalimentación debes contestar todas las preguntas'); 
	}
	else
	{
	document.location.href = 'ar01s05s02sid01.html';
	}
}

function verif02() {
 if (document.forma.preg1.value=="" || document.forma.preg2.value=="" || document.forma.preg3.value=="" || document.forma.preg4.value=="" || document.forma.preg5.value=="" || document.forma.preg6.value=="")
    {
	alert('Para ver la retroalimentación debe contestar todas las preguntas'); 
	}
	else
	{
	document.location.href = 'ar01s03s05sid01.html';
	}
}


function verif03() {
	if ((document.forma.checkbox1.checked == false)&&(document.forma.checkbox2.checked == false)&&(document.forma.checkbox3.checked == false)&&(document.forma.checkbox4.checked == false)&&(document.forma.checkbox5.checked == false)&&(document.forma.checkbox6.checked == false))
    {
		alert('Para ver la retroalimentación debes realizar la actividad'); 
	}
	else
	{
		document.location.href = 'ar01s04s05sid02.html';
	}
}