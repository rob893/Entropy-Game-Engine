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
   * An optional stable identifier for the object.
   */
  id?: string;

  /**
   * The human-readable name of the object.
   */
  name: string;

  /**
   * The tag assocaited with the object. Tag can be used to group objects together (ie, 'enemy' tag for all enemies)
   */
  tag: string;

  /**
   * The collision layer the object belongs to.
   */
  layer: Layer;
}
