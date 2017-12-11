var cuantasPaginas = 6;

function antesReady(){
	
	//PONGO LOS META
	for(var i=1;i<=cuantasPaginas;i++){
		
		switch(i){
		
		case 1:
			$("#fb5-deeplinking ul").append('<li data-address="page'+i+'" data-page="'+i+'"></li>');
		break;
		
		case cuantasPaginas:
			$("#fb5-deeplinking ul").append('<li data-address="end" data-page="'+i+'"></li>');
		break;
		
		default:
			//SI ES NON
			if(i%2==1){
				$("#fb5-deeplinking ul").append(' <li data-address="page'+(i-1)+'-page'+(i)+'" data-page="'+i+'"></li>');
			//SI ES PAR
			}else{
				$("#fb5-deeplinking ul").append(' <li data-address="page'+(i)+'-page'+(i+1)+'" data-page="'+i+'"></li>');
			}
		
		break;
		
		}//TERMINA SWITCH
	
	var str = '<div style="background-image:url(pages/'+i+'.jpg)" class="">'+
	'<div class="fb5-cont-page-book"> '+
	'<div class="fb5-page-book"> </div>'+
	'<!--<div class="fb5-meta"> <span class="fb5-num">'+i+'</span> </div>-->'+
	'</div>'+
	'</div>';
	
	$("#fb5-book").append(str);
	
	$("#fb5-slider").append('<li class="'+i+'"> <img alt="" src="pages/'+i+'.jpg"> </li>');
	
		
	}//TERMINA FOR
	
}//TERMINA FUNCION