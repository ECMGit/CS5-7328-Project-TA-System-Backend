import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const messages = [
        {
            content: 'Hello, your application has been received.',
            createdAt: new Date('2023-12-01T10:20:30Z'),
            senderId: 1, // Assuming this sender ID is valid
            receiverId: 2, // Assuming this receiver ID is valid
            applicationId: 1, // Assuming this application ID is valid
            isRead: false
        },
        {
            content: 'Thank you for the update. When can I expect a decision?',
            createdAt: new Date('2023-12-02T09:15:00Z'),
            senderId: 4, // Adjust according to your actual data
            receiverId: 1, // Adjust according to your actual data
            applicationId: 1, // Adjust according to your actual data
            isRead: false
        },
        {
            content: 'We will review your application and get back to you within a week.',
            createdAt: new Date('2023-12-03T14:30:00Z'),
            senderId: 1, // Adjust according to your actual data
            receiverId: 2, // Adjust according to your actual data
            applicationId: 1, // Adjust according to your actual data
            isRead: false
        },
    ];

    for (const message of messages) {
        await prisma.userMessage.create({
            data: message,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

