import { Layer } from '../enums/Layer';
import { Component } from '../../components/Component';

export interface PrefabSettings {
  /**
   * The starting x position of the object.
   */
  x: number;

  /**
   * The starting y position of the object.
   */
  y: number;

  /**
   * The starting rotation (in radians) of the object.
   */
  rotation: number;

  /**
   * The unique string identifier of the object. If it shares the same id as an object, it will automatically be changed to {name} Clone(x)
   */
  id: string;

  /**
   * The tag assocaited with the object. Tag can be used to group objects together (ie, 'enemy' tag for all enemies)
   */
  tag: string;

  /**
   * The collision layer the object belongs to.
   */
  layer: Layer;
}
