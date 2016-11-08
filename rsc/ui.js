//$( ".selector" ).spinner({
//spin: function( event, ui ) {}
//});

//$( ".selector" ).on( "spin", function( event, ui ) {} );


//	When document is loaded:
//-------------------------------
$( document ).ready(function() {
	$( "#ability-preference" ).sortable({
		placeholder: "ui-state-highlight"
	});
	$( "#ability-preference" ).disableSelection();
	$( ".accordion" ).accordion();

	var $expandableIO = $('.expandable h3');
	$expandableIO.next('div:gt(0)').hide(); // hide all but first section

	$expandableIO.click(function(){
		var header = $(this);
		var closed = header.is('.expandable-closed');
		if( closed ){
			header.removeClass('expandable-closed');
			header.addClass('expandable-open');
		}
		
		header.find('.icon').toggleClass( "ui-icon ui-icon-triangle-1-e" );
		header.find('.icon').toggleClass( "ui-icon ui-icon-triangle-1-s" );
		$(this).next('div').slideToggle(400, "swing", function(){
			if( !closed ){
				header.removeClass('expandable-open');
				header.addClass('expandable-closed');
			}
		});
	});
	
	//Spinner features
	$( ".class-choice" ).spinner({ 
		max: 20, 
		min: 0
	});
	
	$(".class-choice").width(24);
});
