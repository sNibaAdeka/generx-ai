import { create } from "zustand";

type ReportProgress = {
  notes: string;
  reviewed: boolean;
  saved: boolean;
};

type ReportStore = {
  reports: Record<string, ReportProgress>;
  setNotes: (reportId: string, notes: string) => void;
  setReviewed: (reportId: string, reviewed: boolean) => void;
  save: (reportId: string) => void;
};

const initialProgress: ReportProgress = {
  notes: "",
  reviewed: false,
  saved: false,
};

export const useReportStore = create<ReportStore>((set) => ({
  reports: {},
  setNotes: (reportId, notes) =>
    set((state) => ({
      reports: {
        ...state.reports,
        [reportId]: { ...(state.reports[reportId] ?? initialProgress), notes },
      },
    })),
  setReviewed: (reportId, reviewed) =>
    set((state) => ({
      reports: {
        ...state.reports,
        [reportId]: {
          ...(state.reports[reportId] ?? initialProgress),
          reviewed,
        },
      },
    })),
  save: (reportId) =>
    set((state) => ({
      reports: {
        ...state.reports,
        [reportId]: {
          ...(state.reports[reportId] ?? initialProgress),
          saved: true,
        },
      },
    })),
}));
