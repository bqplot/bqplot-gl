/* Copyright 2015 Bloomberg Finance L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MarkModel } from 'bqplot';

import { MODULE_NAME, MODULE_VERSION } from './version';
import { array_or_json_serializer } from './serializers';


export class ScatterGLModel extends MarkModel {
  defaults() {
    return {
      ...MarkModel.prototype.defaults(),
      _model_name: ScatterGLModel.model_name,
      _model_module: ScatterGLModel.model_module,
      _model_module_version: ScatterGLModel.model_module_version,
      _view_name: ScatterGLModel.view_name,
      _view_module: ScatterGLModel.view_module,
      _view_module_version: ScatterGLModel.view_module_version,
      x: [],
      y: [],
      color: null,
      skew: null,
      marker: 'circle',
      stroke: null,
      stroke_width: 1.5,
      default_skew: 0.5,
      default_size: 64,
      names: [],
      display_names: true,
      fill: true,
      drag_color: null,
      drag_size: 5.0,
      names_unique: true,
    };
  }

  initialize(attributes: any, options: {
    model_id: string;
    comm?: any;
    widget_manager: any;
  }) {
    super.initialize(attributes, options);
    this.update_domains();
  }

  update_domains() {
    // color scale needs an issue in DateScaleModel to be fixed. It
    // should be moved here as soon as that is fixed.
    const scales = this.get('scales');
    for (const key in scales) {
      if (scales.hasOwnProperty(key) && key != 'color') {
        const scale = scales[key];
        if (!this.get('preserve_domain')[key]) {
          scale.compute_and_set_domain(this.get(key), this.model_id + key);
        } else {
          scale.del_domain([], this.model_id + key);
        }
      }
    }
  }

  static serializers = {
    ...MarkModel.serializers,
    x: array_or_json_serializer,
    y: array_or_json_serializer,
    color: array_or_json_serializer,
    size: array_or_json_serializer,
    rotation: array_or_json_serializer,
    opacity: array_or_json_serializer,
    opacities: array_or_json_serializer,
  };

  static model_name = 'ScatterGLModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ScatterGLView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}
