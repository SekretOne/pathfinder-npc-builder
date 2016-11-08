// Class
//-----------------------------------

var classList = [
	//  CharClass( name, hitdie, sp, bab, fort, ref, will, type  )
	new CharClass( "warrior", 10, 2, 1, "good", "bad", "bad", "npc" ),
	new CharClass( "expert", 8, 6, 3/4, "bad", "bad", "good", "npc" ),
	new CharClass( "commoner", 6, 2, 1/2, "bad", "bad", "bad", "npc" ),
	new CharClass( "aristocrat", 8, 4, 3/4, "bad", "bad", "good", "npc" ),
	new CharClass( "adept", 6, 2, 1/2, "bad", "bad", "good", "npc" ),
	
	new CharClass( "fighter", 10, 2, 1, "good", "bad", "bad", "core" ),
	new CharClass( "ranger", 10, 6, 1, "good", "good", "bad", "core" ),
	new CharClass( "rogue", 8, 8, 3/4, "bad", "good", "bad", "core" ),
	new CharClass( "barbarian", 12, 4, 1, "good", "bad", "bad", "core"),
	new CharClass( "paladin", 10, 2, 1, "good", "bad", "good", "core" ),
	new CharClass( "monk", 8, 4, 3/4, "good", "good", "good", "core" )
	];

function CharClass( name, hitdie, sp, bab, fort, ref, will, type  ){
	this.name = name;
	this.hitdie = hitdie;
	this.sp = sp;
	this.bab = bab;
	this.fort = fort;
	this.ref = ref;
	this.will = will;
	this.type = type;
}

