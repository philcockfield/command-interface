# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased] - YYYY-MM-DD
#### Added
#### Changed
#### Deprecated
#### Removed
#### Fixed
#### Security




## [4.2.0] - 2020-01-13
#### Changed
- Update dependency versions.
#### Removed
- Removed `lodash` export references (namely `debounce`). Use observables instead! :)

## [4.0.0] - 2018-06-27
#### Removed
Remove `table` export (not available via `log.table()`).


## [3.0.24] - 2018-03-31
#### Added
#### Changed
- Updated typescript (using @tdb libs)
- Format with Prettier https://github.com/prettier/prettier

## [3.0.0] - 2017-04-30
#### Changed
- Converted to using glob patterns to initialize commands.

  ```js
  import command from 'command-interface';
  command('./**/*.cmd.js');
  ```

## [2.2.0] - 2016-07-09
#### Added
- Command aliases.


## [2.0.0] - 2016-06-02
#### Changed
- Loading commands from modules. Initialized from a directory path

## [1.0.0] - 2016-05-17
#### Added
Initial creation and publish.
