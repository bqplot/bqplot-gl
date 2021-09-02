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

import { ScatterModel } from 'bqplot';

import { MODULE_NAME, MODULE_VERSION } from './version';

export class ScatterGLModel extends ScatterModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ScatterGLModel.model_name,
      _model_module: ScatterGLModel.model_module,
      _model_module_version: ScatterGLModel.model_module_version,
      _view_name: ScatterGLModel.view_name,
      _view_module: ScatterGLModel.view_module,
      _view_module_version: ScatterGLModel.view_module_version,
    };
  }

  static model_name = 'ScatterGLModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ScatterGLView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}
