import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const JWT_SECRET = process.env.JWT_SECRET || 'dandaro-secret-key-2026';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, consent } = await request.json();

    if (!name || !email || !password || !consent) {
      return NextResponse.json(
        { error: 'All fields are required and consent must be given' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await redis.get(`user:${email}`);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      consent,
      consentDate: new Date().toISOString(),
      role: 'parent',
      children: [],
      createdAt: new Date().toISOString(),
    };

    // Save user permanently to Upstash Redis
    await redis.set(`user:${email}`, JSON.stringify(user));

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        children: user.children,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}