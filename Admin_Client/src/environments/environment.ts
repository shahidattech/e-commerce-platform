// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // adminServerAddresss:"http://localhost:7001/api/v1/",
  // synchServerAddress:"http://localhost:3001/datasync/",
  // medaiServerAddress:"http://localhost:2001/api/v1/media/",
  // websiteApiServer: "http://localhost:6001/",
  // searchServerAddress: "http://localhost:3301/",
  // SHIPPING_SERVER_ADDRESS: "http://localhost:3333/api/websiteshipping/",
  // primeServer: 'http://localhost:3333/api/'

  // prod
  adminServerAddresss:"https://api.dynamicexecution.com/api/v1/",
  synchServerAddress:"https://api.dynamicexecution.com/datasync/",
  medaiServerAddress:"https://api.dynamicexecution.com/api/v1/media/",
  websiteApiServer: "https://api.dynamicexecution.com/api/v1/website/",
  searchServerAddress: "https://api.dynamicexecution.com/api/search",
  SHIPPING_SERVER_ADDRESS: "https://api.bhbazar.com/api/websiteshipping/",
  primeServer: 'https://api.bhbazar.com/api/'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
