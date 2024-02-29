# PlayKit JS Related - Related plugin for the [PlayKit JS Player]

[![Build Status](https://github.com/kaltura/playkit-js-related/actions/workflows/run_canary.yaml/badge.svg)](https://github.com/kaltura/playkit-js-related/actions/workflows/run_canary.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://img.shields.io/npm/v/@playkit-js/related/latest.svg)](https://www.npmjs.com/package/@playkit-js/related)
[![](https://img.shields.io/npm/v/@playkit-js/related/canary.svg)](https://www.npmjs.com/package/@playkit-js/related/v/canary)

PlayKit JS Related is written in [ECMAScript6], statically analysed using [Typescript] and transpiled in ECMAScript5 using [Babel].

[typescript]: https://www.typescriptlang.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Prerequisites

The plugin requires [Kaltura Player] and [playkit-ui-managers] to be loaded first.

[kaltura player]: https://github.com/kaltura/kaltura-player-js
[playkit-ui-managers]: https://github.com/kaltura/playkit-js-ui-managers

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-related.git
cd playkit-js-related
yarn install
```

### Building

Then, build the plugin

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-player.js"></script>
<!--Kaltura player-->
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-player.js"></script>
<!--Playkit ui managers plugin -->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-related.js"></script>
<!--PlayKit related plugin-->
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var playerContainer = document.querySelector("#player-placeholder");
    var config = {
     ...
     targetId: 'player-placeholder',
     plugins: {
       uiManagers: {},
       related: {
         playlistId: "", // Fetch related entries by this playlist id.
         entryList: [], // Fetch related entries by list of entry metadata.
         sourcesList: [], // Manually set related entries data, without fetching them from another source.
         useContext: true, // fetch entries by context API, unless other options are not set.
         autoContinue: true, // Indicates whether to continue to to next related entry after playback end.
         autoContinueTime: 5, // If autoContinue is true, indicates the time in seconds to wait after playback end and before continuing to the next entry.
         showOnPlaybackPaused: false, // Indicates whether the related grid should be visible on playback paused.
         entriesByContextLimit: 12, // Max number of entries which can be fetched when fetching related entries by context.
         position: "right", // Position of the related list (top, down, left, right).
         expandMode: "alongside" // The relation between the position of the player and of the related list (over, alongside).
       }
     },
     ui: {
      translations: { // for local development
        en: {
          related: {
            upNextIn: 'Up Next In',
            playNow: 'Play Now'
          }
        }
      }
    }
     ...
    };
    var player = KalturaPlayer.setup(config);
    player.loadMedia(...);
  </script>
</div>
```

## Documentation

- **[Configuration & API](docs/api.md)**

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[karma]: https://karma-runner.github.io/1.0/index.html

```
yarn run test
```

You can test individual browsers:

```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-related/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
