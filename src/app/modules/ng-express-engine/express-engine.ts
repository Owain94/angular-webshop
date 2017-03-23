import * as fs from 'fs';
import {
  Request,
  Response,
  Send
} from 'express';

import {
  Provider,
  NgModuleFactory,
  InjectionToken,
  Type,
  CompilerFactory,
  Compiler
} from '@angular/core';
import {
  INITIAL_CONFIG,
  renderModuleFactory,
  platformDynamicServer
} from '@angular/platform-server';

export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');

/**
 * These are the allowed options for the engine
 */
export interface NgSetupOptions {
  bootstrap: Type<{}> | NgModuleFactory<{}>;
  providers?: Provider[];
}

/**
 * These are the allowed options for the render
 */
export interface RenderOptions extends NgSetupOptions {
  req: Request;
  res?: Response;
}

/**
 * This holds a cached version of each index used.
 */
const templateCache: { [key: string]: string } = {};

/**
 * This is a map of compiled NgModuleFactories
 */
const factoryCacheMap = new Map<Type<{}>, NgModuleFactory<{}>>();

/**
 * This is an express engine for handling Angular Applications
 */
export function ngExpressEngine(setupOptions: NgSetupOptions) {
  const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);
  const compiler: Compiler = compilerFactory.createCompiler();

  setupOptions.providers = setupOptions.providers || [];

  return function (filePath: string, options: RenderOptions, callback: Send) {

    options.providers = options.providers || [];

    try {
      const module = options.bootstrap || setupOptions.bootstrap;

      if (!module) {
        throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
      }

      const extraProviders = setupOptions.providers.concat(
        options.providers,
        getReqResProviders(options.req, options.res),
        [
          {
            provide: INITIAL_CONFIG,
            useValue: {
              document: getDocument(filePath),
              url: options.req.originalUrl
            }
          }
        ]);

      let moduleFactory: NgModuleFactory<{}>;
      if (module instanceof Type) {
        moduleFactory = factoryCacheMap.get(module);

        if (!moduleFactory) {
          moduleFactory = compiler.compileModuleSync(module);

          factoryCacheMap.set(module, moduleFactory);
        }
      } else {
        moduleFactory = module;
      }

      renderModuleFactory(moduleFactory, {
        extraProviders: extraProviders
      })
        .then((html: string) => {
          callback(null, html);
        });

    } catch (e) {
      callback(e);
    }
  };
}

/**
 * Get providers of the request and response
 */
function getReqResProviders(req: Request, res: Response): Provider[] {
  const providers: Provider[] = [
    {
      provide: REQUEST,
      useValue: req
    }
  ];
  if (res) {
    providers.push({
      provide: RESPONSE,
      useValue: res
    });
  }
  return providers;
}

/**
 * Get the document at the file path
 */
function getDocument(filePath: string): string {
  return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}
