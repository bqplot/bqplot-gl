from traitlets import Unicode

from ipywidgets import register

from bqplot import Scatter, Lines

from ._version import __version__


__all__ = ['ScatterGL', 'LinesGL']


@register
class ScatterGL(Scatter):
    _view_name = Unicode('ScatterGLView').tag(sync=True)
    _model_name = Unicode('ScatterGLModel').tag(sync=True)
    _model_module = Unicode('bqplot-gl').tag(sync=True)
    _view_module = Unicode('bqplot-gl').tag(sync=True)
    _view_module_version = Unicode('^' + __version__).tag(sync=True)
    _model_module_version = Unicode('^' + __version__).tag(sync=True)


@register
class LinesGL(Lines):
    _view_name = Unicode('LinesGLView').tag(sync=True)
    _model_name = Unicode('LinesGLModel').tag(sync=True)
    _view_module = Unicode('bqplot-gl').tag(sync=True)
    _model_module = Unicode('bqplot-gl').tag(sync=True)
    _view_module_version = Unicode('^' + __version__).tag(sync=True)
    _model_module_version = Unicode('^' + __version__).tag(sync=True)
