export class Terrain {
    constructor(terrainImage, navGrid, terrainColliders) {
        this.terrainImage = terrainImage;
        this.navGrid = navGrid;
        this.terrainColliders = terrainColliders;
    }
    renderBackground(context) {
        context.drawImage(this.terrainImage, 0, 0);
    }
}
//# sourceMappingURL=Terrain.js.map