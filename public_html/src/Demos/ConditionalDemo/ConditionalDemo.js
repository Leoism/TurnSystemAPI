/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, Settings: false */
/* find out more about jslint: http://www.jslint.com/help.html */

const actions = {
    NONE = 0,
    TOP_LEFT = 1,
    TOP = 2,
    TOP_RIGHT = 3,
    MID_LEFT = 4,
    MID = 5,
    MID_RIGHT = 6,
    BOT_LEFT = 7,
    BOT = 8,
    BOT_RIGHT = 9
};

class ConditionalDemo {
    /*
     * Design:
     * 
     * tic-tac-toe Demo
     * Players: 2
     * Each Player:
     * - Mouse click to place an action
     * - Click 'space' to end the turn
     * 
     * Need a 3 by 3 matrix box
     * 2 sprite: cross and circle
     */
    
    constructor() {
        this.kCrossSprite = 'assets/conditionalDemo/Cross.png';
        this.kCircleSprite = 'assets/conditionalDemo/Circle.png';
        this.kFont = 'assets/fonts/Consolas-24';
        this.mMaxPlayerNum = 2;
        this.mTurnType = 'conditional';
        this.mNumBoxPerRow = 3;
        
        this.mMatrixRenderables = null; // Renderables for the boxes
        this.mActionsArr = null; // 3 * 3 actions
        this.mActionsRens = null;
        this.mParameters = null;
        
        this.mCamera = null;
        this.mTurnSystem = null;
        this.mCurrentPlayer = null;
        this.mInstruction = null;
    }
    
    // Begin Scene: must load all the scene contents
    // when done 
    //  => start the GameLoop
    // The game loop will call initialize and then update/draw
    loadScene() {
        gEngine.Textures.loadTexture(this.kCrossSprite);
        gEngine.Textures.loadTexture(this.kCircleSprite);
        gEngine.Fonts.loadFont(this.kFont);
    }
    
    // Performs all initialization functions
    //   => Should call gEngine.GameLoop.start(this)!
    initialize() {
        // Initialize matrix renderables
        this._initMatrixRenderables();
        
        // Initialize action double array
        this._initActionArray();
        
        // Initialize Camera
        this._initCamera();
        
        // Initialize TurnSystem
        this._initTurnSystem();
        
        // Initialize the Current Player Status renderable
        this._initCurrentPlayerRenderable();
        
        // Initialize the Instruction font renderable
        this._initInstructionRenderable();
    }
    
    // update function to be called form EngineCore.GameLoop
    update() {
        // Check user Input
        this._userInput();
        
        // update user status
        this._updateCurrentPlayer();
        
        this.mTurnSystem.calculateNextTurn();
    }
    
    // draw function to be called from EngineCore.GameLoop
    draw() {
        // Set Canvas background to light gray
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Set the Camera projection
        this.mCamera.setupViewProjection();
        
        // Draw the matrix renderable
        this._drawMatrixRenderables(this.mCamera);
        
        // Draw the status font renderables
        this._drawFontRenderables(this.mCamera);
    }
    
    // Must unload all resources
    unloadScene() {
        gEngine.Textures.unloadTexture(this.kCrossSprite);
        gEngine.Textures.unloadTexture(this.kCircleSprite);
        gEngine.Fonts.unloadFont(this.kFont);
    }
    
    // Create and return the matrix's border renderable
    _createBorderRen(xPos, yPos, width, height) {
        var ren = new Renderable();
        ren.setColor([0,0,0,1]);
        ren.getXform().setPosition(xPos, yPos);
        ren.getXform().setSize(width, height);
        return ren;
    }
    
