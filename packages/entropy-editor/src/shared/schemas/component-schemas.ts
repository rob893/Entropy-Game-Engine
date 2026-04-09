import type { IComponentSchema } from '../types/prefab';

const transformSchema: IComponentSchema = {
  typeName: 'Transform',
  displayName: 'Transform',
  category: 'Core',
  fields: [
    {
      name: 'position',
      displayName: 'Position',
      type: 'vector2',
      defaultValue: { x: 0, y: 0 }
    },
    {
      name: 'rotation',
      displayName: 'Rotation',
      type: 'number',
      defaultValue: 0,
      description: 'Rotation in radians'
    },
    {
      name: 'scale',
      displayName: 'Scale',
      type: 'vector2',
      defaultValue: { x: 1, y: 1 }
    }
  ]
};

const cameraSchema: IComponentSchema = {
  typeName: 'Camera',
  displayName: 'Camera',
  category: 'Core',
  fields: [
    {
      name: 'zoom',
      displayName: 'Zoom',
      type: 'number',
      defaultValue: 1,
      min: 0.1,
      step: 0.1
    },
    {
      name: 'smoothSpeed',
      displayName: 'Smooth Speed',
      type: 'number',
      defaultValue: 5,
      min: 0,
      description: 'Camera follow interpolation speed'
    },
    {
      name: 'viewportWidth',
      displayName: 'Viewport Width',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'viewportHeight',
      displayName: 'Viewport Height',
      type: 'number',
      defaultValue: 0,
      min: 0
    }
  ]
};

const rigidbodySchema: IComponentSchema = {
  typeName: 'Rigidbody',
  displayName: 'Rigidbody',
  category: 'Physics',
  fields: [
    {
      name: 'mass',
      displayName: 'Mass',
      type: 'number',
      defaultValue: 70,
      min: 0,
      description: 'Mass in KG. 0 represents infinite mass.'
    },
    {
      name: 'velocity',
      displayName: 'Velocity',
      type: 'vector2',
      defaultValue: { x: 0, y: 0 }
    },
    {
      name: 'useGravity',
      displayName: 'Use Gravity',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'isKinematic',
      displayName: 'Is Kinematic',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'drag',
      displayName: 'Drag',
      type: 'number',
      defaultValue: 0,
      min: 0
    }
  ]
};

const rectangleColliderSchema: IComponentSchema = {
  typeName: 'RectangleCollider',
  displayName: 'Rectangle Collider',
  category: 'Physics',
  fields: [
    {
      name: 'width',
      displayName: 'Width',
      type: 'number',
      defaultValue: 32,
      min: 0
    },
    {
      name: 'height',
      displayName: 'Height',
      type: 'number',
      defaultValue: 32,
      min: 0
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'vector2',
      defaultValue: { x: 0, y: 0 }
    },
    {
      name: 'isTrigger',
      displayName: 'Is Trigger',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'physicalMaterial.dynamicFriction',
      displayName: 'Dynamic Friction',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 1,
      step: 0.05,
      group: 'Physical Material'
    },
    {
      name: 'physicalMaterial.staticFriction',
      displayName: 'Static Friction',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 1,
      step: 0.05,
      group: 'Physical Material'
    },
    {
      name: 'physicalMaterial.bounciness',
      displayName: 'Bounciness',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 1,
      step: 0.05,
      group: 'Physical Material'
    }
  ]
};

const imageRendererSchema: IComponentSchema = {
  typeName: 'ImageRenderer',
  displayName: 'Image Renderer',
  category: 'Rendering',
  fields: [
    {
      name: 'renderWidth',
      displayName: 'Render Width',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'renderHeight',
      displayName: 'Render Height',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'imageSource',
      displayName: 'Image Source',
      type: 'asset',
      defaultValue: null,
      description: 'Path or data URL of the image'
    }
  ]
};

const rectangleRendererSchema: IComponentSchema = {
  typeName: 'RectangleRenderer',
  displayName: 'Rectangle Renderer',
  category: 'Rendering',
  fields: [
    {
      name: 'renderWidth',
      displayName: 'Render Width',
      type: 'number',
      defaultValue: 32,
      min: 1
    },
    {
      name: 'renderHeight',
      displayName: 'Render Height',
      type: 'number',
      defaultValue: 32,
      min: 1
    },
    {
      name: 'color',
      displayName: 'Fill Color',
      type: 'color',
      defaultValue: null
    },
    {
      name: 'borderColor',
      displayName: 'Border Color',
      type: 'color',
      defaultValue: null
    }
  ]
};

