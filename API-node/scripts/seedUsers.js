// scripts/seedUsers.js
import bcrypt from 'bcrypt';
import User from '../src/models/user.js'; // respeta tu nombre de archivo/modelo

const USERS = [
  { displayName: 'Admin One', email: 'admin1@demo.com', role: 'admin', phone: '5511111111' },
  { displayName: 'Alice UX', email: 'alice@demo.com', role: 'customer', phone: '5522222222' },
  { displayName: 'Bob Dev', email: 'bob@demo.com', role: 'customer', phone: '5533333333' },
  { displayName: 'Caro PM', email: 'caro@demo.com', role: 'customer', phone: '5544444444' },
  { displayName: 'Diego DS', email: 'diego@demo.com', role: 'customer', phone: '5555555555' },
  { displayName: 'Eva Data', email: 'eva@demo.com', role: 'customer', phone: '5566666666' },
  { displayName: 'Fer Ops', email: 'fer@demo.com', role: 'customer', phone: '5577777777' },
  { displayName: 'Gus QA', email: 'gus@demo.com', role: 'customer', phone: '5588888888' },
  { displayName: 'Helena Mkt', email: 'helena@demo.com', role: 'customer', phone: '5599999999' },
  { displayName: 'Ivan Biz', email: 'ivan@demo.com', role: 'customer', phone: '5500000000' },
];

const DEFAULT_PASS = 'Passw0rd!';

export async function seedUsers() {
  try {
    console.log('🔄 Seeding users...');

    const hash = await bcrypt.hash(DEFAULT_PASS, 10);

    let upserted = 0;
    for (const u of USERS) {
      const doc = {
        displayName: u.displayName,
        email: u.email,
        hashPassword: hash, // todos con el mismo pass para pruebas
        role: u.role,
        avatar: 'https://placehold.co/100x100.png',
        phone: u.phone,
        isActive: true,
      };

      await User.findOneAndUpdate(
        { email: u.email },
        { $set: doc },
        { upsert: true, new: true, runValidators: true }
      );
      upserted++;
    }

    const seeded = await User.find({ email: { $in: USERS.map(u => u.email) } })
      .select('_id email role displayName')
      .sort({ email: 1 });

    const total = await User.countDocuments();
    console.log(`🎉 Usuarios upserted: ${upserted} | Total en DB: ${total}`);
    console.log('ℹ️  Password de todos: Passw0rd!');
    console.log('\n🆔 IDs de usuarios sembrados (útil para Postman):');
    seeded.forEach(u =>
      console.log(`• ${u.email} → ${u._id.toString()} (${u.role})`)
    );

    console.log('✅ Seed users listo.\n');
  } catch (err) {
    console.error('❌ Seed users error:', err);
  }
}
