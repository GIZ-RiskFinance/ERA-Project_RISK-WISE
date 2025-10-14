# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import sphinx_rtd_theme
import os
import sys

sys.path.insert(0, os.path.abspath("../backend"))

# -- Project information -----------------------------------------------------
project = "RISK WISE"
copyright = "2024, [SWORD] Georgios Kalomalos"
author = "[SWORD] Georgios Kalomalos"
release = "0.6.4"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx_rtd_theme",
    "sphinx.ext.autodoc",
    "sphinx.ext.viewcode",
    "sphinx.ext.napoleon",
]

templates_path = ["_templates"]
exclude_patterns = ["_build"]

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]

# -- Options for LaTeX output ------------------------------------------------
latex_engine = "pdflatex"  # This uses MiKTeX on Windows
latex_elements = {
    # The paper size ('letterpaper' or 'a4paper').
    "papersize": "a4paper",
    # The font size ('10pt', '11pt' or '12pt').
    "pointsize": "11pt",
    # Additional stuff for the LaTeX preamble.
    "preamble": r"""
        \usepackage{amsmath,amsfonts,amssymb,amsthm}
        \usepackage{graphicx}
        \usepackage{hyperref}
        \hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
    """,
    # Latex figure (float) alignment
    "figure_align": "htbp",
}
