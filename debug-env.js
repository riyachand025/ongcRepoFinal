require('dotenv').config();

console.log('🔍 Debugging environment variables...');
console.log('📝 Raw environment variables:');
console.log('   SQL_DATABASE:', process.env.SQL_DATABASE);
console.log('   SQL_USER:', process.env.SQL_USER);
console.log('   SQL_PASSWORD:', process.env.SQL_PASSWORD);
console.log('   SQL_HOST:', process.env.SQL_HOST);
console.log('   SQL_PORT:', process.env.SQL_PORT);

console.log('\n🔍 Testing password encoding:');
const password = process.env.SQL_PASSWORD || '';
console.log('   Original password length:', password.length);
console.log('   URL encoded:', encodeURIComponent(password));
console.log('   Contains special chars:', /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password));

console.log('\n🔍 Testing MySQL connection string:');
const host = process.env.SQL_HOST || 'localhost';
const port = process.env.SQL_PORT || 3306;
const database = process.env.SQL_DATABASE || 'ongc_auth';
const user = process.env.SQL_USER || 'ongc_user';
const encodedPassword = encodeURIComponent(password);

const connectionString = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}`;
console.log('   Connection string:', connectionString.replace(encodedPassword, '***')); 