from traitlets import Unicode

from ipywidgets import register

from bqplot import Scatter, Lines

from ._frontend import module_version


__all__ = ['ScatterGL', 'LinesGL']


@register
class ScatterGL(Scatter):
    _view_name = Unicode('ScatterGLView').tag(sync=True)
    _model_name = Unicode('ScatterGLModel').tag(sync=True)
    _model_module = Unicode('bqplot-gl').tag(sync=True)
    _view_module = Unicode('bqplot-gl').tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)


@register
class LinesGL(Lines):
    _view_name = Unicode('LinesGLView').tag(sync=True)
    _model_name = Unicode('LinesGLModel').tag(sync=True)
    _view_module = Unicode('bqplot-gl').tag(sync=True)
    _model_module = Unicode('bqplot-gl').tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
