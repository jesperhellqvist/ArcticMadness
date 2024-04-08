//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Bullet = function (x, y) {

    this.x = x;
    this.y = y;
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Calls the constructor method of the super class.
     */
    rune.display.Sprite.call(this, this.x, this.y, 32, 32, "box");
}

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Bullet.prototype = Object.create(rune.display.Sprite.prototype);
ArcticMadness.entity.Bullet.prototype.constructor = ArcticMadness.entity.Bullet;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

ArcticMadness.entity.Bullet.prototype.init = function () {
    rune.display.Sprite.prototype.init.call(this);
    this.m_setPhysics();
}

ArcticMadness.entity.Bullet.prototype.update = function (step) {
    rune.display.Sprite.prototype.update.call(this, step);

    this.shoot(this.x, this.y)
    this.m_handleHitBox();
}


ArcticMadness.entity.Bullet.prototype.dispose = function () {
    rune.display.Sprite.prototype.dispose.call(this);   
    console.log("Bullet disposed");
}

ArcticMadness.entity.Bullet.prototype.shoot = function (x, y) {
    this.x = (x + 20);
    this.y = y;
   
   
    this.scaleY = 0.10;


}

//------------------------------------------------------------------------------
// Private methods
//------------------------------------------------------------------------------

ArcticMadness.entity.Bullet.prototype.m_setPhysics = function () {
    this.velocity.drag.x = 0.05;
    this.velocity.drag.y = 0.05;
}

ArcticMadness.entity.Bullet.prototype.m_handleHitBox = function () {
    if (this.x >= this.application.screen.width) {
        this.dispose();
    }
}
