import { Employee } from '@/types/employee';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

const employeesCol = collection(db, 'employees');

export async function GET() {
  try {
    const snapshot = await getDocs(employeesCol);
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: Employee = await req.json();
    const docRef = await addDoc(employeesCol, data);
    return NextResponse.json({ id: docRef.id, ...data });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
