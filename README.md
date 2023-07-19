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

import numpy as np
import pandas as pd

n_points = 150_000

np.random.seed(0)
y = np.cumsum(np.random.randn(n_points)) + 100.

sc_x = LinearScale()
sc_y = LinearScale()

scatter = ScatterGL(
    x=np.arange(len(y)), y=y,
    default_size=1,
    scales={'x': sc_x, 'y': sc_y}
)
ax_x = Axis(scale=sc_x, label='Index')
ax_y = Axis(scale=sc_y, orientation='vertical', label='Points')

Figure(marks=[scatter], axes=[ax_x, ax_y], title='Scatter powered by WebGL')
```

[bqplot-gl](https://github.com/bqplot/bqplot-gl/assets/21197331/55b88909-3120-41b6-a3ad-494850407bc7)
