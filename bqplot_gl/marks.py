from traitlets import Unicode

from bqplot import Scatter


class ScatterGL(Scatter):
    _view_name = Unicode('ScatterGLView').tag(sync=True)
    _model_name = Unicode('ScatterGLModel').tag(sync=True)
