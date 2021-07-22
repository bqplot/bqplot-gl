import {
    Lines
} from 'bqplot';

import * as THREE from 'three';

import { FigureGLView } from './figure';

import { LinesGLModel } from './LinesGLModel';


export class LinesGLView extends Lines {

  async render() {
    const base_render_promise = super.render();

    // Create material for markers
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        domain_x : { type: "2f", value: [0., 1.] },
        domain_y : { type: "2f", value: [0., 1.] },
        range_x : { type: "2f", value: [0., 1.] },
        range_y : { type: "2f", value: [0., 1.] }
      },
      vertexShader: require('raw-loader!../shaders/lines-vertex.glsl')
        .default,
      fragmentShader: require('raw-loader!../shaders/lines-fragment.glsl')
        .default,
      depthTest: false,
      depthWrite: false,
    });

    await base_render_promise;

    this.update_stroke_width();

    this.geometry = new THREE.BufferGeometry();

    this.geometry.addAttribute(
      'x',
      new THREE.Float32BufferAttribute(this.model.get('x'), 1)
    );
    this.geometry.addAttribute(
      'y',
      new THREE.Float32BufferAttribute(this.model.get('y'), 1)
    );
    this.geometry.setDrawRange(0, Math.min(this.model.get('x').length, this.model.get('y').length));

    this.line = new THREE.Line(this.geometry, this.material);
    this.line.frustumCulled = false;

    this.scene = new THREE.Scene();
    this.scene.add(this.line);

    this.listenTo(this.model, 'change:x change:y', this.update_geometry);

    return base_render_promise;
  }

  update_geometry() {
    this.geometry.setAttribute(
      'x',
      new THREE.Float32BufferAttribute(this.model.get('x'), 1)
    );
    this.geometry.setAttribute(
      'y',
      new THREE.Float32BufferAttribute(this.model.get('y'), 1)
    );
  }

  update_style() {
    // const color = new THREE.Color(this.model.get('colors')[0]);
    // this.material.color = color.toArray();
    // const opacities = this.model.get('opacities');
    // if(opacities && opacities.length) {
    //   this.material.uniforms['opacity'].value = opacities[0];
    // } else {
    //   this.material.uniforms['opacity'].value = 1.;
    // }
    // this.update_scene();
  }

  update_stroke_width() {
    this.material.linewidth = this.model.get('stroke_width');
    this.update_scene();
  }

  update_materials() {
    // this.material.defines = {...this.scale_defines, USE_SCALE_X: true, USE_SCALE_Y: true};
    // this.material.needsUpdate = true;
  }

  update_line_xy() {
    // called when the scales are changing
    this.update_scene();
  }

  render_gl() {
    var fig = this.parent;

    const x_scale = this.scales.x ? this.scales.x : this.parent.scale_x;
    const y_scale = this.scales.y ? this.scales.y : this.parent.scale_y;

    const range_x = this.parent.padded_range('x', x_scale.model);
    const range_y = this.parent.padded_range('y', y_scale.model);

    this.material.uniforms['domain_x'].value = x_scale.scale.domain();
    this.material.uniforms['domain_y'].value = y_scale.scale.domain();

    this.material.uniforms['range_x'].value = range_x;
    this.material.uniforms['range_y'].value = [range_y[1], range_y[0]];
    // this.material.uniforms['resolution'].value = [fig.plotarea_width, fig.plotarea_height];

    fig.renderer.render(this.scene, fig.camera);
  }

  update_scene() {
    this.parent.update_gl();
  }

  relayout() {
    this.update_scene();
  }

  draw(animate) {
    this.set_ranges();
    this.update_line_xy();
    this.update_style();
  }

  line: THREE.Line;

  material: THREE.RawShaderMaterial;
  geometry: THREE.BufferGeometry;
  scene: THREE.Scene;

  model: LinesGLModel;

  parent: FigureGLView;
}
