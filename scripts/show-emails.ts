import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showAllEmails() {
  console.log('\n📧 ===============================================');
  console.log('   TODOS LOS CORREOS REGISTRADOS EN LA APLICACIÓN');
  console.log('   ===============================================\n');

  try {
    // 1. AUTHUSER - Usuarios con cuenta completa
    console.log('1️⃣  AUTHUSER - Usuarios Registrados\n');
    const authUsers = await prisma.authUser.findMany({
      select: {
        email: true,
        name: true,
        verified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (authUsers.length > 0) {
      console.log(`   Total: ${authUsers.length} usuarios\n`);
      console.log('   Email                          | Nombre            | Verificado | Fecha');
      console.log('   ' + '-'.repeat(85));
      
      authUsers.forEach(user => {
        const email = user.email.padEnd(30);
        const name = (user.name || 'N/A').padEnd(17);
        const verified = user.verified ? '✅ Sí' : '❌ No';
        const date = user.createdAt.toISOString().split('T')[0];
        console.log(`   ${email} | ${name} | ${verified.padEnd(7)} | ${date}`);
      });
    } else {
      console.log('   ⚠️  No hay usuarios registrados todavía');
    }

    console.log('\n');

    // 2. EMAILSUBSCRIBER - Suscriptores al newsletter
    console.log('2️⃣  EMAILSUBSCRIBER - Suscriptores al Newsletter\n');
    const subscribers = await prisma.emailSubscriber.findMany({
      select: {
        email: true,
        name: true,
        subscribed: true,
        frequency: true,
        subscribedAt: true,
      },
      orderBy: { subscribedAt: 'desc' }
    });

    if (subscribers.length > 0) {
      console.log(`   Total: ${subscribers.length} suscriptores\n`);
      console.log('   Email                          | Nombre            | Estado     | Frecuencia | Fecha');
      console.log('   ' + '-'.repeat(95));
      
      subscribers.forEach(sub => {
        const email = sub.email.padEnd(30);
        const name = (sub.name || 'N/A').padEnd(17);
        const status = sub.subscribed ? '✅ Activo' : '❌ Inactivo';
        const freq = sub.frequency.padEnd(10);
        const date = sub.subscribedAt.toISOString().split('T')[0];
        console.log(`   ${email} | ${name} | ${status.padEnd(11)} | ${freq} | ${date}`);
      });
    } else {
      console.log('   ⚠️  No hay suscriptores todavía');
    }

    console.log('\n');

    // 3. RESUMEN CONSOLIDADO
    console.log('📊 RESUMEN CONSOLIDADO\n');
    
    const allEmails = new Set([
      ...authUsers.map(u => u.email),
      ...subscribers.map(s => s.email)
    ]);

    console.log(`   📧 Correos únicos totales: ${allEmails.size}`);
    console.log(`   👤 Usuarios con cuenta:    ${authUsers.length}`);
    console.log(`      - Verificados:          ${authUsers.filter(u => u.verified).length}`);
    console.log(`      - Pendientes:           ${authUsers.filter(u => !u.verified).length}`);
    console.log(`   📨 Suscriptores:           ${subscribers.length}`);
    console.log(`      - Activos:              ${subscribers.filter(s => s.subscribed).length}`);
    console.log(`      - Inactivos:            ${subscribers.filter(s => !s.subscribed).length}`);

    console.log('\n   ===============================================\n');

    // 4. EXPORTAR A CSV
    const csv = [
      'Email,Fuente,Nombre,Estado,Fecha',
      ...authUsers.map(u => 
        `${u.email},AuthUser,${u.name || 'N/A'},${u.verified ? 'Verified' : 'Pending'},${u.createdAt.toISOString()}`
      ),
      ...subscribers.map(s => 
        `${s.email},EmailSubscriber,${s.name || 'N/A'},${s.subscribed ? 'Active' : 'Unsubscribed'},${s.subscribedAt.toISOString()}`
      )
    ].join('\n');

    const fs = require('fs');
    fs.writeFileSync('emails-export.csv', csv);
    console.log('   ✅ Exportado a: emails-export.csv\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showAllEmails();
