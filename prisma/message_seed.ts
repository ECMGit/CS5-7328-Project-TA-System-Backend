import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const messages = [
        {
            id: 1,
            content: 'Hello, your application has been received.',
            createdAt: new Date('2023-12-01T10:20:30Z'),
            senderId: 1,
        },
        {
            id: 2,
            content: 'Thank you for the update. When can I expect a decision?',
            createdAt: new Date('2023-12-02T09:15:00Z'),
            senderId: 4,
        },
        {
            id: 3,
            content: 'We will review your application and get back to you within a week.',
            createdAt: new Date('2023-12-03T14:30:00Z'),
            senderId: 1,
        },
    ];

    for (const message of messages) {
        await prisma.message.create({
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
