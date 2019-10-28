import { Component } from "../../../GameEngine/Components/Component";
import { CharacterAnimator } from "./CharacterAnimator";
import { GameObject } from "../../../GameEngine/Core/GameObject";

export class CharacterStats extends Component {

    private readonly animator: CharacterAnimator;


    public constructor(gameObject: GameObject, animator: CharacterAnimator) {
        super(gameObject);

        this.animator = animator;
    }
}