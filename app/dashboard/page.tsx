import DashboardClient from '@/components/DashboardClient';

const initialIssues = [
  {
    id: 'LOG-2048',
    dept: 'CRM',
    issue: 'Kendala sinkronisasi data pelanggan ke sistem pusat',
    date: '2026-09-27',
    pic: 'Dewi Lestari',
    status: 'In Progress',
  },
  {
    id: 'LOG-2051',
    dept: 'CCR',
    issue: 'Pengiriman dokumen legal ke mitra tertunda',
    date: '2026-09-26',
    pic: 'Budi Santoso',
    status: 'Completed',
  },
  {
    id: 'LOG-2060',
    dept: 'HRMS',
    issue: 'Update data payroll karyawan belum terpublikasi',
    date: '2026-09-25',
    pic: 'Nina Rahma',
    status: 'In Progress',
  },
  {
    id: 'LOG-2068',
    dept: 'CRM',
    issue: 'Lead duplicate pada dashboard pemasaran regional',
    date: '2026-09-24',
    pic: 'Rizki Hidayat',
    status: 'Completed',
  },
] as const;

export default function DashboardPage() {
  return <DashboardClient initialIssues={initialIssues} />;
}
