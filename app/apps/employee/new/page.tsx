// Page to create a new employee
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Employee } from '@/types/employee';

export default function NewEmployeePage() {
  const [form, setForm] = useState<Employee>({
    name: '', phone: '', address: '', username: '', birth: '', position: '', salaryRate: 0, assignedShift: ''
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    router.push('/apps/employee');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Employee</h1>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input name="birth" placeholder="Birth" value={form.birth} onChange={handleChange} required type="date" />
      <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
      <input name="salaryRate" placeholder="Salary Rate" value={form.salaryRate} onChange={handleChange} required type="number" />
      <input name="assignedShift" placeholder="Assigned Shift" value={form.assignedShift} onChange={handleChange} required />
      <button type="submit">Create</button>
    </form>
  );
}
