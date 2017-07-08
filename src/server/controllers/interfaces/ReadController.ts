import { RequestHandler } from 'express';

interface ReadController {
    retrieve: RequestHandler;
    findById: RequestHandler;
}

export = ReadController;