    // Initialize the matrix 3 * 3 renderables
    _initMatrixRenderables() {
        // Parameters:
        const center = vec2.fromValues(100,75);
        const boxWidth = 20; // square's width; width = height
        const renWidth = 0.5;
        
        // 8 renderables: top, bottom, left, right, 2 verticles, 2 horizontals
        const top = this._createBorderRen(center[0],                   
                                          center[1] + (boxWidth * 1.5),
                                          boxWidth * this.mNumBoxPerRow,
                                          renWidth);
        const bottom = this._createBorderRen(center[0],
                                             center[1] - (boxWidth * 1.5),
                                             boxWidth * this.mNumBoxPerRow,
                                             renWidth);
        const left = this._createBorderRen(center[0] - (boxWidth * 1.5),
                                           center[1],
                                           renWidth,
                                           boxWidth * this.mNumBoxPerRow);
        const right = this._createBorderRen(center[0] + (boxWidth * 1.5),
                                           center[1],
                                           renWidth,
                                           boxWidth * this.mNumBoxPerRow);
        const leftVertical = this._createBorderRen(center[0] - (boxWidth * 0.5),
                                                   center[1],
                                                   renWidth,
                                                   boxWidth * this.mNumBoxPerRow);                                   
        const rightVertical = this._createBorderRen(center[0] + (boxWidth * 0.5),
                                                    center[1],
                                                    renWidth,
                                                    boxWidth * this.mNumBoxPerRow);
        const topHorizontal = this._createBorderRen(center[0],
                                                    center[1] + (boxWidth * 0.5),
                                                    boxWidth * this.mNumBoxPerRow,
                                                    renWidth);
        const bottomHorizontal = this._createBorderRen(center[0],
                                                       center[1] - (boxWidth * 0.5),
                                                       boxWidth * this.mNumBoxPerRow,
                                                       renWidth);
                                                       
        this.mMatrixRenderables = {top, bottom, left, right, leftVertical, rightVertical, topHorizontal, bottomHorizontal};
        this.mParameters = this.Parameters(center, boxWidth, renWidth);
    }
    
    // Initialize the action's 3 * 3 double array
    _initActionArray() {
        this.mActionsArr = [];
        for (var i = 0; i < 3; i++) {
            this.mActionsArr.push([-1,-1,-1]);
        }
    }
    
    // Called from initialize. Initialize the mCamera
    _initCamera() {
        // Set up the cameras
        this.mCamera = new Camera(
          vec2.fromValues(100, 75), // position of the camera
          200, // width of camera
          [0, 0, 800, 600] // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
    }
    
    // Called from _initTurnSystem. Initialize the users in the game.
    _initUsers() {
        var player1 = new Player(0, "Player 1: Cross", [0,0,0,1], this.kFont, this.kCrossSprite, 2, 15);
        var player2 = new Player(1, "Player 2: Circle", [0,0,0,1], this.kFont, this.kCircleSprite, 2, 10);
        this.mTurnSystem.addUser(player1);
        this.mTurnSystem.addUser(player2);
    }
    
    // Called from initialize. Initialize the mTurnSystem
    _initTurnSystem() {
        // Define Conditional callbackfunction
        function conditionFun (user) {
            if (user.isMetCondition === true) {
                return true;
            }
            return false;
        }
        
        // use the builder class for setting
        var settingBuilder = new Settings.Builder();
        settingBuilder.setTurnType(this.mTurnType); // 'conditional'
        settingBuilder.setMaxUsers(this.mMaxPlayerNum); // only 2 players 
        settingBuilder.setCallbackFunction(conditionFun);

        // Transform the builder into setting into TurnSystem
        const setting = settingBuilder.build();
        this.mTurnSystem = new TurnSystem(setting);
        this._initUsers();
    }
    
    // Initialize the font renderable's parameters
    _initText(font, posX, posY, color, textH) {
        font.setColor(color);
        font.getXform().setPosition(posX, posY);
        font.setTextHeight(textH);
    }
    
    // Initialize the CurrentPlayer font renderable
    _initCurrentPlayerRenderable() {
        this.mCurrentPlayer = new FontRenderable('Current Player: ');
        this.mCurrentPlayer.setFont(this.kFont);
        this._initText(this.mCurrentPlayer, 2, 5, [0, 0, 0, 1], 4);
    }
    
    // Initialize the Instruction font renderable
    _initInstructionRenderable() {
        this.mInstruction = new FontRenderable('E to End turn, left click to select box');
        this.mInstruction.setFont(this.kFont);
        this._initText(this.mInstruction, 2, 147, [0, 0, 0, 1], 4);
    }
    
    // Player makes a move
    _playerAction() {
        const xPos = gEngine.Input.getMousePosX();
        const yPos = gEngine.Input.getMousePosY();
        
        const maxX = this.mParameters.mMaxX;
        const minX = this.mParameters.mMinX;
        const maxY = this.mParameters.mMaxY;
        const minY = this.mParameters.mMinY;
        const boxWidth = this.mParameters.mBoxWidth;
        
        // Test which box the mouse position falls within
        var action = actions.NONE;
        
        // Test TOP_LEFT
        if ((xPos >= minX && xPos < (minX + boxWidth)) &&
            (yPos <= maxY && yPos > (maxY - boxWidth))) {
            
        }
        // Test TOP
        if ((xPos >= (minX + boxWidth) && xPos < (minX + 2 * boxWidth)) &&
            (yPos <= maxY && yPos > (maxY - boxWidth))) {
            
        }
        // Test TOP_RIGHT
        if ((xPos >= (minX + 2 * boxWidth) && xPos < maxX) &&
            (yPos <= maxY && yPos > (maxY - boxWidth))) {
            
        }
        // Test MID_LEFT
        if ((xPos >= minX && xPos < (minX + boxWidth)) &&
            (yPos <= this.mParameters.mMaxY && yPos > (this.mParameters.mMaxY - this.mParameters.mBoxWidth))) {
            
        }
        // Test MID
        if ((xPos >= (minX + boxWidth) && xPos < (minX + 2 * boxWidth)) &&
            (yPos <= this.mParameters.mMaxY && yPos > (this.mParameters.mMaxY - this.mParameters.mBoxWidth))) {
            
        }
        // Test MID_RIGHT
        if ((xPos >= (minX + 2 * boxWidth) && xPos < maxX) &&
            (yPos <= this.mParameters.mMaxY && yPos > (this.mParameters.mMaxY - this.mParameters.mBoxWidth))) {
            
        }
        // Test BOT_LEFT
        if ((xPos >= minX && xPos < (minX + boxWidth)) &&
            (yPos <= this.mParameters.mMaxY && yPos > (this.mParameters.mMaxY - this.mParameters.mBoxWidth))) {
            
        }
        // Test BOT
        if ((xPos >= (minX + boxWidth) && xPos < (minX + 2 * boxWidth)) &&
            (yPos <= this.mParameters.mMaxY && yPos > (this.mParameters.mMaxY - this.mParameters.mBoxWidth))) {
            
        }
        // Test BOT_RIGHT
        if ((xPos >= (minX + 2 * boxWidth) && xPos < maxX) &&
            (yPos <= this.mParameters.mMaxY && yPos > (this.mParameters.mMaxY - this.mParameters.mBoxWidth))) {
            
        }
    }
    
    // Check user's input
    _userInput() {
        // End turn
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.E)) {
            this.mTurnSystem.getCurrentUser().isMetCondition = true;
        }
        
