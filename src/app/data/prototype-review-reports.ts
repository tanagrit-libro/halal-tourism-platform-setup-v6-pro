export type ReviewReportStatus = "New" | "In Review" | "Dismissed" | "Review Hidden";

export interface ReviewReport {
  id: string;
  reviewId: string;
  placeName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  reason: string;
  reportedBy: string;
  reportedAt: string;
  status: ReviewReportStatus;
  adminNote?: string;
}

const STORAGE_KEY = "halal-tourism-review-reports-v7";

const DEFAULT_REPORTS: ReviewReport[] = [
  {
    id: "RPT-001",
    reviewId: "2",
    placeName: "Grand Mosque Restaurant",
    reviewerName: "Fatima Ali",
    rating: 4,
    comment: "Great food and service. Very welcoming for Muslim families.",
    reason: "Possible duplicate review from the same trip group",
    reportedBy: "Ahmad Hassan",
    reportedAt: "2026-06-29 14:20",
    status: "In Review",
    adminNote: "Check account pattern before hiding.",
  },
];

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadReviewReports(): ReviewReport[] {
  if (!isBrowser()) return DEFAULT_REPORTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
      return DEFAULT_REPORTS;
    }
    const parsed = JSON.parse(raw) as ReviewReport[];
    return parsed.length ? parsed : DEFAULT_REPORTS;
  } catch {
    return DEFAULT_REPORTS;
  }
}

export function saveReviewReports(reports: ReviewReport[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  window.dispatchEvent(new CustomEvent("prototype-review-reports-updated"));
}

export function addReviewReport(report: Omit<ReviewReport, "id" | "reportedAt" | "status">) {
  const reports = loadReviewReports();
  const next: ReviewReport = {
    ...report,
    id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
    reportedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    status: "New",
  };
  saveReviewReports([next, ...reports]);
  return next;
}

export function updateReviewReport(id: string, patch: Partial<ReviewReport>) {
  const next = loadReviewReports().map((report) => report.id === id ? { ...report, ...patch } : report);
  saveReviewReports(next);
}
