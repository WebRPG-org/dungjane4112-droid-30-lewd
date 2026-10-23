/*:
 * @plugindesc Cheat Menu. Press T to open.
 * @author xDAEKF4
 */

(function() {

    var CheatState = {
        strLock:  false,
        menuOpen: false
    };

    var STR_VAR   = 64;
    var STR_MAX   = 65;
    var GUT_VAR   = 66;
    var INT_VAR   = 67;
    var CHARM_VAR = 68;
    var HOUR_VAR  = 23;
    var MIN_VAR   = 24;
    var GOLD_VAR  = 69;
    var AFFECTION = 72;
    var AROUSAL   = 73;
    var HORNY     = 74;
    var STAT_ADD  = 20;
    var GOLD_ADD  = 100000;

    var ZONES = [
        { label: 'Mouth',        prog: 81, lvl: 101 },
        { label: 'Right Nipple', prog: 83, lvl: 103 },
        { label: 'Left Nipple',  prog: 85, lvl: 105 },
        { label: 'Cervix',       prog: 87, lvl: 107 },
        { label: 'G-Spot',       prog: 89, lvl: 109 },
        { label: 'Clitoris',     prog: 91, lvl: 111 }
    ];

    var ZONE_AMOUNTS = [1, 5, 10, 25, 50, 100, 500, 1000];

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (CheatState.strLock) {
            var max = $gameVariables.value(STR_MAX);
            $gameVariables.setValue(STR_VAR, max);
        }
    };

    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (CheatState.menuOpen) return false;
        return _Game_Player_canMove.call(this);
    };

    document.addEventListener('keydown', function(e) {
        if (e.keyCode !== 84) return;
        if (CheatState.menuOpen) {
            closeCheatMenu();
        } else {
            openMainMenu();
        }
    });

    function openMainMenu() {
        var scene = SceneManager._scene;
        if (!scene) return;
        CheatState.menuOpen = true;
        SoundManager.playOk();

        var win = new Window_CheatMain();

        win.setHandler('strLock', function() {
            CheatState.strLock = !CheatState.strLock;
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('addGold', function() {
            var current = $gameVariables.value(GOLD_VAR);
            $gameVariables.setValue(GOLD_VAR, current + GOLD_ADD);
            $gameParty.gainGold(GOLD_ADD);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('stats', function() {
            win.deactivate();
            openStatsMenu(win);
        });

        win.setHandler('feels', function() {
            win.deactivate();
            openFeelsMenu(win);
        });

        win.setHandler('zones', function() {
            win.deactivate();
            openZonesMenu(win);
        });

        win.setHandler('cancel', function() {
            closeCheatMenu();
        });

        scene.addWindow(win);
        CheatState._mainWin = win;
    }

    function openStatsMenu(parentWin) {
        var scene = SceneManager._scene;
        if (!scene) return;
        SoundManager.playOk();

        var win = new Window_CheatStats();

        win.setHandler('gut', function() {
            $gameVariables.setValue(GUT_VAR, $gameVariables.value(GUT_VAR) + STAT_ADD);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('int', function() {
            $gameVariables.setValue(INT_VAR, $gameVariables.value(INT_VAR) + STAT_ADD);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('charm', function() {
            $gameVariables.setValue(CHARM_VAR, $gameVariables.value(CHARM_VAR) + STAT_ADD);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('cancel', function() {
            SoundManager.playCancel();
            scene._windowLayer.removeChild(win);
            CheatState._statsWin = null;
            parentWin.activate();
        });

        scene.addWindow(win);
        CheatState._statsWin = win;
    }

    function openFeelsMenu(parentWin) {
        var scene = SceneManager._scene;
        if (!scene) return;
        SoundManager.playOk();

        var win = new Window_CheatFeels();

        win.setHandler('affection', function() {
            $gameVariables.setValue(AFFECTION, $gameVariables.value(AFFECTION) + 100);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('arousal', function() {
            $gameVariables.setValue(AROUSAL, $gameVariables.value(AROUSAL) + 10);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('horny', function() {
            $gameVariables.setValue(HORNY, $gameVariables.value(HORNY) + 10);
            SoundManager.playOk();
            win.refresh();
            win.activate();
        });

        win.setHandler('cancel', function() {
            SoundManager.playCancel();
            scene._windowLayer.removeChild(win);
            CheatState._feelsWin = null;
            parentWin.activate();
        });

        scene.addWindow(win);
        CheatState._feelsWin = win;
    }

    function openZonesMenu(parentWin) {
        var scene = SceneManager._scene;
        if (!scene) return;
        SoundManager.playOk();

        var win = new Window_CheatZones();

        ZONES.forEach(function(zone) {
            win.setHandler('zone_' + zone.prog, function() {
                win.deactivate();
                openZoneAmountMenu(win, zone);
            });
        });

        win.setHandler('cancel', function() {
            SoundManager.playCancel();
            scene._windowLayer.removeChild(win);
            CheatState._zonesWin = null;
            parentWin.activate();
        });

        scene.addWindow(win);
        CheatState._zonesWin = win;
    }

    function openZoneAmountMenu(parentWin, zone) {
        var scene = SceneManager._scene;
        if (!scene) return;
        SoundManager.playOk();

        var win = new Window_CheatZoneAmount(zone);

        ZONE_AMOUNTS.forEach(function(amount) {
            win.setHandler('amount_' + amount, function() {
                $gameVariables.setValue(zone.prog, $gameVariables.value(zone.prog) + amount);
                $gameVariables.setValue(zone.lvl,  $gameVariables.value(zone.lvl)  + amount);
                SoundManager.playOk();
                scene._windowLayer.removeChild(win);
                CheatState._zoneAmountWin = null;
                CheatState._zonesWin.refresh();
                CheatState._zonesWin.activate();
            });
        });

        win.setHandler('cancel', function() {
            SoundManager.playCancel();
            scene._windowLayer.removeChild(win);
            CheatState._zoneAmountWin = null;
            parentWin.activate();
        });

        scene.addWindow(win);
        CheatState._zoneAmountWin = win;
    }

    function closeCheatMenu() {
        var scene = SceneManager._scene;
        SoundManager.playCancel();
        ['_zoneAmountWin', '_zonesWin', '_statsWin', '_feelsWin', '_mainWin'].forEach(function(key) {
            if (CheatState[key] && scene && scene._windowLayer) {
                scene._windowLayer.removeChild(CheatState[key]);
                CheatState[key] = null;
            }
        });
        CheatState.menuOpen = false;
    }

    function Window_CheatMain() { this.initialize.apply(this, arguments); }
    Window_CheatMain.prototype = Object.create(Window_Command.prototype);
    Window_CheatMain.prototype.constructor = Window_CheatMain;

    Window_CheatMain.prototype.initialize = function() {
        var ww = 460;
        var wx = (Graphics.boxWidth  - ww) / 2;
        var wy = (Graphics.boxHeight - this.fittingHeight(8)) / 2;
        Window_Command.prototype.initialize.call(this, wx, wy);
    };

    Window_CheatMain.prototype.windowWidth = function() { return 460; };

    Window_CheatMain.prototype.makeCommandList = function() {
        var gold   = $gameVariables.value(GOLD_VAR);
        var strCur = $gameVariables.value(STR_VAR);
        var strMax = $gameVariables.value(STR_MAX);
        var hour   = $gameVariables.value(HOUR_VAR);
        var min    = $gameVariables.value(MIN_VAR);
        var minStr = min < 10 ? '0' + min : '' + min;
        var strLabel  = 'STR Lock:  ' + (CheatState.strLock ? '[ ON  ]' : '[ OFF ]') + '  (' + strCur + '/' + strMax + ')';
        var goldLabel = '+100,000  (current: ' + gold + ')';
        this.addCommand('-- Cheat Menu --  by xDAEKF4', 'title',   false);
        this.addCommand(strLabel,           'strLock',  true);
        this.addCommand(goldLabel,          'addGold',  true);
        this.addCommand('Stats +20  ►',     'stats',    true);
        this.addCommand('Feels  ►',         'feels',    true);
        this.addCommand('Zones  ►',         'zones',    true);
        this.addCommand('Close',            'cancel',   true);
    };

    function Window_CheatStats() { this.initialize.apply(this, arguments); }
    Window_CheatStats.prototype = Object.create(Window_Command.prototype);
    Window_CheatStats.prototype.constructor = Window_CheatStats;

    Window_CheatStats.prototype.initialize = function() {
        var ww = 460;
        var wx = (Graphics.boxWidth  - ww) / 2;
        var wy = (Graphics.boxHeight - this.fittingHeight(5)) / 2;
        Window_Command.prototype.initialize.call(this, wx, wy);
    };

    Window_CheatStats.prototype.windowWidth = function() { return 460; };

    Window_CheatStats.prototype.makeCommandList = function() {
        var gut   = $gameVariables.value(GUT_VAR);
        var int_  = $gameVariables.value(INT_VAR);
        var charm = $gameVariables.value(CHARM_VAR);
        this.addCommand('-- Stats +20 --',                 'title', false);
        this.addCommand('GUT    (current: ' + gut   + ')', 'gut',   true);
        this.addCommand('INT    (current: ' + int_  + ')', 'int',   true);
        this.addCommand('CHARM  (current: ' + charm + ')', 'charm', true);
        this.addCommand('◄ Back', 'cancel', true);
    };

    function Window_CheatFeels() { this.initialize.apply(this, arguments); }
    Window_CheatFeels.prototype = Object.create(Window_Command.prototype);
    Window_CheatFeels.prototype.constructor = Window_CheatFeels;

    Window_CheatFeels.prototype.initialize = function() {
        var ww = 460;
        var wx = (Graphics.boxWidth  - ww) / 2;
        var wy = (Graphics.boxHeight - this.fittingHeight(5)) / 2;
        Window_Command.prototype.initialize.call(this, wx, wy);
    };

    Window_CheatFeels.prototype.windowWidth = function() { return 460; };

    Window_CheatFeels.prototype.makeCommandList = function() {
        var aff = $gameVariables.value(AFFECTION);
        var aro = $gameVariables.value(AROUSAL);
        var hor = $gameVariables.value(HORNY);
        this.addCommand('-- Feels --',                             'title',     false);
        this.addCommand('Affection  +100  (current: ' + aff + ')', 'affection', true);
        this.addCommand('Arousal    +10   (current: ' + aro + ')', 'arousal',   true);
        this.addCommand('Horny      +10   (current: ' + hor + ')', 'horny',     true);
        this.addCommand('◄ Back', 'cancel', true);
    };

    function Window_CheatZones() { this.initialize.apply(this, arguments); }
    Window_CheatZones.prototype = Object.create(Window_Command.prototype);
    Window_CheatZones.prototype.constructor = Window_CheatZones;

    Window_CheatZones.prototype.initialize = function() {
        var ww = 520;
        var wx = (Graphics.boxWidth  - ww) / 2;
        var wy = (Graphics.boxHeight - this.fittingHeight(ZONES.length + 2)) / 2;
        Window_Command.prototype.initialize.call(this, wx, wy);
    };

    Window_CheatZones.prototype.windowWidth = function() { return 520; };

    Window_CheatZones.prototype.makeCommandList = function() {
        this.addCommand('-- Zones --', 'title', false);
        ZONES.forEach(function(zone) {
            var prog  = $gameVariables.value(zone.prog);
            var lvl   = $gameVariables.value(zone.lvl);
            var label = zone.label + '  (prog: ' + prog + '  lvl: ' + lvl + ')  ►';
            this.addCommand(label, 'zone_' + zone.prog, true);
        }, this);
        this.addCommand('◄ Back', 'cancel', true);
    };

    function Window_CheatZoneAmount(zone) {
        this._zone = zone;
        this.initialize.apply(this, arguments);
    }

    Window_CheatZoneAmount.prototype = Object.create(Window_Command.prototype);
    Window_CheatZoneAmount.prototype.constructor = Window_CheatZoneAmount;

    Window_CheatZoneAmount.prototype.initialize = function(zone) {
        this._zone = zone;
        var ww = 360;
        var wx = (Graphics.boxWidth  - ww) / 2;
        var wy = (Graphics.boxHeight - this.fittingHeight(ZONE_AMOUNTS.length + 2)) / 2;
        Window_Command.prototype.initialize.call(this, wx, wy);
    };

    Window_CheatZoneAmount.prototype.windowWidth = function() { return 360; };

    Window_CheatZoneAmount.prototype.makeCommandList = function() {
        var zoneName = this._zone ? this._zone.label : '?';
        this.addCommand('+ ' + zoneName, 'title', false);
        ZONE_AMOUNTS.forEach(function(amount) {
            this.addCommand('+' + amount, 'amount_' + amount, true);
        }, this);
        this.addCommand('◄ Back', 'cancel', true);
    };

})();