        if (gEngine.Input.isButtonClicked(gEngine.Input.keys.Left)) {
            this._playerAction();
        }
    }
    
    // Update the text in the CurrentPlayer font renderable based on current player
    _updateCurrentPlayer() {
        var curPlayer = this.mTurnSystem.getCurrentUser();
        this.mCurrentPlayer.setText("Current Player: Player " + (curPlayer.getIndex() + 1));
    }
    
    // Draw the matrix renderables
    _drawMatrixRenderables(cam) {
        this.mMatrixRenderables.top.draw(cam);
        this.mMatrixRenderables.bottom.draw(cam);
        this.mMatrixRenderables.left.draw(cam);
        this.mMatrixRenderables.right.draw(cam);
        this.mMatrixRenderables.leftVertical.draw(cam);
        this.mMatrixRenderables.rightVertical.draw(cam);
        this.mMatrixRenderables.topHorizontal.draw(cam);
        this.mMatrixRenderables.bottomHorizontal.draw(cam);
    }
    
    // Draw all the Font renderables
    _drawFontRenderables(cam) {
        this.mCurrentPlayer.draw(cam);
        this.mInstruction.draw(cam);
        
        var numPlayers = this.mTurnSystem.getNumUsers();
        for (var i = 0; i < numPlayers; i++) {
            this.mTurnSystem.getUserByIndex(i).draw(cam);
        }
    }
}

ConditionalDemo.Parameters = class {
    constructor(center, boxWidth, renWidth) {
        // Parameters:
        this.mCenter = center;
        this.mBoxWidth = boxWidth; // square's width; width = height
        this.mRenWidth = renWidth;
        this.mMaxX = center[0] + (boxWidth * 1.5);
        this.mMinX = center[0] - (boxWidth * 1.5);
        this.mMaxY = center[1] + (boxWidth * 1.5);
        this.mMinY = center[1] - (boxWidth * 1.5);
    }
};
