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
    this.add("bg", "./../asset/bg.png");
	this.add("bg2", "./../asset/bg2.png");
	this.add("box", "./../asset/box.png");
	this.add("fish", "./../asset/fish.png");
	this.add("penguin", "./../asset/penguin.png");
	this.add("penguin64", "./../asset/penguin64.png");
	this.add("penguinnopiksel", "./../asset/penguinnopiksel.png");
};