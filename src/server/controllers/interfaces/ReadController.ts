import { RequestHandler } from '@types/express';

interface ReadController {
    retrieve: RequestHandler;
    findById: RequestHandler;
}

export = ReadController;
