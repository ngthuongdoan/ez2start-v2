// Page to view and edit employee details
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Employee } from '../../../../types/employee';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [edit, setEdit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then(res => res.json())
      .then(setEmployee);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!employee) return;
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    setEdit(false);
  };

  const handleDelete = async () => {
    await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    router.push('/apps/employee');
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      {edit ? (
        <form onSubmit={handleUpdate}>
          <input name="name" value={employee.name} onChange={handleChange} required />
          <input name="phone" value={employee.phone} onChange={handleChange} required />
          <input name="address" value={employee.address} onChange={handleChange} required />
          <input name="username" value={employee.username} onChange={handleChange} required />
          <input name="birth" value={employee.birth} onChange={handleChange} required type="date" />
          <input name="position" value={employee.position} onChange={handleChange} required />
          <input name="salaryRate" value={employee.salaryRate} onChange={handleChange} required type="number" />
          <input name="assignedShift" value={employee.assignedShift} onChange={handleChange} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <h1>{employee.name}</h1>
          <p>Phone: {employee.phone}</p>
          <p>Address: {employee.address}</p>
          <p>Username: {employee.username}</p>
          <p>Birth: {employee.birth}</p>
          <p>Position: {employee.position}</p>
          <p>Salary Rate: {employee.salaryRate}</p>
          <p>Assigned Shift: {employee.assignedShift}</p>
          <button onClick={() => setEdit(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
