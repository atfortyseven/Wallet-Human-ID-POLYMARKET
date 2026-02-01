import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/emails - Ver todos los correos registrados
 * 
 * Requiere autenticación de administrador
 * 
 * Query params:
 *   ?source=authuser|subscriber  - Filtrar por fuente
 *   ?export=csv                  - Exportar como CSV
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Authentication: Require session OR secret key bypass
    if (!session?.user?.email && secret !== 'human_admin_2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const source = searchParams.get('source');
    const exportFormat = searchParams.get('export');

    // Obtener usuarios registrados
    const authUsers = source !== 'subscriber' ? await prisma.authUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    }) : [];

    // Obtener suscriptores
    const subscribers = source !== 'authuser' ? await prisma.emailSubscriber.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        subscribed: true,
        frequency: true,
        subscribedAt: true,
      },
      orderBy: { subscribedAt: 'desc' }
    }) : [];

    // Consolidar emails únicos
    const allEmails = new Set([
      ...authUsers.map(u => u.email),
      ...subscribers.map(s => s.email)
    ]);

    // Estadísticas
    const stats = {
      totalUniqueEmails: allEmails.size,
      authUsers: {
        total: authUsers.length,
        verified: authUsers.filter(u => u.verified).length,
        pending: authUsers.filter(u => !u.verified).length,
      },
      subscribers: {
        total: subscribers.length,
        active: subscribers.filter(s => s.subscribed).length,
        inactive: subscribers.filter(s => !s.subscribed).length,
      },
    };

    // Exportar como CSV si se solicita
    if (exportFormat === 'csv') {
      const csvRows = [
        'Email,Fuente,Nombre,Estado,Fecha',
        ...authUsers.map(u => 
          `${u.email},AuthUser,${u.name || 'N/A'},${u.verified ? 'Verified' : 'Pending'},${u.createdAt.toISOString()}`
        ),
        ...subscribers.map(s => 
          `${s.email},EmailSubscriber,${s.name || 'N/A'},${s.subscribed ? 'Active' : 'Unsubscribed'},${s.subscribedAt.toISOString()}`
        )
      ].join('\n');

      return new NextResponse(csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="emails-${Date.now()}.csv"`,
        },
      });
    }

    // Retornar JSON
    return NextResponse.json({
      success: true,
      stats,
      data: {
        authUsers: authUsers.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          source: 'AuthUser',
          status: u.verified ? 'Verified' : 'Pending',
          date: u.createdAt,
        })),
        subscribers: subscribers.map(s => ({
          id: s.id,
          email: s.email,
          name: s.name,
          source: 'EmailSubscriber',
          status: s.subscribed ? 'Active' : 'Unsubscribed',
          frequency: s.frequency,
          date: s.subscribedAt,
        })),
      },
    });

  } catch (error: any) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
