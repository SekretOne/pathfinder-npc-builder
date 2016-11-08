var races = [
	"human",
	"elf",
	"dwarf",
	"halfling",
	"half elf",
	"half orc" ];

var standardArray = [ 13, 12, 11, 10, 9, 8 ];  //standard stat array
var eliteArray = [15, 14, 13, 12, 10, 8];
var abilities = ["str", "dex", "con", "int", "wis", "cha"];

//xp rewards starting at 1/3
var xpRewards = [
	135, 200, 400, 600, 800, 1200, 1600, 2400, 3200, 4800, 6400, 9600,
	12800, 19200, 52600, 38400, 51200, 76800, 102400, 153600, 204800,
	307200, 409600, 614,400, 819200, 1228800, 1638400 ];

//Human Readable constants
var STR = 0;
var DEX = 1;
var CON = 2;
var INT = 3;
var WIS = 4;
var CHA = 5;

function NPC(){
	
	this.cr ;
	this.xp =0;
	this.level =0;
	this.flagNPCorCore;
	
	this.feats =0;
	this.featsNotes = [];
	
	this.priorities = [];
	this.scores = [];
	this.mods = [];
	
	//this.skills = createSkillBlock();
	this.skillBlock = new SkillBlock();
	this.skillNotes = [];
	this.skillPoints = 0;
	this.skillPointsNotes = [];
	
	this.bab = 0;
	this.cmb = 0;
	this.cmbNotes = [];
	this.cmd = 10;
	this.cmdNotes = [];
	this.meleeBonus = 0;
	this.meleeDamage = 0;
	this.rangedBonus = 0;
	this.combatNotes = [];
	
	this.ac = 10;
	this.flat = 10;
	this.touch = 10;
	this.acNotes = [];
	
	this.fort = 0;
	this.ref = 0;
	this.will = 0;
	this.savesNotes = [];
	
	this.race;
	this.size = 0;
	this.sizeNotes = [];
	
	this.spellBlocks = [];
	
	this.classes = [];
	this.levelOfClasses = [];
	
	this.otherNotes = [];
	
	this.addDarkvision = function( distance ){
		this.otherNotes.push( "Darkvision " + distance + "ft." );//darkvision
	}
}

NPC.prototype.addSkillBonus = function( source, skill, bonus ){
	this.skillBlock.addBonusToSkill( skill, bonus );
	this.skillNotes.push( source + ": +" + bonus + " "  + skill );
}

NPC.prototype.addMultiSkillBonus = function( bonusName, multiSkills, bonus ){
	var skillString = "";
	for( var i = 0; i < multiSkills.length; i++ ){
		this.skillBlock.addBonusToSkill( multiSkills[i], bonus );
		skillString += multiSkills[i] + (i-1 < multiSkills.length ? " " : "");
	}
	this.skillNotes.push( bonusName + ": +" + bonus + " " + skillString);
}

//Adds feature if not present, or upgrades it otherwise.
NPC.prototype.addStackingFeature = function( notes, features ){
	for( var i = 0; i < notes.length; i++ ){
		for( var j = 0, feature; j < features.length; j++ ){
			feature = features[j];
			if( notes[i] == feature ){  // if current feature
				if( j < features.length -1 ){
					console.log( notes[i] + " being upgraded to " + features[j+1] );
					notes[i] = features[j+1];
					}
				return;
			}
		}
	}
	notes.push( features[0] );
}

/*
Convenience method for selecting a skill by name from skill block
*/
NPC.prototype.getSkill = function( key ){
	return this.skillBlock.getSkill( key );
}

