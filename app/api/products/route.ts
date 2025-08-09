import { FirebaseAPI } from '@/app/api/firebase-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const businessId = searchParams.get('businessId');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    // Validate business ID
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    // Configure query options
    const options = {
      pageSize,
      searchQuery: search || undefined,
      searchFields: search ? ['name', 'sku', 'barcode'] : undefined,
      filters: category ? { category_id: category } : undefined
    };

    // Fetch products using the API wrapper
    const result = await FirebaseAPI.getProducts(businessId, options);
    
    return NextResponse.json({
      data: result.data,
      hasMore: result.hasMore,
      totalPages: Math.ceil(result.data.length / pageSize),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId, ...productData } = await req.json();
    
    // Validate business ID
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }
    
    // Create the product using the API wrapper
    const product = await FirebaseAPI.createProduct(businessId, productData);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
