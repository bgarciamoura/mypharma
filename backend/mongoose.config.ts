import mongoose from 'mongoose';

const db_config = mongoose.connect(
    'mongodb://host.docker.internal:27017/task-management',
    {
        auth: {
            username: 'anas',
            password: '12345',
        },
        authSource: 'admin',
    },
    (err) => {
        if (err) {
            console.error('failed to connect to mongoDB');
            console.error(err);
        } else {
            console.log('mongodb is running and secured');
        }
    }
);

export { db_config };
