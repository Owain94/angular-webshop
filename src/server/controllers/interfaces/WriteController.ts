import { RequestHandler } from '@types/express';

interface WriteController {
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}

export = WriteController;
