import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';

export class Weapon extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        return [new RectangleRenderer(this, 15, 10, 'white')];
    }
}