/*
*	Look up list of skills
*	name: human readable and lookup name of skills
*	ability: integer value of key attribute used for determining bonus
*	weight:	how important this skill is (increases chance of randomly being selected to have points placed).
*/
function Skill( name, ability, weight){
	this.name = name;
	this.ability = ability;
	this.weight = weight;
}

function SkillBonus( name, c, ranks, bonus, ability, weight ){
	this.name = name;
	this.c = c;
	this.ranks = ranks;
	this.bonus = bonus;
	this.ability = ability;
	this.weight = weight;
}

function CopySkillBonus( skill_block ){
	var sb = createSkillBlock();
	
	for( var i = 0; i < sb.length; i++ ){
		sb[i].ranks = skill_block[i].ranks;
		sb[i].bonus = skill_block[i].bonus;
		sb[i].weight = skill_block[i].weight;
	}
	
	return sb;
}

//|	Skill Block
//|_________________________________
function SkillBlock(){

	this.skills = [];
	//create all the skills
	for( var i = 0, s, length = ALL_SKILLS.length; i < length; i++ ){
		s = ALL_SKILLS[i];
		this.skills.push( new SkillBonus( s.name, false, 0, 0, s.ability, s.weight ) );
	}
}

SkillBlock.prototype.makeCopy = function(){
	other = new SkillBlock();
	other.skills = [];

	for( var i = 0; i < this.skills.length; i++ ){
		var s = this.skills[i];
		other.skills.push( new SkillBonus( s.name, s.c, s.ranks, s.bonus, s.ability, s.weight ) );
	}
	
	return other;
}
	
//returns the skill (with bonus)
SkillBlock.prototype.getSkill = function( key ){
	for( var i = 0, length = this.skills.length; i < length; i++ ){
		if( key == this.skills[i].name ){
			return this.skills[i];
		}
	}
	 throw new Error( key + " not recognized when looking up skill." );
}
	
//marks a list of skill names as class skills
SkillBlock.prototype.markClassSkills = function( names ){
	for( var i = 0, length = names.length; i < length; i++ ){
		this.getSkill( names[i] ).c = true;
	}
}
	
SkillBlock.prototype.addBonusToSkill = function( skillName, bonus ){
	this.getSkill( skillName ).bonus += bonus;
}
	
//gets the total weight of all the current skills
SkillBlock.prototype.getTotalWeight = function(){
	for( var i = 0, weight=0, length = skills.length(); i < length; i++ ){
		weight += skills[i].weight;
	}
	return weight;
}

//returns a random skill, randomly selected by weight.
//If no skill in this category exists returns null
SkillBlock.prototype.getRandomSkillOfType = function( preference ){
	var sublist = [];
	var weight = 0;

	for( var i = 0, s, length = this.skills.length; i < length; i++ ){
		s = this.skills[i];
		if( ( preference == "any" ) || ( preference == "class" && s.c) || ( preference == "nonclass" && !s.c) ){
			weight += s.weight;
			sublist.push( s );
		}
	}
	
	var roll = Math.floor( Math.random() *  weight );  //random value
	
	for( var i = 0, subskill; i < sublist.length; i++ ){
		subskill = sublist[i];
		if( subskill.weight < weight ){
			//continue on
			weight -= subskill.weight;
		}
		else{
			return subskill;
		}
	}
	return null;
}

/**
**	Gets a random skill, prioritizing skiills of preference
*/
SkillBlock.prototype.getRandomSkill = function( preference ){
	var rand = this.getRandomSkillOfType( preference );
	
	return ( rand != null) ? rand : this.getRandomSkillOfType( 'any' );
}

/*
*	Add ranks to a random skill of type. Then removes its ability to be randomly selected again.
*/
SkillBlock.prototype.addRanksToRandomSkill = function( preference, ranksToAdd ){
	var skill = this.getRandomSkill( preference );
	skill.weight = 0;
	skill.ranks += ranksToAdd;
}

//|________________________________________________________|
//|

var ALL_SKILLS = [
	new Skill('Acrobatics', DEX, 2),
	new Skill('Appraise', INT, 1),
	new Skill('Bluff', CHA, 2),
	new Skill('Climb', STR, 1),
	new Skill('Craft', INT, 1),
	new Skill('Diplomacy', CHA, 2),
	new Skill('Disable Device', DEX, 3),
	new Skill('Disguise', CHA, 2),
	new Skill('Escape Artist', DEX, 2),
	new Skill('Fly', DEX, 1),
	new Skill('Handle Animal', CHA, 1),
	new Skill('Heal', WIS, 1),
	new Skill('Intimidate', CHA, 2),
	new Skill('Knowledge (arcana)', INT, 1),
	new Skill('Knowledge (dungeoneering)', INT, 1),
	new Skill('Knowledge (engineering)', INT, 1),
	new Skill('Knowledge (geography)', INT, 1),
	new Skill('Knowledge (history)', INT, 1),
	new Skill('Knowledge (local)', INT, 2),
	new Skill('Knowledge (nature)', INT, 2),
	new Skill('Knowledge (nobility)', INT, 1),
	new Skill('Knowledge (planes)', INT, 1),
	new Skill('Knowledge (religion)', INT, 2),
	new Skill('Linguistics', INT, 1),
	new Skill('Perception', WIS, 12),
	new Skill('Perform', CHA, 2),
	new Skill('Profession', WIS, 1),
	new Skill('Ride', DEX, 2),
	new Skill('Sense Motive', WIS, 1),
	new Skill('Sleight of Hand', DEX, 1),
	new Skill('Spellcraft', INT, 2),
	new Skill('Stealth', DEX, 3),
	new Skill('Survival', WIS, 2),
	new Skill('Swim', STR, 2),
	new Skill('Use Magic Device', CHA, 1)
];