//Cycles through all the classes levels the NPC possesses, adding up bonus and class features.	
function setClassFeatures( npc ){
	for( var i = 0; i < npc.classes.length; i++){  // for each class
		
		var cls = npc.classes[i];
		var cName = cls.name;
		var clvl = npc.levelOfClasses[i];
	
		npc.fort += calcuateSave( cls.fort, clvl );
		npc.ref += calcuateSave( cls.ref, clvl );
		npc.will += calcuateSave( cls.will, clvl );
		
		npc.bab += Math.floor( cls.bab * clvl );  //add the bonus BAB
		
		npc.skillPoints += clvl * Math.max( 1, (cls.sp + npc.mods[INT] ) );  // add skill points,
		
		if( cName == "commoner" ){
			npc.skillBlock.markClassSkills( ["Climb", "Craft", "Handle Animal", "Perception", "Profession", "Ride", "Swim"] ); 
		}
		else if( cName == "warrior"){
			npc.skillBlock.markClassSkills( ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Profession', 'Ride', 'Swim'] );
		}
		else if( cName == "aristocrat" ){
			npc.skillBlock.markClassSkills( ["Appraise", "Bluff", "Craft", "Diplomacy", "Disguise", "Handle Animal", "Intimidate", 'Knowledge (arcana)', 'Knowledge (dungeoneering)', 'Knowledge (engineering)', 'Knowledge (geography)', 'Knowledge (history)', 'Knowledge (local)', 'Knowledge (nature)', 'Knowledge (nobility)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Ride', 'Sense Motive', 'Swim', 'Survival'] );
		}
		else if( cName == "adept" ){
			npc.skillBlock.markClassSkills( ['Craft', 'Handle Animal', 'Heal', 'Knowledge (arcana)', 'Knowledge (dungeoneering)', 'Knowledge (engineering)', 'Knowledge (geography)', 'Knowledge (history)', 'Knowledge (local)', 'Knowledge (nature)', 'Knowledge (nobility)', 'Knowledge (planes)', 'Knowledge (religion)', 'Profession', 'Spellcraft', 'Survival']);
			
			if( clvl >= 2 ){
				npc.otherNotes.push( "Summon familiar");
			}
			
			var sb =  createSpellSlotsWithName( ("Adept Spells CL " + clvl), adept_spd, clvl, npc.scores[WIS] );
			if( sb.length > 1 ){
				npc.spellBlocks.push( sb );
			}
		}
		else if ( cName =="barbarian" ){
			npc.skillBlock.markClassSkills( ["Acrobatics", "Climb", "Craft", "Handle Animal", "Intimidate", "Knowledge (nature)", 'Perception', 'Ride', 'Survival', 'Swim'] );
			switch( clvl ){
				case 20:
					npc.combatNotes.push( "Mighty Rage" );
				case 19:
				case 18:
				case 17:
					npc.combatNotes.push( "Tireless Rage" );
				case 16: 
				case 15:
				case 14:
					npc.savesNotes.push( "+4 vs enchantment spells" );
				case 13:
				case 12: 
				case 11:
					npc.combatNotes.push( "Greater Rage" );
				case 10: 
				case 9:
				case 8: 
				case 7:
					var dr = Math.floor( (clvl - 4)/3 );
					npc.acNotes.push( "DR " + dr + "/-" );
				case 6: 
				case 5:
					npc.addStackingFeature( npc.acNotes, ["Uncanny Dodge", "Improved Uncanny Dodge"] );
				case 4:
				case 3:
					var trap_sense = Math.floor( clvl /3);
					npc.skillNotes.push( "Trap sense +" + trap_sense );
					npc.acNotes.push( "+" + trap_sense + " vs traps" );
				case 2:
					npc.addStackingFeature( npc.acNotes, ["Uncanny Dodge", "Improved Uncanny Dodge"] );
				default:
					npc.otherNotes.push("+10ft movespeed in medium armor or less");
					var rage = npc.mods[CON] + (2 * clvl) +2;
					npc.combatNotes.push("Rage " + rage +" rounds");
			}
		}
		else if ( cName =="monk" ){
			switch( clvl ){
			case 20:
					npc.savesNotes.push("Perfect Self");
					npc.addStackingFeature( npc.combatNotes, ["Unarmed damage 1d6", "Unarmed damage 1d8", "Unarmed damage 1d10", "Unarmed damage 2d6", "Unarmed damage 2d8", "Unarmed damage 2d10"] ); 
				case 19:
				case 18:
				case 17:
				case 16: 					
					npc.addStackingFeature( npc.combatNotes, ["Unarmed damage 1d6", "Unarmed damage 1d8", "Unarmed damage 1d10", "Unarmed damage 2d6", "Unarmed damage 2d8", "Unarmed damage 2d10"] ); 
				case 15:
				case 14:
				case 13:
				case 12: 
					npc.addStackingFeature( npc.combatNotes, ["Unarmed damage 1d6", "Unarmed damage 1d8", "Unarmed damage 1d10", "Unarmed damage 2d6", "Unarmed damage 2d8", "Unarmed damage 2d10"] ); 
				case 11:
				case 10: 
				case 9:
					npc.addStackingFeature( npc.savesNotes, ["Evasion", "Improved Evasion"] );
				case 8: 
					npc.addStackingFeature( npc.combatNotes, ["Unarmed damage 1d6", "Unarmed damage 1d8", "Unarmed damage 1d10", "Unarmed damage 2d6", "Unarmed damage 2d8", "Unarmed damage 2d10"] ); 
				case 7:
				case 6: 
				case 5:
				case 4:
					npc.addStackingFeature( npc.combatNotes, ["Unarmed damage 1d6", "Unarmed damage 1d8", "Unarmed damage 1d10", "Unarmed damage 2d6", "Unarmed damage 2d8", "Unarmed damage 2d10"] );
					
					var ki = Math.floor( clvl / 2 ) + npc.mods[WIS];
					var kiNote = "Ki pool " + ki;
					npc.combatNotes.push( kiNote );
				case 3: 
					var fastMovement = Math.floor( clvl / 3) * 10;
					npc.otherNotes.push( "+" + fastMovement + " move speed in no armor");
					
					npc.cmd -= Math.floor( clvl * (3/4) );
					npc.cmd += clvl;
					
					npc.combatNotes.push( "maneuver training" );
				case 2:
					npc.addStackingFeature( npc.savesNotes, ["Evasion", "Improved Evasion"] );
				default:
					npc.addStackingFeature( npc.combatNotes, ["Unarmed damage 1d6", "Unarmed damage 1d8", "Unarmed damage 1d10", "Unarmed damage 2d6", "Unarmed damage 2d8", "Unarmed damage 2d10"] ); 
					npc.featsNotes.push( "Unarmed Strike" );
					npc.combatNotes.push( "Stunning fist " + clvl + " / day" );
					
					var acBonus = Math.floor( clvl / 4 ) + npc.mods[WIS];
					acBonus = Math.max( 0, acBonus );
					npc.acNotes.push( "AC Bonus +" + acBonus + " in no armor");
					npc.ac += acBonus;
					npc.flat += acBonus;
					npc.touch += acBonus;
					npc.cmd += acBonus;
					
					var monkFeat = 1 + Math.floor( (clvl +2 ) /4 );
					var monkFeatNotes = monkFeat + " bonus Monk Feats";
					npc.featsNotes.push( monkFeatNotes );
			}
		}
		else if ( cName =="ranger" ){
			npc.skillBlock.markClassSkills( ["Climb", "Craft", "Handle Animal", "Heal", "Intimidate", 'Knowledge (dungeoneering)','Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Stealth', 'Survival', 'Swim']);
			switch( clvl ){
				case 20:
					npc.combatNotes.push("Master Hunter");
				case 19:
				case 18:
				case 17:
					npc.skillNotes.push( "Hide in plain sight" );
				case 16: 
					npc.addStackingFeature( npc.savesNotes, ["Evasion", "Improved Evasion"] );
				case 15:
				case 14:
				case 13:
				case 12: 
					npc.skillNotes.push("Camoflage: hide in any favored terrain without cover");
				case 11:
					npc.combatNotes.push("Quarry");
				case 10: 
				case 9:
					npc.addStackingFeature( npc.savesNotes, ["Evasion", "Improved Evasion"] );
				case 8: 
					var iterrains = Math.floor( (clvl-3) / 5 );
					npc.skillNotes.push( iterrains + " improve favored terrains" );
					npc.skillNotes.push( "Swift tracker: move normal speed while tracking" );
				case 7:
					npc.otherNotes.push("Woodland Stride: ignore nature difficult terrain");
				case 6: 
				case 5:
					var boosts = Math.floor( clvl /5 );
					npc.combatNotes.push( boosts + " improve favored enemies" );
				case 4:
					//Ranger Spells
					var sb =  createSpellSlotsWithName( ("Ranger Spells CL " + (clvl-3) ), slow_spd, clvl, npc.scores[WIS] );
					if( sb.length > 1 ){
						npc.spellBlocks.push( sb );
					}
					npc.combatNotes.push( "Hunter's Bond" );
				case 3: 
					npc.featsNotes.push( "Endurance" );
					var terrains = Math.floor( (2+ clvl) / 5 );
					npc.skillNotes.push( terrains + " Favored terrains");
				case 2:
					var cfeats = Math.floor( (2+clvl) / 4 );
					npc.featsNotes.push( cfeats + " combat style feats" );
				default:
					var enemies = Math.floor( clvl /5 ) +1;
					npc.combatNotes.push( enemies + " Favored enemies");
			}
		}
		else  if( cName =="paladin" ){
			npc.skillBlock.markClassSkills( ['Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nobility)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft']);
			switch( clvl ){
			case 20: npc.combatNotes.push( "Holy Champion" );
			case 19:
			case 18:
			case 17:
				npc.acNotes.push( "DR 5/evil");
				npc.savesNotes.push( "Immunity to compulsion, +4 vs compulsion in 10 ft");
			case 16: 
			case 15:
			case 14:
				npc.combatNotes.push( "Aura of Faith" );
			case 13:
			case 12: 
			case 11:
				npc.combatNotes.push( "Aura of Justice" );
			case 10: 
			case 9:
			case 8: 
				npc.savesNotes.push( "Aura of Resolve Immunity to charm, +4 vs charm in 10ft" );
			case 7:
			case 6: 
			case 5:
				npc.combatNotes.push( "Divine Bond" );
			case 4:
				npc.combatNotes.push( "Channel for 2 lay on hands");
				var sb =  createSpellSlotsWithName( ("Paladin Spells CL " + (clvl-3) ), slow_spd, clvl, npc.scores[CHA] );
				if( sb.length > 1 ){
					npc.spellBlocks.push( sb );
				}
			case 3: 
				var mercies = Math.floor( clvl / 3 );
				npc.savesNotes.push( "Aura of Courage +4 vs fear 10ft");
				npc.otherNotes.push( mercies + " mercies");
				npc.savesNotes.push( "Immunity to disease");
			case 2:
				var divineGrace = Math.max( 0, npc.mods[CHA] );
				npc.savesNotes.push( "Divine Grace +" + divineGrace );
				npc.fort += divineGrace;
				npc.ref += divineGrace;
				npc.will += divineGrace;
				var halflvl = Math.floor( clvl / 2 );
				npc.combatNotes.push( "Lay on Hands: " + halflvl + "d6 " + (halflvl+divineGrace) + "/day"); 
			default:
				npc.otherNotes.push("Aura of good");
				var smites = 1 + Math.floor( (clvl -1 )/3 );  //smite evil
				npc.combatNotes.push( "Smite Evil: +" + npc.mods[CHA] + " (+" + clvl + ") " + smites + "/day");
				npc.otherNotes.push( "Detect Evil at will");
			}
		}
		else if( cName =="fighter"){
		npc.skillBlock.markClassSkills( ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (engineering)', 'Profession', 'Ride', 'Survival', 'Swim'] );
		
		switch( clvl ){
			case 20: npc.combatNotes.push( "Weapon mastery" );
			case 19:
			case 18:
			case 17:
			case 16: 
			case 15:
			case 14:
			case 13:
			case 12: 
			case 11:
			case 10: 
			case 9:
			case 8: 
			case 7:
			case 6: 
			case 5:
				//weapon training at 5th and every 4 levels beyond
				var weapon_training = 1 + Math.floor( ( clvl -5 ) /4 );
				npc.combatNotes.push( ("Weapon training +" + weapon_training) );
			case 4:
			case 3:
				//armor training at 3rd and every 4 levels beyond
				var armor_training = 1 + Math.floor( ( clvl -3 ) /4 );
				npc.skillNotes.push( ("Armor training +" + armor_training) );
			case 2:
				var bravery = 1 + Math.floor( (clvl -2 ) /4 );
				npc.savesNotes.push( ("Bravery +" + bravery + " vs fear") );
			default:
				//add bonus feats 1 + 1 every 2 levels
				var bonus_feats = 1 + Math.floor( clvl /2 );
				npc.featsNotes.push( (bonus_feats + " combat feats") );
			}
		}
		else if( cName == "rogue"){
			npc.skillBlock.markClassSkills( ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', "Diplomacy", 'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (local)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device']);
		
			switch( clvl ){
				case 20: npc.combatNotes.push( "Master strike");
				case 19:
				case 18:
				case 17:
				case 16: 
				case 15:
				case 14:
				case 13:
				case 12: 
				case 11:
				case 10: 
				var adv_rt = Math.floor( clvl /2 ) -4;
					npc.otherNotes.push(  (adv_rt + " advanced rogue talents" ) );
				case 9:
				case 8: 
					npc.addStackingFeature( npc.acNotes, ["Uncanny Dodge", "Improved Uncanny Dodge"] );
				case 7:
				case 6: 
				case 5:
				case 4:
					npc.addStackingFeature( npc.acNotes, ["Uncanny Dodge", "Improved Uncanny Dodge"] );
				case 3:
					var trap_sense = Math.floor( clvl /3);
					npc.skillNotes.push( "Trap sense +" + trap_sense );
					npc.acNotes.push( "+" + trap_sense + " vs traps" );
				case 2:
					npc.addStackingFeature( npc.savesNotes, ["Evasion", "Improved Evasion"] );
				var rt =Math.min( 4, Math.floor( clvl /2 ) ) ;
					npc.otherNotes.push( rt + " rogue talents");
				default:
					npc.combatNotes.push( ("Sneak attack +" + Math.ceil( clvl /2 ) + "d6") );
					npc.skillNotes.push( "Trapfinding" );
			}
		}
		else if( cName =="expert"){
			/*var tempblock //= CopySkillBonus( npc.skills );
			for( var j = 0; j < 10; j++ ){  //kids, this is super hacky. Don't do this. But I'm not getting paid to make this.
				addRanksWithPref(tempblock, 1, "any");  //randomly put a rank in 10 skills.
			}
			for( var j = 0,  l = npc.skills.length; j < l; j++ ){
				if( tempblock[j].ranks == 1 ){	//if there is a rank in a skill, it is to be a class skill
					npc.skills[j].c = true;
				}
			}*/
			
			var tempblock = npc.skillBlock.makeCopy();
			
			console.log( tempblock.skills.length );
			
			for( var j = 0; j < 10; j++ ){
				tempblock.addRanksToRandomSkill( 'nonclass', 1 );
			}
			for( var j = 0; j < tempblock.skills.length; j++ ){
				if( tempblock.skills[j].ranks == 1 ){  //if there's a rank, it is a class skills
					npc.skillBlock.skills[j].c = true;
				}
			}
		}
		else{
			console.log("class: " + cName + " not recognized ..." );  //so if you see this, I done goofed.
		}
	}
}