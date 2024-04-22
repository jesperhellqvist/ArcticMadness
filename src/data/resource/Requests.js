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
    this.add("64_penguin_nogun", "./../asset/64_penguin_nogun.png");
	this.add("bg_720", "./../asset/bg_720.png");
	this.add("enemiestest", "./../asset/enemiestest.png");
	this.add("fish", "./../asset/fish.png");
	this.add("gun_directions", "./../asset/gun_directions.png");
	this.add("gun_directions2", "./../asset/gun_directions2.png");
	this.add("guntest", "./../asset/guntest.png");
	this.add("map", "./../asset/map.json");
	this.add("penguin_texture_64", "./../asset/penguin_texture_64.png");
	this.add("water64_test", "./../asset/water64_test.png");
};