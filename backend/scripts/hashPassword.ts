
import bcrypt from 'bcryptjs';
// FIX: Importing the full `process` object instead of destructuring `argv`
// resolves type conflicts with the global `process` object and ensures
// that `process.exit` is correctly typed.
import process from 'process';

const hashPassword = async () => {
  // FIX: Use `process.argv` as `argv` is no longer directly imported.
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: ts-node scripts/hashPassword.ts <password>');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(`Password: ${password}`);
  console.log(`Hashed: ${hashedPassword}`);
  console.log('\nUpdate this hash in your database for the admin user in the `password_hash` column.');
};

hashPassword();
