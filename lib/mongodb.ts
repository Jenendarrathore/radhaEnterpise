import mongoose from 'mongoose';

const DB_URI = 'mongodb+srv://jenendar:jenendar@radhaenterprisecluster.beg3t.mongodb.net/';

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Database is already connected');
        return;
    }

    try {
        await mongoose.connect(DB_URI, {
            maxPoolSize: 10,
        });

        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process with an error code if the connection fails
    }
};

export default dbConnect;
