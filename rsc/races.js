//Giant method for added powers to race
function setRaceTraits( npc ){
	// Race
	//-----------------------------------
	var race = npc.race;
	
	if( race == "human"){
		npc.scores[ npc.priorities[0] ] += 2;
		
		npc.skillPoints += npc.level;
		npc.skillPointsNotes.push( "1 extra skill point per level" );
		
		npc.feats++;
		npc.featsNotes.push( "1 free feat");
	}
	else if( race == "half orc"){
		npc.scores[ npc.priorities[0] ] += 2;
		npc.otherNotes.push( "Darkvision 60ft." );//darkvision
		npc.addSkillBonus( "Intimidating",  "Intimidate", 2 ); //intimidating
		npc.otherNotes.push( "Orc blood: count as orc for effects." ); //orc blood
		npc.combatNotes.push( "Orc Ferocity: function at negative hitpoints as disabled for 1 round." );//orc ferocity
		npc.combatNotes.push( "Weapon Familiarity: proficient with Great Axes, Falchions, and all 'orc' weapons are martial.");//weapon familiarity
	}
	else if( race == "half elf"){
		npc.scores[ npc.priorities[0] ] += 2;
		
		npc.otherNotes.push( "low light vision." ); //low light vision
		npc.featsNotes.push( "Adaptability: skill focus");
		npc.otherNotes.push( "Elf blood: count as elves for effects." );//elf blood
		npc.savesNotes.push( "Immune to magic sleep, +2 vs enchantment" ); //elven immunities

		npc.addSkillBonus( "Keen senses", "Perception", 2 );
		
		npc.otherNotes.push( "Multitalented: 2 favored classes" ); //multitalented
	}
	else if( race == "dwarf" ){
		npc.scores[CHA] -= 2;
		npc.scores[CON] += 2;
		npc.scores[WIS] += 2;
		npc.otherNotes.push( "20ft move speed, not effected by encumberance."); 		//Stability
		npc.otherNotes.push( "Darkvision 60ft." );//darkvision
		npc.acNotes.push( "Defensive training: +4 dodge against giants.");//Defensive Training
		npc.cmdNotes.push("+4 CMD vs bull rush / trip");
		npc.skillNotes.push( "Greed: +2 racial bonus on Appraise to find price of nonmagical goods / precious metals / gemstones." );//Greed
		npc.combatNotes.push( "+1 attack vs orcs and goblins"); //Hatred
		npc.savesNotes.push( "Hardy: +2 racial bonus on saving throws against poison, spells, and sp abilities."); //Hardy
		npc.skillNotes.push( "Stonecunning: +2 bonus on Perception stonework; auto check in 10ft."); //Stone Cutting
		npc.combatNotes.push( "Weapon familiarity: battleaxes, heavy picks, and warhammers, 'dwarven' weapons are martial.");//Weapon familiarity
	}
	else if( race == "elf"){
		npc.scores[CON] -= 2;
		npc.scores[DEX] += 2;
		npc.scores[INT] += 2;
		npc.otherNotes.push( "Low light vision." ); //low light vision
		npc.savesNotes.push( "Immune to magic sleep, +2 vs enchantment" ); //elven immunities
		npc.skillNotes.push( "Elven magic: +2 vs SR, +2 to spellcraft to identify properties." );
		npc.addSkillBonus( "Keen senses", "Perception", 2 );
		npc.combatNotes.push( "Weapon familiarity: longbows, composite longbows, longswords, rapiers, shortbows, composite shortbows, 'elven' weapons are martial." );//Weapon familiarity
	}
	else if( race == "gnome" ){
		npc.scores[STR] -= 2;
		npc.scores[CON] += 2;
		npc.scores[CHA] += 2;
		npc.size = -1;
		npc.otherNotes.push( "Low light vision." ); //low light vision
		npc.acNotes.push( "Defensive training: +4 dodge against giants.");//Defensive Training
		npc.combatNotes.push( "+1 DC to illusion spells" ); //gnome magic
		if( npc.scores[CHA] >= 11 ){
			npc.otherNotes.push("SP: 1/day dancing lights, ghost sound, prestidigitation, & speak with animals DC=1/2 hd + 10 + SL");
		}
		npc.combatNotes.push( "+1 attack vs reptilian humanoids and goblins"); //Hatred
		npc.savesNotes.push( "+2 saves against illusion" ); //illu resist
		npc.addSkillBonus( "Keen senses", "Perception", 2 );
		if( Math.random() > .5 ){
			npc.addSkillBonus( "Obsessive", "Profession", 2 );
		}
		else{
			npc.addSkillBonus( "Obsessive", "Craft", 2 );
		}
		npc.combatNotes.push( "Weapon familiarity: 'gnome' weapons are martial." );
	}
	else if( race == "halfling" ){
		npc.scores[STR] -= 2;
		npc.scores[DEX] += 2;
		npc.scores[CHA] += 2;
		npc.size = -1;
		npc.savesNotes.push( "+2 saves against fear" ); //fearless
		npc.fort++;	//halfling luck
		npc.ref++;
		npc.will++;
		npc.savesNotes.push( "Luck: +1 to all saves");
		npc.addSkillBonus( "Keen senses", "Perception", 2 );
		npc.addSkillBonus( "Sure Footed", "Acrobatics", 2 );
		npc.addSkillBonus( "Sure Footed", "Climb", 2 );
		npc.otherNotes.push( "Weapon familiarity: slings, 'halfling' weapons are martial." ); //weapon familiarity
	}
	//	Featured Races
	//---------------------------------------------
	else if( race == "aasimar" ){
		npc.scores[WIS] += 2;
		npc.scores[CHA] += 2;
		npc.otherNotes.push( "Darkvision 60ft." );//darkvision
		npc.addMultiSkillBonus( "Skilled", ["Diplomacy", "Perception"], 2 );
		npc.otherNotes.push( "Daylight 1/day CL: " + npc.level );
		npc.acNotes.push( "Resist acid 5, cold 5, electricity 5" );
	}
	else if( race =="catfolk" ){
		npc.scores[DEX] += 2;
		npc.scores[CHA] += 2;
		npc.scores[WIS] -= 2;
		npc.otherNotes.push( "low light vision." ); //low light vision
		npc.savesNotes.push("Cat's luck: roll reflex twice, take best, 1 / day");
		npc.addMultiSkillBonus( "Natural Hunter", ["Perception", "Stealth", "Survival"], 2 );
		npc.otherNotes.push( "Sprinter: +10ft on charge, run, withdraw" );
	}
	else if( race == "dhampir"){
		npc.scores[DEX] += 2;
		npc.scores[CHA] += 2;
		npc.scores[CON] -= 2;
		npc.otherNotes.push( "Light Sensitivity" );
		npc.otherNotes.push( "Low light Vision" );
		npc.addMultiSkillBonus( "Manipulative", ["Bluff", "Perception"], 2 );
		npc.otherNotes.push( "Detect Undead, CL" + npc.level + " 3/day");
		noc.addDarkvision( 60 );
		npc.savesNotes.push( "Negative Energy Affinity" );
		npc.savesNotes.push( "Resist Level Drain" );
	}
	else if( race == "goblin" ){
		npc.scores[DEX] += 4;
		npc.scores[STR] -= 2;
		npc.scores[CHA] -= 2;
		npc.size = -1;
		npc.otherNotes.push( "Fast: 30ft movespeed" );
		npc.otherNotes.push( "Darkvision 60ft." );//darkvision
		npc.addMultiSkillBonus( "Skilled", ["Ride", "Stealth"], 4 );
	}
	else if( race == "kobold" ){
		npc.scores[DEX] += 2;
		npc.scores[STR] -= 4;
		npc.scores[CHA] -= 2;
		npc.size = -1;
		npc.otherNotes.push( "Fast: 30ft movespeed" );
		npc.otherNotes.push( "Darkvision 60ft." );//darkvision
		npc.acNotes.push( "+1 Natural Armor");
		npc.flat += 1;
		npc.ac += 1;
		npc.skillNotes.push( "Crafty +2 Profession(Miner), Craft(Traps)" );
		npc.addSkillBonus( "Crafty", "Perception", 2 );
		npc.otherNotes.push( "Light Sensitivity" );
	}
	else if( race == "orc" ){
		npc.scores[STR] += 4;
		npc.scores[INT] -= 2;
		npc.scores[WIS] -= 2;
		npc.scores[CHA] -= 2;
		npc.addDarkvision( 60 );
		npc.otherNotes.push( "Light Sensitivity" );
		npc.combatNotes.push("Ferocity");
		npc.combatNotes.push( "Weapon Familiarity: proficient with Great Axes, Falchions, and all 'orc' weapons are martial.");//weapon familiarity
	}
	else if( race == "hobgoblin" ){
		npc.scores[DEX] += 2;
		npc.scores[CON] += 2;
		npc.addDarkvision( 60 );
		npc.addSkillBonus( "Sneaky", "Stealth", 4);
	}
}