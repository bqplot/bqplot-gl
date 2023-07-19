# bqplot-gl

Plugin to bqplot powered by WebGL.

## Requirements

You need bqplot 0.13

```bash
pip install --pre bqplot
```

## Usage

bqplot-gl provides marks that make use of WebGL for the rendering, providing better performances.

Those marks have the same APIs as their equivalent in bqplot.

```python
from bqplot import *
from bqplot_gl import LinesGL, ScatterGL
```
