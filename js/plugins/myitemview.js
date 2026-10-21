/*:
 * @plugindesc [MV] 大事なもの閲覧専用リスト（決定不可）
 * @help
 * ■使い方
 * 1) プラグインON
 * 2) 呼び出し:
 *   - プラグインコマンド: ShowKeyItemList
 *   - または イベント「スクリプト」: SceneManager.push(Scene_KeyItemList);
 * ・カーソル移動のみ可、決定不可、Bで閉じる
 */

(function() {
  // === 大事なものだけのリスト ===
  function Window_KeyItemList() { this.initialize.apply(this, arguments); }
  Window_KeyItemList.prototype = Object.create(Window_ItemList.prototype);
  Window_KeyItemList.prototype.constructor = Window_KeyItemList;

  Window_KeyItemList.prototype.includes = function(item) {
    return item
  };
  // 決定キー無効化（閲覧専用）
  Window_KeyItemList.prototype.processOk = function() { /* do nothing */ };

  // === シーン ===
  function Scene_KeyItemList() { this.initialize.apply(this, arguments); }
  Scene_KeyItemList.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_KeyItemList.prototype.constructor = Scene_KeyItemList;

  Scene_KeyItemList.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
  };

  Scene_KeyItemList.prototype.createItemWindow = function() {
    var wy = this._helpWindow ? this._helpWindow.height : 0;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_KeyItemList(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('cancel', this.popScene.bind(this)); // Bで閉じる
    this.addWindow(this._itemWindow);

    // ★リスト構築とカーソル設定を明示的に行う
    this._itemWindow.refresh();
    this._itemWindow.select(0);
    this._itemWindow.activate();
  };

  // === MVのプラグインコマンド対応 ===
  var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _pluginCommand.call(this, command, args);
    if (command === 'ShowKeyItemList') {
      SceneManager.push(Scene_KeyItemList);
    }
  };

  // === グローバルに公開（イベント「スクリプト」から参照可） ===
  window.Scene_KeyItemList  = Scene_KeyItemList;
  window.Window_KeyItemList = Window_KeyItemList;
})();
