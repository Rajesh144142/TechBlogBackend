import mongoose from 'mongoose';


const dataBaseConntection = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n MongoDb connected !! DB Host:${ConnectionInstance.connection.host} `)
    } catch (error) {
        console.log('MongoDb connection Error: ', error);
        process.exit(1);
    }
}
export default dataBaseConntection;