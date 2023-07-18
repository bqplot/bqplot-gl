#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

import os
from os.path import join as pjoin
from setuptools import setup


from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)


HERE = os.path.dirname(os.path.abspath(__file__))

name = 'bqplot-gl'

# Get the version
version = get_version(pjoin('bqplot_gl', '_version.py'))

# Representative files that should exist after a successful build
jstargets = [
    pjoin(HERE, 'bqplot_gl', 'nbextension', 'index.js'),
    pjoin(HERE, 'lib', 'plugin.js'),
]


package_data_spec = {
    name: [
        'nbextension/**js*',
        'labextension/**'
    ]
}


data_files_spec = [
    ('share/jupyter/nbextensions/bqplot-gl', 'bqplot_gl/nbextension', '**'),
    ('share/jupyter/labextensions/bqplot-gl', 'bqplot_gl/labextension', '**'),
    ('share/jupyter/labextensions/bqplot-gl', '.', 'install.json'),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'bqplot-gl.json'),
]


cmdclass = create_cmdclass(
    'jsdeps', package_data_spec=package_data_spec,
    data_files_spec=data_files_spec
)
cmdclass['jsdeps'] = combine_commands(
    install_npm(HERE, build_cmd='build:prod', npm=['yarn']),
    ensure_targets(jstargets),
)

setup(version=version, cmdclass=cmdclass)
