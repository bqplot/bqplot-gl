// Copyright (c) The bqplot Development Team
// Distributed under the terms of the Modified BSD License.

import {
  Figure, FigureModel
} from 'bqplot';

import { MODULE_NAME, MODULE_VERSION } from './version';


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


// TODO Remove webgl stuffs from the Figure class and move them here
export class FigureGLView extends Figure {
  // render() {
  //   super.render();
  // }
}
