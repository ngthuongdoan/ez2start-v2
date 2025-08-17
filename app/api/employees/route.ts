import { collections } from '@/lib/firebase';
import { Employee } from '@/types/employee';
import { getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const search = searchParams.get('search') || '';
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc';
    const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    // Build Firestore query
    let q: any = query(collections.employees, orderBy(sortField, sortDirection), limit(pageSize));

    // Add search filter (example: search by name)
    if (search) {
      // For demonstration, filter by 'name' field containing the search string
      // Firestore doesn't support 'contains' natively, so you may need to adjust this for your needs
      // Here, we fetch all and filter in-memory for simplicity
      const snapshot = await getDocs(collections.employees);
      let employees: Array<Employee> = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Employee }));
      employees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(search.toLowerCase())
      );
      // Sort and paginate in-memory
      employees = employees.sort((a, b) => {
        const aValue = (a as Record<string, any>)[sortField];
        const bValue = (b as Record<string, any>)[sortField];
        if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
      });
      const paged = employees.slice((page - 1) * pageSize, page * pageSize);
      return NextResponse.json({
        data: paged,
        hasMore: employees.length > page * pageSize,
        totalPages: Math.ceil(employees.length / pageSize),
      });
    }

    // For non-search, use Firestore query
    const snapshot = await getDocs(q);
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Employee }));

    return NextResponse.json({
      data: employees,
      hasMore: employees.length === pageSize,
      totalPages: 1, // Firestore doesn't provide total count efficiently
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: Employee = await req.json();
    const docRef = await addDoc(collections.employees, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, ...data });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
