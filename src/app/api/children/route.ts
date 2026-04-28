import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dandaro-secret-key-2026';

const users: any[] = [];

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

// Add a child profile
export async function POST(request: NextRequest) {
  try {
    const decoded = getUserFromToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { aliasName, gradeLevel, preferredLanguage, schoolName } = await request.json();

    if (!aliasName || !gradeLevel || !preferredLanguage) {
      return NextResponse.json(
        { error: 'Alias name, grade level and language are required' },
        { status: 400 }
      );
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const child = {
      id: `child_${Date.now()}`,
      aliasName,
      gradeLevel,
      preferredLanguage,
      schoolName: schoolName || '',
      createdAt: new Date().toISOString(),
    };

    user.children.push(child);

    return NextResponse.json({ success: true, child });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add child profile' },
      { status: 500 }
    );
  }
}

// Get all children for a parent
export async function GET(request: NextRequest) {
  try {
    const decoded = getUserFromToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, children: user.children });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch children' },
      { status: 500 }
    );
  }
}