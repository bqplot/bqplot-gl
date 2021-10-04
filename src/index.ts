// Copyright (c) The bqplot Development Team
// Distributed under the terms of the Modified BSD License.

import * as THREE from 'three';

export * from './version';

THREE.ShaderChunk['scales'] =
  require('raw-loader!../shaders/scales.glsl').default;

export * from './ScatterGLView';
export * from './ScatterGLModel';
export * from './LinesGLView';
export * from './LinesGLModel';
