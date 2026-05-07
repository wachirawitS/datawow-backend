import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository('users');

  const email = 'admin@example.com';
  const exists = await repo.findOneBy({ email });

  if (exists) {
    console.log('Admin user already exists, skipping.');
  } else {
    const password = await bcrypt.hash('admin1234', 10);
    await repo.save({ email, password, role: 'ADMIN' });
    console.log('Admin user created:', email);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
