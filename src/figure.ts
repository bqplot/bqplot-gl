// Copyright (c) The bqplot Development Team
// Distributed under the terms of the Modified BSD License.

import * as THREE from 'three';

import {
  Figure, FigureModel, Mark, MarkModel
} from 'bqplot';

import { MODULE_NAME, MODULE_VERSION } from './version';


THREE.ShaderChunk['scales'] =
  require('raw-loader!../shaders/scales.glsl').default;


export class FigureGLModel extends FigureModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: FigureGLModel.model_name,
      _model_module: FigureGLModel.model_module,
      _model_module_version: FigureGLModel.model_module_version,
      _view_name: FigureGLModel.view_name,
      _view_module: FigureGLModel.view_module,
      _view_module_version: FigureGLModel.view_module_version
    };
  }

  static model_name = 'FigureGLModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'FigureGLView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}


export class FigureGLView extends Figure {
  private createWebGLRenderer() {
    // a shared webgl context for all marks
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
      });

      this.renderer.setSize(100, 100);
      this.renderer.setClearAlpha(0);
      this.renderer.setPixelRatio(
        this.model.get('pixel_ratio') || window.devicePixelRatio
      );
    }

    if (this.renderer && !this.el.contains(this.renderer.domElement)) {
      this.el.insertBefore(this.renderer.domElement, this.el.childNodes[1]);
    }
    this.layout_webgl_canvas();
  }

  async add_mark(model: MarkModel) {
    const view = await super.add_mark(model);

    // If the mark needs a WebGL renderer, we create it
    if (view['render_gl']) {
      this.createWebGLRenderer();
    }

    return view;
  }

  update_marks(marks: Mark[]) {
    super.update_marks(marks);

    this.update_gl();
  }

  async render_gl(): Promise<void> {
    // Nothing to render using a WebGL context
    if (!this.renderer) {
      return Promise.resolve();
    }

    const views = await Promise.all(this.mark_views.views);

    // render all marks that have a render_gl method
    this.renderer.autoClear = false;
    this.renderer.autoClearColor = new (THREE.Color as (x) => void)(0x000000);
    this.renderer.clear();

    for (const mark of views) {
      if (mark['render_gl']) {
        mark['render_gl']();
      }
    }
  }

  relayout() {
    super.relayout();

    this.layout_webgl_canvas();
  }

  create_listeners() {
    this.listenTo(this.model, 'change:pixel_ratio', () => {
      if (this.renderer) {
        this.renderer.setPixelRatio(
          this.model.get('pixel_ratio') || window.devicePixelRatio
        );
        this.update_gl();
      }
    });
  }

  async get_svg() {
    return this.render_gl().then(() => {
      return super.get_svg();
    });
  }

  update_gl() {
    if (!this._update_requested) {
      this._update_requested = true;
      requestAnimationFrame(this._update_gl.bind(this));
    }
  }

  _update_gl() {
    this.render_gl();
    this._update_requested = false;
  }

  layout_webgl_canvas() {
    if (this.renderer) {
      this.renderer.domElement.style =
        'left: ' +
        this.margin.left +
        'px; ' +
        'top: ' +
        this.margin.top +
        'px;';
      this.renderer.setSize(this.plotarea_width, this.plotarea_height);
      this.update_gl();
    }
  }

  private _update_requested: boolean;
  renderer: THREE.WebGLRenderer | null;
}
