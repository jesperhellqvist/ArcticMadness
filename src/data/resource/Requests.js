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
	this.add("Splash", "./../asset/Splash.mp3");
	this.add("fish", "./../asset/fish.png");
	this.add("gun_directions2", "./../asset/gun_directions2.png");
	this.add("map", "./../asset/map.json");
	this.add("map_testcracks", "./../asset/map_testcracks.png");
	this.add("map_texture", "./../asset/map_texture.png");
	this.add("map_texture_64x64", "./../asset/map_texture_64x64.png");
};