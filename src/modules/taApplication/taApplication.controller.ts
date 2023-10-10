import path from 'path';
import multer from 'multer';
import { TAApplicationData } from './taApplication.types';
import {
    NextFunction, Request, Response
} from 'express';
import { saveApplication } from './taApplication.service';

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, 'uploads/' );
    }
    , filename: ( req, file, cb ) => {
        cb( null, file.fieldname + '-' + Date.now() + path.extname( file.originalname ) );
    }
} );

const upload = multer( { storage } );

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const save = ( req: Request, res: Response, next: NextFunction ) => {
    upload.single( 'resumeFile' )( req, res, ( err ) => {
        if ( err ) {
            next( err );
            return;
        }

        ( async () => {
            try {
                const applicationData: TAApplicationData = JSON.parse( req.body.data );
                const file = req.file;

                if ( !file ) {
                    next( new Error( 'No file uploaded' ) );
                    return;
                }

                const savedApplication = await saveApplication( applicationData, file );
                res.status( 201 ).json( savedApplication );
            } catch ( error ) {
                next( error );
            }
        } )();
    } );
};