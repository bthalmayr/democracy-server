![Screenshot](https://github.com/demokratie-live/democracy-assets/blob/master/images/forfb2.png)

# DEMOCRACY Server for the DEMOCRACY App &nbsp; <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers" target="_blank"><img src="https://img.shields.io/github/stars/demokratie-live/democracy-server.svg?style=social&label=Star&maxAge=3600" height="20"/></a>  <a href="https://twitter.com/democracy_de" target="_blank"><img src="https://img.shields.io/twitter/follow/democracy_de.svg?style=social&label=Follow&maxAge=3600" height="20"/></a>  <a href="https://www.facebook.com/democracygermany/" target="_blank"><img src="https://github.com/demokratie-live/democracy-assets/blob/master/docu/facebook.png" height="20"/></a>  <a href="https://discord.gg/Pdu3ZEV" target="_blank"><img src="https://github.com/demokratie-live/democracy-assets/blob/master/docu/discord.png" height="20"/></a>

[![Build Status](https://travis-ci.org/demokratie-live/democracy-server.svg?branch=master)](https://travis-ci.org/demokratie-live/democracy-server) &nbsp;  [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/XXXX/badge)](https://bestpractices.coreinfrastructure.org/projects/XXXX)

The Serversoftware for the DEMOCRACY APP. This is an API Defintion and Server for Data required and created by the DEMOCRACY App.

## Tech Stack

* [Node.js][node], [Yarn][yarn], [JavaScript][js], [Babel][babel]

[More Dependecies](https://github.com/demokratie-live/democracy-server/network/dependencies)

![Projekt Struktur](https://github.com/demokratie-live/democracy-assets/blob/master/docu/api_structure_server.png)

## Prerequisites

* [Node.js][node]
* [MongoDB][mongo]

## Getting started

Clone the git repo & run the project
```
git clone git@github.com:demokratie-live/democracy-server.git
cd democracy-server
yarn install
```

### Compile and start
```
yarn ~~start~~ dev
```

### Import Data from local Bundestag.io Server
```
yarn imp
```

### Test Project
```
yarn lint
```

## Contributing

Anyone and everyone is welcome to [contribute](CONTRIBUTING.md). Start by checking out the list of
[open issues](https://github.com/demokratie-live/democracy-server/issues).

## License

Copyright © 2017-present DEMOCRACY Deutschland e.V.. This source code is licensed under the Apache 2.0 license found in the
[LICENSE](https://github.com/demokratie-live/democracy-server/blob/master/LICENSE) file.

---

Made with ♥ by Team DEMOCRACY ([democracy-deutschland.de](https://www.democracy-deutschland.de)), [startnext contributors](https://www.startnext.com/democracy/unterstuetzer/) and [contributors](https://github.com/demokratie-live/democracy-server/graphs/contributors)

[node]: https://nodejs.org
[yarn]: https://yarnpkg.com
[js]: https://developer.mozilla.org/docs/Web/JavaScript
[babel]: http://babeljs.io/
[mongo]: https://www.mongodb.com/
