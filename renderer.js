class Renderer {
  draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    background.update();

    player.update();

    player.burgers.forEach(burger => {
      burger.update();
    })

    enemyBuilder.update();
  }
}