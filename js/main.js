//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.addEventListener('load', function() {
  if (window.SceneManager && window.Scene_Boot) {
    SceneManager.run(Scene_Boot);
  } else {
    console.error('Game boot objects are missing.');
  }
});
