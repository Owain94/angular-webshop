import { RequestHandler } from 'express';

interface WriteController {
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}

export = WriteController;
