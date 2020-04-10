# LoxBerry Plugin - Simple Weather Service

Simple weather service is a plugin that can be used to import weather data into
the Loxone Miniserver. It requires the dnsmasq plugin installed in the LoxBerry
and configured to redirect `weather.loxone.com` to it. A
[weatherbit.io](https://weatherbit.io) API key is required to properly
function. The key must later be inserted in the plugin page, and a restart is
required.

If you need more functionality, the Weather4Loxone plugin is a great
alternative, which also includes its own web visualization.

## Motivation

While Weather4Loxone exists (and it's a wonderful plugin!), the idea of this
plugin is to bring its configuration to minimum required, and provide a server
that runs in the LoxBerry as opposed to a cronjob approach. This ensures that
the most up to date weather data is provided to the Loxone Miniserver by the
time it is requested by it.

Also, having only one single goal -provide data that can be read by the Loxone
Miniserver and shown in its native visualization-, it's easier to focus on high
detail for this specific visualization and fine tune the data provided.

Finally, considering the size of the JavaScript community, it seems to be a
better choice for long-term maintainability. The non-JS pieces are kept to a
bare minimum and made agnostic so that they don't need to be touched.

## Code structure

Code is architected following the conventions proposed by the LoxBerry project.
The code is divided into the following folders:

- `bin`: where the service lives. The service is made in JavaScript (Node.js),
  as opposed to Weather4Lox, which is made in Perl. The service runs as a
  standalone server, and self restarts if something wrong happens. The JS code
  is intended to run without requiring any NPM plugin, making it easier and
  quicker to verify.

- `config`: configuration file, read and written from the PHP frontend and from
  the JS code.

- `daemon`: contains the initialization code that is run by the LoxBerry at
  startup, and will bring the service to live.

- `icons` and `webfrontend`: contains the code used by the LoxBerry to show the
  configuration pages of the plugin under the web UI. They are developed in PHP
  and made generic enough so that just by editing the configuration file
  (`data.cfg`), new fields will appear.

## Service endpoints

The server runs in port `6066`, which is the same port where the Loxone
Miniserver tries connecting. There are three endpoints exposed in there:

- `/forecast`: used by the Loxone Miniserver to read the data, which is
  provided in the format expected by it. The endpoint accepts through query
  string the `coord` parameter (in the shape of `<lon>,<lat>`), expressed in
  degrees, and the `asl` parameter (altitude above sea level), expressed in
  meters. Both parameters are also provided by the Loxone Miniserver.

- `/raw`: retuns all meteorological data in a JSON structure. This is useful to
  ensure all fields are properly read and returned from the Weatherbit API.
  Because their fields and the ones the Loxone Miniserver expects don't match,
  some logic around re-writing is made. Parameters are the same than the
  `/forecast` endpoint.

- `/restart`: useful for restarting the service. Accepts a `code` parameter
  through query string, with the following values:

  - `0`: the service finishes cleanly.
  - `254`: immediately restart the service.

  Any other code will restart the service after 5 seconds.

## Prior art

This plugin is based on the following projects:

- [Weather4Loxone](https://www.loxwiki.eu/display/LOXBERRY/Weather4Loxone)
- [Inside the Loxone Miniserver](https://github.com/sarnau/Inside-The-Loxone-Miniserver/blob/master/Code/LoxoneWeather.py)
- [dnsmasq](https://wiki.debian.org/dnsmasq)
