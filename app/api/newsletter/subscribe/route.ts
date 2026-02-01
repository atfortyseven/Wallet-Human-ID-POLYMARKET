import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación
const SubscribeSchema = z.object({
  email: z.string().email('Email inválido'),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional().default('weekly'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar input
    const validation = SubscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, frequency } = validation.data;

    // Crear o actualizar suscriptor
    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email },
      update: {
        subscribed: true, // Reactivar si estaba desuscrito
        updatedAt: new Date(),
      },
      create: {
        email,
        frequency,
        subscribed: true,
        // Generar un token simple para desuscribirse
        unsubscribeToken: Math.random().toString(36).substring(2, 15), 
      },
    });

    return NextResponse.json({
      success: true,
      message: '¡Suscripción exitosa!',
      subscriber: {
        email: subscriber.email,
        status: 'active'
      }
    });

  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}
