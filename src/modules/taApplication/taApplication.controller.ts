import { TAApplicationData } from './taApplication.types';
import { NextFunction, Request, Response } from 'express';
import * as taApplicationService from './taApplication.service';
import { upload } from '../../utils/fileUtils';


/**
 * Save a TA application
 * @param req 
 * @param res 
 * @param next 
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const save = (req: Request, res: Response, next: NextFunction) => {
  // Upload the resume file
  upload.single('resumeFile')(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }

    (async () => {
      try {
        const applicationData: TAApplicationData = JSON.parse(req.body.data);
        const file = req.file;

        if (!file) {
          next(new Error('No file uploaded'));
          return;
        }

        const savedApplication = await taApplicationService.saveApplication(
          applicationData,
          file
        );
        res.status(201).json(savedApplication);
      } catch (error) {
        next(error);
      }
    })();
  });
};

/**
 * get single ta application
 * @param req 
 * @param res 
 */
export const getTaApplication = async (
  req: Request,
  res: Response
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => {
  const applicationId: number = Number(req.params.id);

  if (!applicationId) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const application = await taApplicationService.getApplication(applicationId);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json(application);
};


/**
 * get a list of all applications
 * @param req 
 * @param res 
 * @param next 
 */
export const getTaApplications = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    // call the service layer function and pass req.query as the parameter
    const app = await taApplicationService.getTaApplications();
    // send the response
    console.log(app);
    res.json(app);
  } catch (error) {
    next(error);
  }
};