const textRendererSchema: IComponentSchema = {
  typeName: 'TextRenderer',
  displayName: 'Text Renderer',
  category: 'Rendering',
  fields: [
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      defaultValue: ''
    },
    {
      name: 'fontSize',
      displayName: 'Font Size',
      type: 'number',
      defaultValue: 20,
      min: 1
    },
    {
      name: 'fontFamily',
      displayName: 'Font Family',
      type: 'string',
      defaultValue: 'Arial'
    },
    {
      name: 'color',
      displayName: 'Font Color',
      type: 'color',
      defaultValue: 'White'
    },
    {
      name: 'x',
      displayName: 'X',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'y',
      displayName: 'Y',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'zIndex',
      displayName: 'Z Index',
      type: 'number',
      defaultValue: 0
    }
  ]
};

const animatorSchema: IComponentSchema = {
  typeName: 'Animator',
  displayName: 'Animator',
  category: 'Animation',
  fields: [
    {
      name: 'renderWidth',
      displayName: 'Render Width',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'renderHeight',
      displayName: 'Render Height',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'currentFrameSource',
      displayName: 'Current Frame Source',
      type: 'asset',
      defaultValue: null,
      description: 'Path or data URL of the animation frame'
    },
    {
      name: 'loop',
      displayName: 'Loop',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'playToFinish',
      displayName: 'Play To Finish',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'speedPercentage',
      displayName: 'Speed Percentage',
      type: 'number',
      defaultValue: 100,
      min: 1,
      description: 'Animation playback speed as a percentage'
    }
  ]
};

const audioSourceSchema: IComponentSchema = {
  typeName: 'AudioSource',
  displayName: 'Audio Source',
  category: 'Audio',
  fields: [
    {
      name: 'loop',
      displayName: 'Loop',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'playOnStart',
      displayName: 'Play On Start',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'source',
      displayName: 'Audio Source',
      type: 'asset',
      defaultValue: null,
      description: 'Path or data URL of the audio clip'
    }
  ]
};

const navAgentSchema: IComponentSchema = {
  typeName: 'NavAgent',
  displayName: 'Nav Agent',
  category: 'Navigation',
  fields: [
    {
      name: 'speed',
      displayName: 'Speed',
      type: 'number',
      defaultValue: 1,
      min: 0
    }
  ]
};

const sliderSchema: IComponentSchema = {
  typeName: 'Slider',
  displayName: 'Slider',
  category: 'UI',
  fields: [
    {
      name: 'fillColor',
      displayName: 'Fill Color',
      type: 'color',
      defaultValue: 'White'
    },
    {
      name: 'backgroundColor',
      displayName: 'Background Color',
      type: 'color',
      defaultValue: 'Black'
    },
    {
      name: 'renderWidth',
      displayName: 'Render Width',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'renderHeight',
      displayName: 'Render Height',
      type: 'number',
      defaultValue: 0,
      min: 0
    },
    {
      name: 'fillAmount',
      displayName: 'Fill Amount',
      type: 'number',
      defaultValue: 100,
      min: 0,
      max: 100
    },
    {
      name: 'zIndex',
      displayName: 'Z Index',
      type: 'number',
      defaultValue: 0
    }
  ]
};

const clickedOnDetectorSchema: IComponentSchema = {
  typeName: 'ClickedOnDetector',
  displayName: 'Clicked On Detector',
  category: 'Input',
  fields: []
};

const fpsCounterSchema: IComponentSchema = {
  typeName: 'FPSCounter',
  displayName: 'FPS Counter',
  category: 'Debug',
  fields: [
    {
      name: 'zIndex',
      displayName: 'Z Index',
      type: 'number',
      defaultValue: 0
    }
  ]
};

const graphVisualizerSchema: IComponentSchema = {
  typeName: 'GraphVisualizer',
  displayName: 'Graph Visualizer',
  category: 'Debug',
  fields: [
    {
      name: 'defaultColor',
      displayName: 'Default Color',
      type: 'color',
      defaultValue: 'LightGreen'
    }
  ]
};

const weightedGraphVisualizerSchema: IComponentSchema = {
  typeName: 'WeightedGraphVisualizer',
  displayName: 'Weighted Graph Visualizer',
  category: 'Debug',
  fields: [
    {
      name: 'passableColor',
      displayName: 'Passable Color',
      type: 'color',
      defaultValue: 'Blue'
    },
    {
      name: 'unpassableColor',
      displayName: 'Unpassable Color',
      type: 'color',
      defaultValue: 'Red'
    }
  ]
};

const allSchemas: IComponentSchema[] = [
  transformSchema,
  cameraSchema,
  rigidbodySchema,
  rectangleColliderSchema,
  imageRendererSchema,
  rectangleRendererSchema,
  textRendererSchema,
  animatorSchema,
  audioSourceSchema,
  navAgentSchema,
  sliderSchema,
  clickedOnDetectorSchema,
  fpsCounterSchema,
  graphVisualizerSchema,
  weightedGraphVisualizerSchema
];

export const COMPONENT_SCHEMAS: ReadonlyMap<string, IComponentSchema> = new Map(
  allSchemas.map(schema => [schema.typeName, schema])
);
