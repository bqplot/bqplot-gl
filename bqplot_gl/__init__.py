#!/usr/bin/env python
# coding: utf-8

# Copyright (c) The bqplot Development Team.
# Distributed under the terms of the Modified BSD License.

from .marks import *  # noqa
from ._version import __version__  # noqa


def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': 'bqplot-gl',
    }]


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'nbextension',
        'dest': 'bqplot-gl',
        'require': 'bqplot-gl/extension'
    }]
