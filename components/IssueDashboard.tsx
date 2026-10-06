"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "./ui/Pagination";
import StatusIndicator from "./ui/StatusIndicator";
import Table from "./ui/Table";
import styles from "./IssueDashboard.module.css";

type Row = Record<string, unknown>;
type IssueData = { hrms: Row[]; crm: Row[]; ccr: Row[] };
type IssueSource = "HRMS" | "CRM" | "CCR";
type Issue = { id: string; ticketCode: string; category: "CCR" | "CRM" | "HRMS"; department: string; issue: string; description: string; task: string; pic: string; date: string; status: string };
const PAGE_SIZE = 4;
const preferredStatusOrder = ["in progress", "open", "pending", "completed", "closed"];

function value(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const candidate = row[key];
    if (typeof candidate === "string" || typeof candidate === "number") {
      if (String(candidate).trim()) return String(candidate);
    }
  }
  return "-";
}

function dateLabel(raw: string) {
  if (raw === "-") return raw;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function normalize(data: IssueData): Issue[] {
  const mapSource = (rows: Row[], category: IssueSource) => rows.map((row) => ({
      id: value(row, "id"),
      ticketCode: value(row, "ticket_code"),
      category,
      department: value(row, "reporter_department", "department", "employee_id"),
      issue: value(row, "title", "description", "issue", "subject"),
      description: value(row, "description", "details", "issue_description"),
      task: value(row, "task", "task_name"),
      pic: value(row, "pic", "assignee", "owner", "reporter_name", "employee_id"),
      date: dateLabel(value(row, "created_at", "date", "issue_date")),
      status: value(row, "status"),
    }));

  return [
    ...mapSource(data.hrms, "HRMS"),
    ...mapSource(data.crm, "CRM"),
    ...mapSource(data.ccr, "CCR"),
  ];
}

export default function IssueDashboard({ issues: data, loadError = false }: { issues: IssueData; loadError?: boolean }) {
  const [page, setPage] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const allIssues = useMemo(() => normalize(data), [data]);
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const issue of allIssues) {
      const label = issue.status === "-" ? "Belum ditentukan" : issue.status.trim();
      const key = label.toLocaleLowerCase("id-ID");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return [...counts.entries()].sort(([left], [right]) => {
      const leftOrder = preferredStatusOrder.indexOf(left);
      const rightOrder = preferredStatusOrder.indexOf(right);
      if (leftOrder === -1 && rightOrder === -1) return left.localeCompare(right, "id-ID");
      if (leftOrder === -1) return 1;
      if (rightOrder === -1) return -1;
      return leftOrder - rightOrder;
    });
  }, [allIssues]);
  const totalPages = Math.max(1, Math.ceil(allIssues.length / PAGE_SIZE));
  const visibleIssues = allIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedIssue && !dialog.open) dialog.showModal();
    if (!selectedIssue && dialog.open) dialog.close();
  }, [selectedIssue]);

  const rows = visibleIssues.map((issue) => [
    <span key="ticket-code" className={styles.issueId} title={issue.ticketCode}>{issue.ticketCode}</span>,
    <span key="department" className={styles.department}>{issue.department}</span>,
    <span key="issue" className={styles.issueText}>{issue.issue}</span>,
    <span key="pic" className={styles.person}><span className={styles.avatar}>{issue.pic === "-" ? "-" : issue.pic.slice(0, 2).toUpperCase()}</span>{issue.pic}</span>,
    <span key="date" className={styles.date}>{issue.date}</span>,
    <StatusIndicator key="status" status={/complete|selesai|closed/i.test(issue.status) ? "ok" : "info"} label={issue.status} className={styles.statusBadge} />,
  ]);

  return (
    <main className={styles.dashboard}>
      <section className={styles.summarySection} aria-labelledby="issue-status-summary">
        <h2 id="issue-status-summary" className={styles.summaryTitle}>Ringkasan Status</h2>
        <div className={styles.summaryGrid}>
          {statusCounts.map(([status, count]) => (
            <article key={status} className={styles.statusCard}>
              <h3>{status === "belum ditentukan" ? "Belum ditentukan" : status}</h3>
              <p>{count}</p>
              <span>Issue</span>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.tableSection} aria-label="Daftar issue">
        <Table className={styles.issueTable} headers={["Ticket Code", "Departemen", "Issue", "PIC", "Date", "Status"]} rows={rows} onRowClick={(rowIndex) => setSelectedIssue(visibleIssues[rowIndex])} emptyMessage={loadError ? "Data issue gagal dimuat. Periksa koneksi database." : "Data sedang kosong."} />
      </section>
      <Pagination totalPages={totalPages} page={page} onPageChange={setPage} disabled={allIssues.length <= PAGE_SIZE} className={styles.pagination} />
      <dialog
        ref={dialogRef}
        className={styles.detailDialog}
        aria-labelledby="issue-detail-title"
        onCancel={(event) => {
          event.preventDefault();
          setSelectedIssue(null);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) setSelectedIssue(null);
        }}
      >
        {selectedIssue && (
          <>
            <header className={styles.detailHeader}>
              <h2 id="issue-detail-title">Detail Issue</h2>
              <button type="button" className={styles.detailClose} aria-label="Tutup detail" onClick={() => setSelectedIssue(null)}>×</button>
            </header>
            <div className={styles.detailBody}>
              <div className={styles.detailField}><span>Issue</span><strong>{selectedIssue.issue}</strong></div>
              <div className={styles.detailField}><span>Sumber</span><strong>{selectedIssue.category}</strong></div>
              <div className={styles.detailField}><span>Deskripsi</span><strong>{selectedIssue.description === "-" ? selectedIssue.issue : selectedIssue.description}</strong></div>
              <div className={styles.detailField}><span>PIC</span><strong>{selectedIssue.pic}</strong></div>
              <div className={styles.detailField}><span>Task</span><strong>{selectedIssue.task}</strong></div>
              <div className={styles.detailStatus}><span>Status</span><StatusIndicator status={/complete|selesai|closed/i.test(selectedIssue.status) ? "ok" : "info"} label={selectedIssue.status} className={styles.statusBadge} /></div>
            </div>
            <footer className={styles.detailFooter}>
              <button type="button" className={styles.detailDone} onClick={() => setSelectedIssue(null)}>Tutup</button>
            </footer>
          </>
        )}
      </dialog>
    </main>
  );
}