//------------------------------------------------------------------
//	Called when user hits the Make NPC! Button. Version 2
//------------------------------------------------------------------
function makeNPC2(){
	//	determine race by referring to html
	//----------------------------------------------
	var npc = new NPC();
	var baseScores = standardArray;
	
	npc.race = getChoiceFromRadio( "race" );
	npc.flagNPCorCore = 'npc';
	
	var classChoices = document.getElementsByName("class-choice");
	var skillPreference = getChoiceFromRadio("skillpref");
	
	for( var i = 0; i < classChoices.length; i++ ){
		var c = classChoices[i];
		//get levels from npcs
		
		if( c.value != "" && c.value != "0" ){
			var cc = getCharClassFromKey( c.getAttribute("associated") );
			var lvl = parseInt(c.value);
			npc.classes.push( cc );
			npc.levelOfClasses.push( lvl );
			npc.level += lvl;
			
			if( cc.type == 'core' ){
				npc.flagNPCorCore = 'core';  //if there is a core class, flip the core flag
				baseScores = eliteArray;
			}
		}
	}
	
	// get scores based off of priority 
	//--------------------------------------
	npc.priorities = getAbilityPriorityArray();
	for( var i = 0; i < 6; i++ ){
		var p = npc.priorities[i];	//what priority i ability is
		var s = baseScores[i];
		npc.scores[p] = s;
	}
	
	//	Inherent Bonuses from level
	//---------------------------------------
	var p =  npc.priorities[0];
	var b = Math.floor( npc.level / 4 );
		
	if( b >= 1 ){
		npc.scores[ p ] += b;  //add bonus to priority ability
	}
	
	// Calculate CR and XP value
	//--------------------------------------
	npc.cr = npc.level -1;
	
	if( npc.flagNPCorCore == "npc" ){  //if npc class drop reward value
		npc.cr--;
	}
	
	if( npc.cr == -1 ){
		npc.cr = "1/3";
		npc.xp = xpRewards[0];
	}
	else if( npc.cr == 0 ){
		npc.cr = "1/2";
		npc.xp = xpRewards[1];
	}
	else{
		npc.xp = xpRewards[ npc.cr+1 ];
	}
	
	//setting race traits
	setRaceTraits( npc );
	
	//if small creature, grant a bonus to stealth
	if( npc.size == -1 ){
		npc.addSkillBonus( "Small", "Stealth", 4 );
	}
	
	// Calculate Ability Modifiers
	//-----------------------------------
	for( var i = 0; i < npc.scores.length; i++ ){
		npc.mods.push(  Math.floor( (npc.scores[i]-10) /2) );
	}
	
	// Skills
	//-----------------------------------
	
	//OPTION: favor skills with bonuses
	if(  document.getElementById("favor-bonuses").checked ){
		for( var i = 0, s, l = npc.skillBlock.skills.length; i < l; i++ ){
			s = npc.skillBlock.skills[i];
			if( s.bonus > 0 ){
				s.weight += s.bonus;
			}
		}
	}
	
	//OPTION: day job, add weight to craft or profession
	if(  document.getElementById("day-job").checked ){
		if( Math.random() > 0.5 ){
			npc.getSkill( "Craft" ).weight += 10;
		}
		else{
			npc.getSkill( "Profession" ).weight += 10;
		}
	}
	
	//OPTION Favor skills with abilities
	if(  document.getElementById("favor-abilities").checked ){
		for( var i = 0, s, a, l = npc.skillBlock.skills.length; i < l; i++ ){
			s = npc.skillBlock.skills[i];
			a = npc.scores[ npc.ability ];
			if( a > 0 ){
				s.weight += a;
			}
		}
	}
	
	//OPTION No fly
	if(  document.getElementById("no-fly").checked ){
		npc.getSkill( "Fly" ).weight = 0;
	}
	
	setClassFeatures( npc );
	
	//MANTATORY: assign skill points
	//Somewhat complicated as multiclassing means some odd skill points.
	var unspent = npc.skillPoints;
	var sppl = Math.floor(npc.skillPoints / npc.level );  //skill points per level
	
	// Whimsy
	if( document.getElementById("whimsy").checked ){
		var fourth  = Math.max( 1, Math.floor( .25 * sppl ) );
		
		var toSpend =  fourth * npc.level;
		var spent = 0;
		
		for( var ranksToAdd; spent < toSpend; true ){
		
			ranksToAdd = Math.min( npc.level, toSpend - spent );
			//flag =  addRanksWithPref( npc.skills, ranksToAdd,  false ); // add to a non class skill, returns false if unable to assign points anywhere.
			npc.skillBlock.addRanksToRandomSkill( 'nonclass', ranksToAdd );
			spent += ranksToAdd;
		}		
		unspent -= spent;
	}
	
	//Dabbler
	if( skillPreference == "dabbler" ){
		sppl = Math.floor( unspent / npc.level );  //in case we don't have any left.
	
		var fs = Math.ceil( sppl /2 );  //skill points per level to spend on focus skills
		var toSpend = fs * npc.level;
		var spent = 0;

		for( var ranksToAdd;  spent < toSpend; true ){
			ranksToAdd = Math.min( npc.level, toSpend - spent );
			//flag =  addRanksWithPref( npc.skills, ranksToAdd,  true );
			
			npc.skillBlock.addRanksToRandomSkill( 'class', ranksToAdd );
			spent += ranksToAdd;			
		}
		unspent -= spent;
		
		var rank = [];
		rank[0] = Math.ceil( npc.level / 2);
		rank[1] = Math.floor( npc.level /2 );
		
		toSpend = unspent;
		spent = 0;
		
		for( var c = 0, ranksToAdd; spent < toSpend; c++ ){
			c = c % 2;
			//put 1/2  points per level, alternating if assigning odd numbers
			ranksToAdd = Math.min( rank[c], toSpend - spent );
			//flag =  addRanksWithPref( npc.skills, ranksToAdd,  true ); //reduce points, returns false if unable to assign points anywhere.
			
			npc.skillBlock.addRanksToRandomSkill('class', ranksToAdd );
			spent += ranksToAdd; 			
		}
		
		unspent -= spent;
	}
	// default, if there are any unspent points, just fill up skills
	// Also, focused
	
	for( var r; unspent > 0; unspent -= r ){
		r = Math.min(npc.level, unspent); //put max points per level, or whatever is left
		npc.skillBlock.addRanksToRandomSkill( 'class', r );
	}
	
	if(  unspent > 0 ){
		alert( "Unable to spend " + unspent + " skill points." );
	}
	
	var totalPoints = 0;
	for( var i = 0; i < npc.skillBlock.skills.length; i++ ){
		totalPoints += npc.skillBlock.skills[i].ranks; 
	}
	
	//	Finalize derived attributes
	//-----------------------------------
	//console.log( npc.fort, npc.ref, npc.will );
	npc.fort += npc.mods[CON];
	npc.ref += npc.mods[DEX];
	npc.will += npc.mods[WIS];
	//console.log( npc.fort, npc.ref, npc.will );
	
	npc.feats += Math.ceil(npc.level / 2 );
	
	npc.rangedBonus += npc.bab + npc.mods[DEX] - npc.size;
	npc.meleeBonus += npc.bab + npc.mods[STR] - npc.size;
	npc.meleeDamage += npc.mods[STR];
	
	npc.cmb += npc.mods[STR] + npc.bab + npc.size;
	npc.cmd += npc.mods[STR] + npc.mods[DEX] + npc.bab + npc.size;
	
	npc.ac += npc.mods[DEX];
	npc.touch += npc.mods[DEX];
	npc.flat += Math.min( npc.mods[DEX], 0 );  //if dex is negative, ac drops
	
	var hdhp = 0
	
	if( npc.flagNPCorCore=='core' ){
		var largestHd = 0;
		for( var i =0; i < npc.classes.length; i++ ){
			if( npc.classes[i].type == "core" && npc.classes[i].hitdie > largestHd){
				largestHd = npc.classes[i].hitdie;
			}
		}
		
		var used = false;
		for( var i = 0; i < npc.classes.length; i++ ){
			
			if( !used && npc.classes[i].hitdie == largestHd ){
				hdhp += largestHd + (((npc.classes[i].hitdie + 1 ) / 2 ) * ( npc.levelOfClasses[i]-1 ) );
				used = true;
			}
			else{
				hdhp += ((npc.classes[i].hitdie + 1 ) / 2 ) * npc.levelOfClasses[i];
			}	
		}
	}
	else{
		for( var i = 0; i < npc.classes.length; i++ ){
			
			hdhp += ((npc.classes[i].hitdie + 1 ) / 2 ) * npc.levelOfClasses[i];
		}
	}
	hdhp = Math.floor( hdhp );
	
	var bonusHp = npc.level * npc.mods[ CON ];
	
	// Render (create HTML )
	//-----------------------------------
	var npc_element = document.createElement("div");
	npc_element.setAttribute( "class", "npc" );
	
	//-----------if no levels, do empty
	if( npc.level == 0 ){
		npc_element.appendChild( document.createTextNode( "No class levels or racial hit dice." ) );
		document.getElementById("statBlock").insertBefore( npc_element, statBlock.firstChild );
		return;
	}
	
	var title = toUpperFirst( npc.race );
	var section_head = document.createElement("section");
	for( var i = 0, cls; i < npc.classes.length; i++){
		cls = npc.classes[i];
		title += (" " + cls.name + " " + npc.levelOfClasses[i] );  //cycle through all classes
	}
	section_head.appendChild( document.createTextNode( title ) );
	section_head.appendChild( document.createElement( "br") );
	section_head.appendChild( document.createTextNode( "CR: " + npc.cr + " XP: " + npc.xp ) );
	npc_element.appendChild( section_head );
	
	var section_defense = document.createElement("section");
	section_defense.appendChild( document.createTextNode( "AC: " + npc.ac + " touch: " + npc.touch + " flat: " + npc.flat ));
		createNotes( section_defense, npc.acNotes );
	section_defense.appendChild( document.createElement( "br") );
	
	var hdString ="";
	for( var i = 0; i < npc.classes.length; i++ ){
		if( npc.levelOfClasses[i] > 1 ){
			hdString += npc.levelOfClasses[i];
		}
		 hdString += "d" + npc.classes[i].hitdie + " ";
		if( i < npc.classes.length -1 ){
			hdString += "+ ";
		}
	}
	if( bonusHp != 0 ){ 
		hdString += signed(bonusHp);
	}
	
	section_defense.appendChild( document.createTextNode( "HP: " + (hdhp + bonusHp) + " ( " + hdString + ")" ) );  //hp
	section_defense.appendChild( document.createElement( "br") );
	section_defense.appendChild( document.createTextNode( "Saves: Fort: " + signed(npc.fort) + " Ref: " + signed(npc.ref) + " Will: " + signed(npc.will) ) );  //saves
		createNotes( section_defense, npc.savesNotes );
	npc_element.appendChild( section_defense );
	
	var section_offense = document.createElement("section");
	section_offense.appendChild( document.createTextNode(  "BAB: " + signed(npc.bab) + ", CMB: " + signed(npc.cmb) + ", CMD: " + npc.cmd  ) );
		createNotes( section_offense, npc.cmbNotes );
		createNotes( section_offense, npc.cmdNotes );
	section_offense.appendChild( document.createElement( "br") );
	section_offense.appendChild( document.createTextNode(  "Melee: " + signed(npc.meleeBonus) + " (" + signed(npc.meleeDamage) + " damage), Ranged: " + signed(npc.rangedBonus) ) );
		createNotes( section_offense, npc.combatNotes );
	npc_element.appendChild( section_offense );
	
	var section_stats = document.createElement("section");
	var line ="";
	for( var i = 0; i < abilities.length; i++ ){
		line += toUpperFirst(abilities[i]) + " " + npc.scores[i];
		if( i != abilities.length-1 ){
			line += ", ";
		}
	}
	section_stats.appendChild( document.createTextNode( line ) );
	section_stats.appendChild( document.createElement( "br") );
	section_stats.appendChild( document.createTextNode( "Feats: " + npc.feats ) );
		createNotes( section_stats, npc.featsNotes );
	npc_element.appendChild( section_stats );
	
	var section_skills= document.createElement("section");
	var sk_list =  document.createElement("ul");
	sk_list.setAttribute("class", "skill_mods");
	
	for( var i =0; i < npc.skillBlock.skills.length; i++ ){
		var s = npc.skillBlock.skills[i];

		if( s.bonus != 0 || s.ranks != 0){  //if this is something either than the easily derived value
				var k = document.createElement('li');
				var b = s.bonus + s.ranks + npc.mods[ s.ability ];
				console.log( b, s.bonus, s.ranks, npc.mods[s.ability ] );
				if( s.ranks > 0 && s.c == true ){	//if class skill with 1 rank, boost by 3.
					b+= 3;
				}
				k.innerHTML = s.name + " " + signed( b );
				sk_list.appendChild( k );  //add to the unordered list
		}
	}
	
	section_skills.appendChild( sk_list );
		createNotes( section_skills, npc.skillNotes );
	section_skills.appendChild( document.createTextNode( "Skill points: " + npc.skillPoints + " (" + (npc.skillPoints/npc.level) + " per level)" ) );	
	npc_element.appendChild( section_skills );
	
	var section_other = document.createElement("section");
		createNotes( section_other, npc.otherNotes );
	
	npc_element.appendChild( section_other );
	
	//spells, if has any
	if( npc.spellBlocks.length > 0 ){
		var section_spells= document.createElement("section");
		for( var j = 0; j < npc.spellBlocks.length; j++ ){
			var spells = npc.spellBlocks[j];
			var header = document.createElement("span");
			header.innerHTML = spells[0];

			var spell_list = document.createElement("ul");
			spell_list.setAttribute( "class", "spells" );
			for( var i =1; i < spells.length; i++ ){
				var spell_element = document.createElement("li");
				var spell = spells[i];
				var sl = spell.level;
				var s;
				
				if( sl > 2 ){ s = sl + "th- ";}
				else if( sl == 2 ){ s ="2nd- "; }
				else if( sl == 1 ){ s = sl + "st- ";}
				else { s = "0  - "; }
				spell_element.innerHTML = s + spell.slots + " slots, DC " + spell.dc;
				
				spell_list.appendChild( spell_element );
			}
			
			section_spells.appendChild( header );
			section_spells.appendChild( spell_list );
		}
		npc_element.appendChild( section_spells );
	}
	
	document.getElementById("statBlock").insertBefore( npc_element, statBlock.firstChild );
}

