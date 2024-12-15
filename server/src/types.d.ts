import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from "express-joi-validation";
import { Session } from 'express-session';

declare interface AuthSchemaRequest extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        email?: string;
        name?: string;
        password?: string;
    };
}


declare global {
    namespace Express {
        interface Request {
            session: Session & {
                userId?: string;
                email?: string;
                name?: string;
            };
        }
    }
}




