#!/usr/bin/env python
# coding: utf-8

# Copyright (c) The bqplot Development Team.
# Distributed under the terms of the Modified BSD License.

from traitlets import Unicode

from bqplot import Figure

from ._frontend import module_name, module_version


class FigureGL(Figure):
    """TODO: Add docstring here
    """
    _view_name = Unicode('FigureGLView').tag(sync=True)
    _model_name = Unicode('FigureGLModel').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
