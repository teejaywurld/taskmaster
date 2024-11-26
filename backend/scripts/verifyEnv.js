require('dotenv').config();

console.log('\nEnvironment Variables Check:');
console.log('---------------------------');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Defined' : '× Not defined');
console.log('PORT:', process.env.PORT ? '✓ Defined' : '× Not defined');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Defined' : '× Not defined');

if (!process.env.MONGODB_URI) {
    console.log('\nMONGODB_URI is missing! Please check:');
    console.log('1. .env file exists in project root');
    console.log('2. .env file contains MONGODB_URI=mongodb://localhost:27017/taskmaster');
    console.log('3. dotenv package is installed (npm install dotenv)');
}
