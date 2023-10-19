import path from 'path';
import multer from 'multer';
import { TAApplicationData } from './taApplication.types';
import {
    NextFunction, Request, Response
} from 'express';
import * as taApplicationService from './taApplication.service';
import fs from 'fs';


const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        const uploadFolder = 'uploads/';

        if ( !fs.existsSync( uploadFolder ) ) {
            fs.mkdirSync( uploadFolder, { recursive: true } );
        }

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

                const savedApplication
                    = await taApplicationService.saveApplication( applicationData, file );
                res.status( 201 ).json( savedApplication );
            } catch ( error ) {
                next( error );
            }
        } )();
    } );
};

export const getApplication = async (
    req: Request
    , res: Response
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => {
    const applicationId: number = Number( req.params.id );

    if ( !applicationId ) {
        return res.status( 404 ).json( { message: 'Application not found' } );
    }

    const application
        = await taApplicationService.getApplication( applicationId );

    if ( !application ) {
        return res.status( 404 ).json( { message: 'Application not found' } );
    }

    return res.status( 200 ).json( application );
};