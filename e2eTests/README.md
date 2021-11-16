## Running tests locally

`E2E_TEST=true NODE_ENV='development' DEBUG='waggle*,zbay*,testcafe:*electron*' testcafe "electron:." "./**/*.e2e.js"`

## Notes

App data (e.g store) is kept under .config/Electron