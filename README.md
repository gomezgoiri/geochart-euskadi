geochart-euskadi
================

Javascript geochart maker for the [Basque Country](http://en.wikipedia.org/wiki/Basque_Country_(autonomous_community)).

The API is intended to be as similar to [GCharts' one](https://developers.google.com/chart/interactive/docs/gallery/geochart) as possible.
Comparing to GCharts, this project shows more fine-grained information about this region.
Who knows if they will add it in the future or not, but in the meantime we have this.


Basic Usage
-----------

First, put the files in a __web server__.
If you want to quickly check it and you have a GNU/Linux with Python installed, just run _runserver.sh_:

    bash runserver.sh

Then, simply __load__ _sample.html_ __in your browser__ (if you have executed _runserver.sh_, go to <http://localhost:8000/sample.html>).
You can also customize the example according to your needs __editing__ the _drawRegionsMap_ function in _sample.html_ and refreshing the browser.

Finally, if you want to use it in you own web project, just call to the library as done in the example.


Implemented features
--------------------

 * Available resolutions of the map: [municipalities](http://en.wikipedia.org/wiki/Municipality), [comarcas](http://en.wikipedia.org/wiki/Comarca) and [province](http://en.wikipedia.org/wiki/Province).
 * Show labels or not.
 * Shadowing areas according to a [color gradient](http://en.wikipedia.org/wiki/Color_gradient) depending on their values.
 * Customizable color gradient.
 * Tooltips with additional information about the different areas.


Screenshots
-----------

<a href="http://imgur.com/a/gcbK3"><img src="http://i.imgur.com/WDYMoKil.png" title="Province resolution"/></a>

<img src="http://i.imgur.com/JBJqBl5l.png" title="Municipality resolution"/>

<img src="http://i.imgur.com/bk3Pac7l.png" title="Comarcas resolution with labels"/>


Image sources
-------------

 * http://commons.wikimedia.org/wiki/File:Mapa_comarcal_del_Pa%C3%ADs_Basc.svg
 * http://commons.wikimedia.org/wiki/File:Municipios_comunidad_autonoma_pais_vasco.svg
 * http://commons.wikimedia.org/wiki/File:Mapa_territorios_Espa%C3%B1a.svg