/*
function createSkillBlock(){

	var sb = [];
	
	for( var i = 0; i < ALL_SKILLS.length; i++ ){		
		var a = ALL_SKILLS[i].ability;
		sb.push( new SkillBonus( ALL_SKILLS[i].name, false, 0, 0, a, ALL_SKILLS[i].weight ) );
	}

	return sb;
}	
	

function markClassSkills( sblock, cs_list ){
	for( var i = 0; i < cs_list.length; i++ ){
		var found = false;
		for( var j = 0; j < sblock.length; j++ ){
		
			if( cs_list[i] == sblock[j].name ){
				sblock[j].c = true;
				found = true;
			}
		}
		if( !found){
				console.log("warning: unable to find skill by name of " + cs_list[i] );
		}
	}	
}
*/

/*	Applies bonus to skill of skill_name in array of skills sblock.
*/

/*
function addBonusToSkill( sblock, skill_name, bonus ){
	for( var i = 0; i < sblock.length; i++ ){
		if(skill_name == sblock[i].name ){
			sblock[i].bonus += bonus;
		}
	}
}

function getSkill( sblock, skill_name ){
	for( var i = 0; i < sblock.length; i++ ){
		if( sblock[i].name == skill_name){
			return sblock[i];
		}
	}
}

function lookupSkill( n ){
	for( var i = 0; i < ALL_SKILLS.length; i++ ){
		if( n == ALL_SKILLS[i].name ){
			return ALL_SKILLS[i];
		}
	}
	
	console.log( n + " not recognized during skillgen.lookup" );
}
*/

/*	Weighted skill selection using a lottery method on the skill's weight.
*	skills: array of Skill (skill block) to assign points to. Class skills should be set already.
*  sp: points to spend
*	level: level of the characterSet
*  type_flag: what type of skills to assign to true: class, false: non-class, "any" both,
*/
function addRanks( skills, ranks, num, type_flag ){
	
	var n = num;
	var r;  //random number
	
	for( var w = calcWeight( skills, type_flag ); ( n > 0 && w > 0 ); w = calcWeight( skills, type_flag ) ){  //while there are points left to spend, and all skills of type haven't been assigned
		r = Math.floor( Math.random() *  w );  //random value
		
		//while not found, cycles through list to see which entry at r roll is at ( roll being total weights of all skills on chart )
		var found, s;
		for( var i = 0, found = false; !found; i++ ){
			s = skills[i];
			if( isSkillType(s, type_flag) ){
				if( r < s.weight ){
					s.ranks = ranks;  //max ranks
					s.weight = 0;	//set weight on lottery to 0 so it's not rolled again
					found = true;
					--n;  //decrement
				}
				else{
					r -= s.weight;
				}
			}
		}
	}
	
	return n*ranks;  //if there are any unspent ranks
}

function addRanksWithPref( skills, ranks, pref ){
	var w = calcWeight( skills, pref );
	
	if( w > 0 ){
		r = Math.floor( Math.random() *  w );  //random value
		var  s;
		for( var i = 0; i < skills.length; i++ ){
			s = skills[i];
			if( isSkillType(s, pref) ){
				if( r < s.weight ){
					s.ranks = ranks;  //ranks
					s.weight = 0;	//set weight on lottery to 0 so it's not rolled again
					return true;
				}
				else{
					r -= s.weight;
				}
			}
		}
	}
	//if weight == 0, default to trying any skill
	//hack recursive call, but I'm lazy sometimes.
	if( pref != "any" ){
		return addRanksWithPref( skills, ranks, "any");
	}
	
	return false;
}

/*	Calculates the remaining total lottery weight of skills.
*/
function calcWeight( skills, class_skill ){

	var w = 0;
	var s;
	
	for( var i = 0; i < skills.length; i++ ){
		s = skills[i];
		if( isSkillType( s, class_skill )  ){
			w += s.weight; 
		}
	}
	
	return w;
}

/*  Compares the skill with flag
*	"any" always returns true, otherwise compares skill.c with flag
*/
function isSkillType( skill, flag ){

	if( flag == "any" ){
		return true;
	}
	return ( skill.c == flag );
}