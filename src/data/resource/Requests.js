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
    this.add("Ice_map_64x64", "./../asset/bgs_menus/Ice_map_64x64.png");
	this.add("gameover_bg", "./../asset/bgs_menus/gameover_bg.png");
	this.add("highscores_bg", "./../asset/bgs_menus/highscores_bg.png");
	this.add("how_to", "./../asset/bgs_menus/how_to.png");
	this.add("howto_bg", "./../asset/bgs_menus/howto_bg.png");
	this.add("howto_bg2", "./../asset/bgs_menus/howto_bg2.png");
	this.add("join_graphics", "./../asset/bgs_menus/join_graphics.png");
	this.add("menu_bg", "./../asset/bgs_menus/menu_bg.png");
	this.add("newhighscore_bg", "./../asset/bgs_menus/newhighscore_bg.png");
	this.add("wave_bg", "./../asset/bgs_menus/wave_bg.png");
	this.add("map", "./../asset/map.json");
	this.add("Shoot", "./../asset/sound/Shoot.wav");
	this.add("Splash", "./../asset/sound/Splash.mp3");
	this.add("fastcrack", "./../asset/sound/fastcrack.mp3");
	this.add("help", "./../asset/sound/help.wav");
	this.add("lobby", "./../asset/sound/lobby.mp3");
	this.add("music_bg", "./../asset/sound/music_bg.mp3");
	this.add("repaircomplete", "./../asset/sound/repaircomplete.mp3");
	this.add("saved", "./../asset/sound/saved.wav");
	this.add("wavecomplete", "./../asset/sound/wavecomplete.wav");
	this.add("64_enemy_lepardseal", "./../asset/textures/64_enemy_lepardseal.png");
	this.add("64_penguin_nogun", "./../asset/textures/64_penguin_nogun.png");
	this.add("fish", "./../asset/textures/fish.png");
	this.add("gun_directions2", "./../asset/textures/gun_directions2.png");
	this.add("highscorebar", "./../asset/textures/highscorebar.png");
	this.add("howtoanimation", "./../asset/textures/howtoanimation.png");
	this.add("keyboard", "./../asset/textures/keyboard.png");
	this.add("penguin_texture_64x64", "./../asset/textures/penguin_texture_64x64.png");
	this.add("selected", "./../asset/textures/selected.png");
	this.add("thefont", "./../asset/textures/thefont.png");
};