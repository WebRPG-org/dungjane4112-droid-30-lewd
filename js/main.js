//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);
window.discordAuthCompleted = true;
window.addEventListener('load', function() {
  if (window.SceneManager && window.Scene_Boot) {
    SceneManager.run(Scene_Boot);
  } else {
    console.error('Game boot objects are missing.');
  }
});
