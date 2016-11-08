var adept_spd = [

	//	0 	1	2	3	4	5
	[	3, 1 ], //1
	[	3, 1 ], //2
	[	3, 2 ], //3
	[	3, 2,	0 ], //4
	[	3, 2,	1 ], //5
	[	3, 2,	1 ], //6
	[	3, 3,	2 ], //7
	[	3, 3,	2, 0 ], //8
	[	3, 3,	2, 1 ], //9
	[	3, 3,	2, 1 ], //10
	[	3, 3,	3, 2 ], //11
	[	3, 3,	3, 2, 0 ], //12
	[	3, 3,	3, 2, 1 ], //13
	[	3, 3,	3, 2, 1 ], //14
	[	3, 3,	3, 2, 2 ], //15
	[	3, 3,	3, 2, 2, 0 ], //16
	[	3, 3,	3, 2, 2, 1 ], //17
	[	3, 3,	3, 2, 2, 1 ], //18
	[	3, 3,	3, 2, 3, 2 ], //19
	[	3, 3,	3, 2, 3, 2 ], //20
];

var slow_spd = [
	[],
	[],
	[],
	[0, 0],
	[0, 1],  //5
	[0, 1],
	[0, 1, 0],
	[0, 1, 1],
	[0, 2, 1],
	[0, 2, 1, 0],  //10
	[0, 2, 1, 1],
	[0, 2, 2, 1],
	[0, 3, 2, 1, 0],
	[0, 3, 2, 1, 1],
	[0, 3, 2, 2, 1], //15
	[0, 3, 3, 2, 1],
	[0, 4, 3, 2, 1],
	[0, 4, 3, 2, 2],
	[0, 4, 3, 3, 2],
	[0, 4, 3, 3, 3] //20
];

var SpellsPerDay

function bonusSpellsAtSlot( spell_level, ability_score ){
	
	if( spell_level == 0 ){
		return 0;	//never get bonus spells
	}
	
	return Math.max( 0, Math.floor( ( ability_score - (2 * (spell_level+1) ) ) /8 ) );  //algebra is shorter than that giant table 
}

function Spells( level, slots, dc){
	this.level = level;
	this.slots = slots;
	this.dc = dc;
}

//	Returns an array of Spells
//
function createSpellSlots( spells_per_day, level, ability_score ){
	
	var spd = spells_per_day[level-1];
	var castable = ability_score - 10;
	var spells = [];
	
	for( var sl = 0; sl < spd.length; sl ++){
		if( castable >= sl ){  // can cast
			
			var slots = spd[ sl ] + bonusSpellsAtSlot( sl, ability_score );
			var dc = 10 + sl + Math.floor( (ability_score - 10) /2 );
			
			if( slots > 0 ){
				spells.push( new Spells( sl, slots, dc ));
			}
		}
	}
	
	return spells;
}

//	Returns an array of Spells ... and a name?
//
function createSpellSlotsWithName( name, spells_per_day, level, ability_score ){
	
	var spd = spells_per_day[level-1];
	var castable = ability_score - 10;
	var spells = [];
	
	spells.push( name );
	
	for( var sl = 0; sl < spd.length; sl ++){
		if( castable >= sl ){  // can cast
			
			var slots = spd[ sl ] + bonusSpellsAtSlot( sl, ability_score );
			var dc = 10 + sl + Math.floor( (ability_score - 10) /2 );
			
			if( slots > 0 ){
				spells.push( new Spells( sl, slots, dc ));
			}
		}
	}
	
	return spells;
}