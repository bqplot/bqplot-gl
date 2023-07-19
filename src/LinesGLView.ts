import { isLinearScale } from 'bqscales';

import { Lines } from 'bqplot';

import * as THREE from 'three';

// @ts-ignore This should not be needed if we upgrade to newer versions of ThreeJS
window.THREE = THREE;

import 'three/examples/js/lines/LineSegments2';
import 'three/examples/js/lines/Line2';
import 'three/examples/js/lines/LineMaterial';
import 'three/examples/js/lines/LineSegmentsGeometry';
import 'three/examples/js/lines/LineGeometry';

import { LinesGLModel } from './LinesGLModel';

import { Values } from './values';

import { ScaleType, initializeBqplotFigure } from './utils';

export class LinesGLView extends Lines {
  async render() {
    await super.render();

    initializeBqplotFigure(this.parent);

    // Create material for markers
    this.material = new THREE.LineMaterial();
    this.material.uniforms.domain_x = { type: '2f', value: [0, 1] };
    this.material.uniforms.domain_y = { type: '2f', value: [0, 1] };
    this.material.uniforms.range_x = { type: '2f', value: [0, 1] };
    this.material.uniforms.range_y = { type: '2f', value: [0, 1] };
    this.material.uniforms.diffuse = { type: '3f', value: [1, 0, 0] };
    this.material.uniforms.opacity = { type: 'f', value: 1.0 };

    this.material.defines.USE_SCALE_X = true;
    this.material.defines.USE_SCALE_Y = true;
    this.material.defines.SCALE_TYPE_X = ScaleType.SCALE_TYPE_LINEAR;
    this.material.defines.SCALE_TYPE_Y = ScaleType.SCALE_TYPE_LINEAR;

    this.updateMaterialScales();

    this.material.onBeforeCompile = this.beforeCompile;

    this.update_stroke_width();
    this.update_style();

    this.geometry = new THREE.LineGeometry();
    this.updateGeometry();

    this.line = new THREE.Line2(this.geometry, this.material);
    this.line.frustumCulled = false;

    this.scene = new THREE.Scene();
    this.scene.add(this.line);

    this.listenTo(this.model, 'change:x change:y', this.updateGeometry);
    this.listenTo(this.model, 'change:stroke_width', this.update_stroke_width);

    this.parent.extras.webGLMarks.push(this);
    this.parent.extras.webGLRequestRender();
  }

  beforeCompile(shader) {
    // we include the scales header, and a snippet that uses the scales
    shader.vertexShader =
      '// added by bqplot-image-gl\n#include <scales>\n // added by bqplot-image-gl\n' +
      shader.vertexShader;

    const transform = `
      vec3 instanceStart_transformed = instanceStart;
      vec3 instanceEnd_transformed = instanceEnd;
      instanceStart_transformed.x = SCALE_X(instanceStart_transformed.x);
      instanceStart_transformed.y = SCALE_Y(instanceStart_transformed.y);
      instanceEnd_transformed.x = SCALE_X(instanceEnd_transformed.x);
      instanceEnd_transformed.y = SCALE_Y(instanceEnd_transformed.y);
      vec4 start = modelViewMatrix * vec4( instanceStart_transformed, 1.0 );
      vec4 end = modelViewMatrix * vec4( instanceEnd_transformed, 1.0 );
    `;

    // we modify the shader to replace a piece
    const begin = 'vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );';
    const offset_begin = shader.vertexShader.indexOf(begin);
    if (offset_begin == -1) {
      console.error('Could not find magic begin line in shader');
    }
    const end = 'vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );';
    const offset_end = shader.vertexShader.indexOf(end);
    if (offset_end == -1) {
      console.error('Could not find magic end line in shader');
    }
    shader.vertexShader =
      shader.vertexShader.slice(0, offset_begin) +
      transform +
      shader.vertexShader.slice(offset_end + end.length);
  }

  updateGeometry() {
    const scalar_names = ['x', 'y', 'z'];
    const vector4_names = [];
    const get_value = (name, index, default_value) => {
      if (name === 'z') {
        return 0;
      }
      return this.model.get(name);
    };
    const sequence_index = 0; // not used (see ipyvolume)
    const current = new Values(
      scalar_names,
      [],
      get_value,
      sequence_index,
      vector4_names
    );
    current.ensure_array('z');
    current.merge_to_vec3(['x', 'y', 'z'], 'position');
    // important to reset this, otherwise we may use an old buffered value
    // Note that if we upgrade threejs, this may be named differently https://github.com/mrdoob/three.js/issues/18990
    this.geometry.maxInstancedCount = undefined;
    this.geometry.setDrawRange(
      0,
      Math.min(this.model.get('x').length, this.model.get('y').length)
    );
    this.geometry.setPositions(current.array_vec3['position']);

    this.parent.extras.webGLRequestRender();
  }

  update_line_xy(animate: boolean) {
    this.parent.extras.webGLRequestRender();
  }

  update_style() {
    const color = new THREE.Color(this.model.get('colors')[0]);
    this.material.color = color.toArray();
    const opacities = this.model.get('opacities');
    if (opacities && opacities.length) {
      this.material.uniforms.opacity.value = opacities[0];
    } else {
      this.material.uniforms.opacity.value = 1;
    }
    this.parent.extras.webGLRequestRender();
  }

  update_stroke_width() {
    this.material.linewidth = this.model.get('stroke_width');
    this.parent.extras.webGLRequestRender();
  }

  updateMaterialScales() {
    const x_scale = this.scales.x ? this.scales.x : this.parent.scale_x;
    const y_scale = this.scales.y ? this.scales.y : this.parent.scale_y;

    this.material.defines.SCALE_TYPE_X = isLinearScale(x_scale)
      ? ScaleType.SCALE_TYPE_LINEAR
      : ScaleType.SCALE_TYPE_LOG;
    this.material.defines.SCALE_TYPE_Y = isLinearScale(y_scale)
      ? ScaleType.SCALE_TYPE_LINEAR
      : ScaleType.SCALE_TYPE_LOG;

    this.material.needsUpdate = true;
  }

  renderGL() {
    const fig = this.parent;

    const x_scale = this.scales.x ? this.scales.x : this.parent.scale_x;
    const y_scale = this.scales.y ? this.scales.y : this.parent.scale_y;

    const range_x = this.parent.padded_range('x', x_scale.model);
    const range_y = this.parent.padded_range('y', y_scale.model);

    this.material.uniforms['domain_x'].value = x_scale.scale.domain();
    this.material.uniforms['domain_y'].value = y_scale.scale.domain();

    this.material.uniforms['range_x'].value = range_x;
    this.material.uniforms['range_y'].value = [range_y[1], range_y[0]];
    this.material.uniforms['resolution'].value = [
      fig.plotareaWidth,
      fig.plotareaHeight,
    ];
    this.updateMaterialScales();

    const { renderer, camera } = fig.extras.webGLRenderer;
    renderer.render(this.scene, camera);
  }

  draw(animate) {}

  line: THREE.Line2;

  material: THREE.LineMaterial;
  geometry: THREE.LineGeometry;
  scene: THREE.Scene;

  model: LinesGLModel;
}
