# generator-jhipster-react [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A Jhipster based generator to create awesome angular material + spring boot applications

## Installation

**Attention: This is still a work in progress**

First, install [Yeoman](http://yeoman.io) and [JHipster](http://jhipster.github.io/), then install generator-jhipster-material using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-jhipster
npm install -g generator-jhipster-material
```

Then generate your new awesome project:

```bash
yo jhipster-material
```
As this is a generator which runs on top of [JHipster](http://jhipster.github.io/), we expect you have [JHipster and its related tools already installed](http://jhipster.github.io/installation.html).

This generator requires Jhipster version 3.0 or greater in order to work

## Using Docker

Download the Dockerfile:

```bash
mkdir docker
cd docker
wget https://github.com/jhipster-projects/generator-jhipster-material/raw/master/docker/Dockerfile
```

Build the Docker images:

```bash
docker build -t jhipster-generator-material:latest .
```

Make a folder where you want to generate the Service:

```bash
mkdir service
cd service
```

Run the generator from image to generate service:

```bash
docker run -it --rm -v $PWD:/home/jhipster/app jhipster-generator-material
```

Run and attach interactive shell to the generator docker container to work from inside the running container:

```bash
docker run -it --rm -v $PWD:/home/jhipster/app jhipster-generator-material /bin/bash
```

## Contributing

Contributions are welcome.
we follow the same contribution guidelines as JHipster, [check it out here](https://github.com/jhipster/generator-jhipster/blob/master/CONTRIBUTING.md)

## License

Apache-2.0 © [Deepu KS](http://deepu105.github.io)

[npm-image]: https://badge.fury.io/js/generator-jhipster-material.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-material
[travis-image]: https://travis-ci.org/deepu105/generator-jhipster-material.svg?branch=master
[travis-url]: https://travis-ci.org/deepu105/generator-jhipster-material
[daviddm-image]: https://david-dm.org/hipster-labs/generator-jhipster-material.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/hipster-labs/generator-jhipster-material
