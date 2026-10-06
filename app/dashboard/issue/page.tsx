import IssueDashboard from "@/components/IssueDashboard";
import { DashboardShell } from "@/components/DashboardClient";
import { getIssues, type IssueGroups } from "@/lib/issues";

const fallbackIssues: IssueGroups = {
  hrms: [
    {
      id: "HR-1001",
      ticket_code: "HRMS-2401",
      reporter_department: "Human Resource",
      title: "Data payroll karyawan bulan September belum terupdate di dashboard HRMS",
      employee_id: "EMP-1042",
      status: "In Progress",
      created_at: "2026-09-27T08:15:00.000Z",
      source: "HRMS",
      description: "Perubahan data payroll bulan September belum tersinkron ke dashboard.",
      task: "Periksa proses sinkronisasi payroll",
    },
    {
      id: "HR-1002",
      ticket_code: "HRMS-2402",
      reporter_department: "Human Resource",
      title: "Pengajuan cuti tahunan belum muncul pada rekap tim",
      employee_id: "EMP-1184",
      status: "Pending",
      created_at: "2026-09-29T09:30:00.000Z",
      source: "HRMS",
      description: "Pengajuan cuti sudah disetujui atasan tetapi belum tercatat pada rekap.",
      task: "Validasi status persetujuan cuti",
    },
    {
      id: "HR-1003",
      ticket_code: "HRMS-2403",
      reporter_department: "Human Resource",
      title: "Akun karyawan baru belum aktif setelah proses onboarding",
      employee_id: "EMP-1250",
      status: "Open",
      created_at: "2026-09-30T07:45:00.000Z",
      source: "HRMS",
      description: "Karyawan baru belum dapat mengakses portal HRMS.",
      task: "Aktifkan akun dan verifikasi akses",
    },
    {
      id: "HR-1004",
      ticket_code: "HRMS-2404",
      reporter_department: "Human Resource",
      title: "Perbaikan format laporan kehadiran telah selesai",
      employee_id: "EMP-1091",
      status: "Completed",
      created_at: "2026-10-01T11:10:00.000Z",
      source: "HRMS",
      description: "Kolom total jam kerja sudah ditampilkan pada laporan.",
      task: "Perbarui format laporan kehadiran",
    },
  ],
  crm: [
    {
      id: "CRM-1001",
      ticket_code: "CRM-2480",
      reporter_department: "Sales CRM",
      title: "Lead duplicate tertumpuk pada akun pelanggan utama daerah Jakarta",
      employee_id: "EMP-2210",
      status: "Open",
      created_at: "2026-09-28T10:45:00.000Z",
      source: "CRM",
      description: "Beberapa lead dengan data serupa tampil lebih dari satu kali.",
      task: "Gabungkan lead duplikat",
    },
    {
      id: "CRM-1002",
      ticket_code: "CRM-2481",
      reporter_department: "Sales CRM",
      title: "Riwayat komunikasi pelanggan belum tersimpan",
      employee_id: "EMP-2273",
      status: "In Progress",
      created_at: "2026-09-29T12:20:00.000Z",
      source: "CRM",
      description: "Catatan panggilan terbaru tidak terlihat di halaman pelanggan.",
      task: "Periksa penyimpanan riwayat komunikasi",
    },
    {
      id: "CRM-1003",
      ticket_code: "CRM-2482",
      reporter_department: "Sales CRM",
      title: "Sinkronisasi kontak pelanggan telah diperbaiki",
      employee_id: "EMP-2308",
      status: "Closed",
      created_at: "2026-09-30T14:05:00.000Z",
      source: "CRM",
      description: "Data kontak kini berhasil diperbarui dari sistem pusat.",
      task: "Validasi sinkronisasi kontak",
    },
    {
      id: "CRM-1004",
      ticket_code: "CRM-2483",
      reporter_department: "Sales CRM",
      title: "Halaman ringkasan prospek membutuhkan waktu muat lama",
      employee_id: "EMP-2351",
      status: "In Progress",
      created_at: "2026-10-01T08:50:00.000Z",
      source: "CRM",
      description: "Pemuatan data melambat saat jumlah prospek bertambah.",
      task: "Optimalkan pemuatan ringkasan prospek",
    },
  ],
  ccr: [
    {
      id: "CCR-1001",
      ticket_code: "CCR-3104",
      reporter_department: "Customer Care",
      title: "Dokumen legal customer belum lengkap untuk proses onboarding mitra",
      employee_id: "EMP-3317",
      status: "Closed",
      created_at: "2026-09-26T13:20:00.000Z",
      source: "CCR",
      description: "Dokumen legal customer telah dilengkapi dan diverifikasi.",
      task: "Tinjau kelengkapan dokumen onboarding",
    },
    {
      id: "CCR-1002",
      ticket_code: "CCR-3105",
      reporter_department: "Customer Care",
      title: "Permintaan pembaruan alamat penagihan belum diproses",
      employee_id: "EMP-3402",
      status: "Pending",
      created_at: "2026-09-29T15:35:00.000Z",
      source: "CCR",
      description: "Pembaruan alamat menunggu konfirmasi dari pelanggan.",
      task: "Konfirmasi alamat penagihan",
    },
    {
      id: "CCR-1003",
      ticket_code: "CCR-3106",
      reporter_department: "Customer Care",
      title: "Kendala akses portal mitra sedang ditangani",
      employee_id: "EMP-3520",
      status: "In Progress",
      created_at: "2026-09-30T09:25:00.000Z",
      source: "CCR",
      description: "Mitra menerima pesan gagal masuk meskipun kredensial benar.",
      task: "Periksa autentikasi portal mitra",
    },
    {
      id: "CCR-1004",
      ticket_code: "CCR-3107",
      reporter_department: "Customer Care",
      title: "Permintaan salinan invoice telah diselesaikan",
      employee_id: "EMP-3677",
      status: "Completed",
      created_at: "2026-10-01T16:40:00.000Z",
      source: "CCR",
      description: "Salinan invoice sudah dikirim ke alamat email terdaftar.",
      task: "Kirim salinan invoice",
    },
  ],
};

export default async function Home() {
  let issues: IssueGroups = fallbackIssues;
  let loadError = false;

  try {
    const result = await getIssues();
    const merged = [
      ...result.bySource.hrms,
      ...result.bySource.crm,
      ...result.bySource.ccr,
    ];

    if (merged.length > 0) {
      issues = result.bySource;
    } else {
      issues = fallbackIssues;
    }
  } catch (error) {
    console.error("Gagal memuat data issue:", error);
    issues = fallbackIssues;
    loadError = false;
  }

  return (
    <DashboardShell activePage="issue-board">
      <IssueDashboard issues={issues} loadError={loadError} />
    </DashboardShell>
  );
}