"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("executor must be a function");
  }

  this._state = "pending";
  this._handlerGroups = []; // { successCb, errorCb}

  // forma 1
  // executor(
  //   this._internalResolve.bind(this),
  //   this._internalReject.bind(this)
  // );

  // forma 2
  executor(
    (value) => this._internalResolve(value),
    (reason) => this._internalReject(reason)
  );
}

$Promise.prototype._internalResolve = function (value) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = value;
    this._callHandlers();
  }
};

$Promise.prototype._internalReject = function (reason) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = reason;
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  const downstreamPromise = new $Promise(function () {});
  if (typeof successCb !== "function") {
    successCb = false;
  }

  if (typeof errorCb !== "function") {
    errorCb = false;
  }

  this._handlerGroups.push({
    successCb,
    errorCb,
    downstreamPromise,
  });

  if (this._state !== "pending") {
    this._callHandlers();
  }

  return downstreamPromise;
};

$Promise.prototype._callHandlers = function () {
  // const array = [{ successCb, errorCb, funcA}, { successCb, errorCb}, { successCb, errorCb}]
  while (this._handlerGroups.length) {
    const element = this._handlerGroups.shift();
    if (this._state === "fulfilled") {
      if (element.successCb) {
        try {
          const result = element.successCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              (value) => element.downstreamPromise._internalResolve(value),
              (reason) => element.downstreamPromise._internalReject(reason)
            );
          } else {
            element.downstreamPromise._internalResolve(result);
          }
        } catch (error) {
          element.downstreamPromise._internalReject(error);
        }
      } else {
        element.downstreamPromise._internalResolve(this._value);
      }
    }
    if (this._state === "rejected") {
      if (element.errorCb) {
        try {
          const result = element.errorCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              (value) => element.downstreamPromise._internalResolve(value),
              (reason) => element.downstreamPromise._internalReject(reason)
            );
          } else {
            element.downstreamPromise._internalResolve(result);
          }
        } catch (error) {
          element.downstreamPromise._internalReject(error);
        }
      } else {
        element.downstreamPromise._internalReject(this._value);
      }
    }
  }


  // while (this._handlerGroups.length) {
    // this._handlerGroups.forEach(element => {
    //   if (this._state === "fulfilled") {
    //     if (element.successCb) {
    //       try {
    //         const result = element.successCb(this._value);
    //         if (result instanceof $Promise) {
    //           result.then(
    //             (value) => element.downstreamPromise._internalResolve(value),
    //             (reason) => element.downstreamPromise._internalReject(reason)
    //           );
    //         } else {
    //           element.downstreamPromise._internalResolve(result);
    //         }
    //       } catch (error) {
    //         element.downstreamPromise._internalReject(error);
    //       }
    //     } else {
    //       element.downstreamPromise._internalResolve(this._value);
    //     }
    //   }
    //   if (this._state === "rejected") {
    //     if (element.errorCb) {
    //       try {
    //         const result = element.errorCb(this._value);
    //         if (result instanceof $Promise) {
    //           result.then(
    //             (value) => element.downstreamPromise._internalResolve(value),
    //             (reason) => element.downstreamPromise._internalReject(reason)
    //           );
    //         } else {
    //           element.downstreamPromise._internalResolve(result);
    //         }
    //       } catch (error) {
    //         element.downstreamPromise._internalReject(error);
    //       }
    //     } else {
    //       element.downstreamPromise._internalReject(this._value);
    //     }
    //   }
    // });
    

};
$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

module.exports = $Promise;


 

  
   



/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