function createNotes( ElementToAddTo, list ){
	if( list.length > 0 ){
		
		var notes = document.createElement( "ul");
		notes.setAttribute( "class", "notes" );
	
		for( var i =0; i < list.length; i++ ){
			var note = document.createElement( "li" );
			note.innerHTML = list[i];
			notes.appendChild( note );
		}
		ElementToAddTo.appendChild( notes );
	}
}

function calcuateSave( quality, level  ){
	if( quality == "good" ){
		return Math.floor( 2 + (level/2 ) );
	}
	else{
		return Math.floor( level / 3 );
	}
} 

function getCharClassFromKey( str ){
	for( var i = 0, l = classList.length; i < l; i++ ){
		if( str == classList[i].name ){
			return classList[i];
		}
	}
}

//Creates an array of each ability's priority. index 0 has highest priority.
//2nd version, uses DnD priority input
function getAbilityPriorityArray(){
	var pri = [];
	var preferences = document.getElementsByName( "apreferences" );
	var preference;
	
	for( var i = 0; i < 6; i++ ){
		preference = preferences[i];
		for( var j = 0, done = false; j < 6 && !done; j++ ){
			if( preference.id == abilities[j] ){
				done = true;
				pri.push( j );
			}
		}
	}
	return pri;
}

//	Returns the string with the first letter capitalized
function toUpperFirst( string ){
	return string.charAt(0).toUpperCase() + string.substring(1);
}

//	Adds a positive sign to number if not negative
//
function signed( value ){
	if( value >= 0 ){
		return "+" + value;
	}
	else{ return value; }
}

/*	Gets the value of radio input choice from : radio with name nameOfRadio
*/
function getChoiceFromRadio( nameOfRadio ){
	var radios = document.getElementsByName(nameOfRadio);
	
	for( var i = 0; i < radios.length; i++ ){
		if( radios[i].checked ){
			return radios[i].value;
		}
	}
}