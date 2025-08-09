import { FirebaseAPI } from '@/app/api/firebase-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const businessId = searchParams.get('businessId');
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10);

    // Validate business ID
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    // Configure query options
    const options = {
      pageSize,
      filters: { is_active: true }
    };

    // Fetch categories using the API wrapper
    const result = await FirebaseAPI.getCategories(businessId, options);
    
    return NextResponse.json({
      data: result.data,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId, ...categoryData } = await req.json();
    
    // Validate business ID
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }
    
    // Create the category using the API wrapper
    const category = await FirebaseAPI.createCategory(businessId, categoryData);
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
