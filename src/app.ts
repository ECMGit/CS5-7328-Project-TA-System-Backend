import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './modules/user/user.routes';
import passwordRouter from './modules/passwordRouter';
import taApplicationRoutes from './modules/taApplication/taApplication.routes';

const app = express();

// This is a comment

// Middleware
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( express.json() );

// Enable CORS
app.use( ( req, res, next ) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE' );
    res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );

    /*
     * Handle preflight request.
     * By default, send a 200 status
     * for OPTIONS requests.
     */
    if ( req.method === 'OPTIONS' ) {
        return res.sendStatus( 200 );
    }

    next();
} );

// import routes which are defined in modules
// app.use('/api', passwordResetRouter);
app.use('/api', passwordRouter);
app.use('/user', userRoutes);
app.use('/ta-application', taApplicationRoutes);


app.get( '/', ( req, res ) => {
    res.status( 200 ).send( 'Hello World!' );
} );


export default app;