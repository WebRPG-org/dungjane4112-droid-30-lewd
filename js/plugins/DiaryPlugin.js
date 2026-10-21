/*:
 * @plugindesc Simple Diary System v1.3 (背景ノート対応＋キャンセルで閉じる)
 * @author You
 *
 * @help
 * プラグインコマンド:
 *   Diary add テキスト    # 日記を追加（同じ内容は重複しない）
 *   Diary show            # 日記画面を表示
 */

(function() {
    var diaryEntries = [];
    var diarySeen = [];

    // === プラグインコマンド ===
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === "Diary") {
            if (args[0] === "add") {
                var text = args.slice(1).join(" ");
                if (!diaryEntries.includes(text)) {
                    diaryEntries.push(text);
                    diarySeen.push(false); // 未読フラグ
                }
            }
            if (args[0] === "show") {
                SceneManager.push(Scene_Diary);
            }
        }
    };

    // === シーン定義 ===
    function Scene_Diary() {
        this.initialize.apply(this, arguments);
    }

    Scene_Diary.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Diary.prototype.constructor = Scene_Diary;

Scene_Diary.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    // 背景画像（最初に addChild → 一番下に表示される）
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = ImageManager.loadPicture("diary_bg");
    this.addChildAt(this._backgroundSprite, 0); // addChildAt(,0)で最背面に配置

    // リストウィンドウ
    this._listWindow = new Window_DiaryList(0, 0, Graphics.boxWidth / 3, Graphics.boxHeight);
    this._listWindow.setHandler('ok', this.onEntryOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._listWindow);

    // 本文ウィンドウ
    this._textWindow = new Window_DiaryText(this._listWindow.width, 0,
        Graphics.boxWidth - this._listWindow.width,
        Graphics.boxHeight);
    this.addWindow(this._textWindow);

    this._listWindow.setTextWindow(this._textWindow);
};

    Scene_Diary.prototype.onEntryOk = function() {
        this._listWindow.activate();
    };

    // === 日記リスト ===
    function Window_DiaryList() {
        this.initialize.apply(this, arguments);
    }

    Window_DiaryList.prototype = Object.create(Window_Selectable.prototype);
    Window_DiaryList.prototype.constructor = Window_DiaryList;

    Window_DiaryList.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._textWindow = null;
        this.refresh();
        this.activate();
        this.select(0);
    };

    Window_DiaryList.prototype.setTextWindow = function(textWindow) {
        this._textWindow = textWindow;
    };

    Window_DiaryList.prototype.maxItems = function() {
        return diaryEntries.length;
    };

    Window_DiaryList.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var num = index + 1;
        var name = num + "日目";
        if (!diarySeen[index]) name += " ★"; // 未読マーク
        this.drawText(name, rect.x, rect.y, rect.width);
    };

    Window_DiaryList.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        if (this._textWindow) {
            var index = this.index();
            this._textWindow.setText(diaryEntries[index] || "");
            diarySeen[index] = true; // カーソルを合わせたら既読に
        }
    };

    // === 日記本文 ===
    function Window_DiaryText() {
        this.initialize.apply(this, arguments);
    }

    Window_DiaryText.prototype = Object.create(Window_Base.prototype);
    Window_DiaryText.prototype.constructor = Window_DiaryText;

    Window_DiaryText.prototype.initialize = function(x, y, w, h) {
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this._text = "";
    };

    Window_DiaryText.prototype.setText = function(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    };

    Window_DiaryText.prototype.refresh = function() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    };

})();
