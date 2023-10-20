import { prisma } from '../../../prisma/index';
//This file is the lowest level as it directly interacts with the database while .routes and .controller further abstractionize.

//The code defines an asynchronous function getTAJobs that retrieves and returns all TA job entries from a database usingfindMany method on the tAJob model. 
//This function acts as a utility for fetching a list of TA job entries without any filters.
export const getTAJobs = async() =>{
    return await prisma.tAJob.findMany();
}
export const getTAJobsByFacultyId = async (facultyId: number) => {
    return await prisma.tAJob.findMany({ where:{ facultyId } } );
};
