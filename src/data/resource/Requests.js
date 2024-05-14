//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/** 
 * Creates a new Requests object.
 * 
 * @constructor
 * @extends rune.resource.Requests
 * 
 * @class
 * @classdesc
 * 
 * This class includes (bakes) resource files used by the application. A 
 * resource file is made available by reference (URI) or base64-encoded string. 
 * Tip: Use Rune-tools to easily bake resource files into this class.
 */
ArcticMadness.data.Requests = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend rune.resource.Requests
     */
    rune.resource.Requests.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.data.Requests.prototype = Object.create(rune.resource.Requests.prototype);
ArcticMadness.data.Requests.prototype.constructor = ArcticMadness.data.Requests;

//------------------------------------------------------------------------------
// Override protected prototype methods
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
ArcticMadness.data.Requests.prototype.m_construct = function() {
    rune.resource.Requests.prototype.m_construct.call(this);
    this.add("64_enemy_lepardseal", "./../asset/64_enemy_lepardseal.png");
	this.add("64_penguin_nogun", "./../asset/64_penguin_nogun.png");
	this.add("Ice_map_64x64", "./../asset/Ice_map_64x64.png");
	this.add("bonuspoint", "./../asset/bonuspoint.png");
	this.add("controller_bg", "./../asset/controller_bg.png");
	this.add("fish", "./../asset/fish.png");
	this.add("gun_directions2", "./../asset/gun_directions2.png");
	this.add("join_graphics", "./../asset/join_graphics.png");
	this.add("map", "./../asset/map.json");
	this.add("menu_bg", "./../asset/menu_bg.png");
	this.add("Shoot", "./../asset/sound/Shoot.wav");
	this.add("Splash", "./../asset/sound/Splash.mp3");
	this.add("cracking", "./../asset/sound/cracking.mp3");
	this.add("help", "./../asset/sound/help.wav");
	this.add("lobby", "./../asset/sound/lobby.mp3");
	this.add("lobby2", "./../asset/sound/lobby2.mp3");
	this.add("music_bg", "./../asset/sound/music_bg.mp3");
	this.add("repaircomplete", "./../asset/sound/repaircomplete.wav");
	this.add("saved", "./../asset/sound/saved.wav");
	this.add("wavecomplete", "./../asset/sound/wavecomplete.wav");
	this.add("thefont", "./../asset/thefont.png");
};