function onAbilityDrop( ev ){
	
}

function onAbilityDrag( ev ){
	ev.dataTransfer.setData("AbiltyPreference", ev.target.id );
}

function onADragOver( ev ){
	ev.preventDefault();
}

//Allows dropping the content element on either the container or content.
function onAbilityDrop( ev ){
	ev.preventDefault();
	var target = ev.target.getAttribute( "id" );
	var dragged = ev.dataTransfer.getData("AbiltyPreference");
	if( dragged != "" ){  //
		var t, s;
		var abilities = document.getElementsByName( "apreferences" );
		var dropzones = document.getElementsByName( "dropzones" );
		
		console.log( target );
		for( var i = 0; i < dropzones.length; i++ ){
			if( dragged == abilities[i].getAttribute( "id") ){
				s = i;
			}

			if( target == abilities[i].getAttribute("id" ) ){  //determine target index, whether dropping on other ability or container
				t = i;
			}
		}
		
		//shift existing priorities
		if( t > s ){
			for( var i = t; i > s; i--){
				dropzones[i-1].appendChild( abilities[i] );
			}
		}
		if( t < s ){
			for( var i = s; i > t; i-- ){
				dropzones[i].appendChild( abilities[i-1] );
			}
		}
		dropzones[t].appendChild( document.getElementById( dragged ));
	}
}