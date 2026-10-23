"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { APPLICATIONS, type AppStatus, type L, type TrackableApplication } from "@/lib/mockData";

export interface SaathiUser {
  name: string;
  aadhaarLast4: string;
  /** Stored full so OTP screens can mask it; never a real number. */
  phone: string;
  dob: string;
  gender: "" | "male" | "female" | "other";
  state: string;
  district: string;
}

export interface AccessibilityPrefs {
  voiceHelp: boolean;
  largeText: boolean;
  slowMode: boolean;
  audioLabels: boolean;
  highContrast: boolean;
}

export interface SubmittedApplication {
  id: string;
  service: L;
  ref: string;
  date: string;
  status: AppStatus;
  /** Apply-flow / task id — lets a department console route it to the right office. */
  flowId?: string;
  /** Small structured extras (e.g. which challan a contest is about). */
  meta?: Record<string, string>;
}

export type OfficerAction = "approved" | "infoRequested" | "rejected" | "issued" | "forwarded" | "viewedKyc" | "viewedDocument" | "citizenResponded";

/**
 * Something an officer did on the citizen's case in a department console.
 * Decisions surface in the inbox and on the status screen; every look at
 * personal data lands in the privacy dashboard's access log.
 */
export interface OfficerEvent {
  id: string;
  appId: string;
  ref: string;
  service: L;
  action: OfficerAction;
  officer: string;
  office: L;
  reason?: L;
  note?: string;
  purpose?: L;
  at: string; // ISO
}

export interface ProtoState {
  /** True once localStorage has been read on the client. */
  hydrated: boolean;
  onboarded: boolean;
  user: SaathiUser;
  /** Selected life-context tags (drives "For You"). */
  lifeContext: string[];
  accessibility: AccessibilityPrefs;
  /** Applications submitted in this prototype (most recent first). */
  submitted: SubmittedApplication[];
  /** Family member id currently being managed (proxy mode), or null. */
  proxyFor: string | null;
  /** Bills / dues paid in this prototype (apply-flow ids). */
  paidBills: string[];
  /** Consent ids the citizen has revoked on the privacy dashboard. */
  revokedConsents: string[];
  /** Notification ids already read. */
  readNotifications: string[];
  /** Status changes made by officers on the built-in sample applications. */
  statusOverrides: Record<string, AppStatus>;
  /** Officer decisions and data access on the citizen's cases (newest first). */
  officerEvents: OfficerEvent[];
}

const DEFAULT_USER: SaathiUser = {
  name: "Rakesh Verma",
  aadhaarLast4: "",
  phone: "+91 98765 43210",
  dob: "",
  gender: "",
  state: "Uttar Pradesh",
  district: "Kanpur Nagar",
};

const DEFAULT_A11Y: AccessibilityPrefs = {
  voiceHelp: true,
  largeText: false,
  slowMode: false,
  audioLabels: false,
  highContrast: false,
};

export const INITIAL: ProtoState = {
  hydrated: false,
  onboarded: false,
  user: DEFAULT_USER,
  lifeContext: [],
  accessibility: DEFAULT_A11Y,
  submitted: [],
  proxyFor: null,
  paidBills: [],
  revokedConsents: [],
  readNotifications: [],
  statusOverrides: {},
  officerEvents: [],
};

type Action =
  | { type: "HYDRATE"; payload: Partial<ProtoState> }
  | { type: "SET_AADHAAR"; last4: string }
  | { type: "SET_PROFILE"; profile: Partial<SaathiUser> }
  | { type: "TOGGLE_LIFE"; tag: string }
  | { type: "SET_ACCESSIBILITY"; prefs: Partial<AccessibilityPrefs> }
  | { type: "ADD_APPLICATION"; app: SubmittedApplication }
  | { type: "SET_PROXY"; id: string | null }
  | { type: "MARK_BILL_PAID"; id: string }
  | { type: "TOGGLE_CONSENT"; id: string }
  | { type: "MARK_NOTIFICATIONS_READ"; ids: string[] }
  | { type: "OFFICER_EVENT"; event: OfficerEvent; status?: AppStatus }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "RESET" };

export function reducer(state: ProtoState, action: Action): ProtoState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        // never let persisted data resurrect stale nested defaults
        user: { ...state.user, ...action.payload.user },
        accessibility: {
          ...state.accessibility,
          ...action.payload.accessibility,
        },
        submitted: action.payload.submitted ?? state.submitted,
        proxyFor: action.payload.proxyFor ?? state.proxyFor,
        paidBills: action.payload.paidBills ?? state.paidBills,
        revokedConsents: action.payload.revokedConsents ?? state.revokedConsents,
        readNotifications: action.payload.readNotifications ?? state.readNotifications,
        statusOverrides: action.payload.statusOverrides ?? state.statusOverrides,
        officerEvents: action.payload.officerEvents ?? state.officerEvents,
        hydrated: true,
      };
    case "SET_AADHAAR":
      return { ...state, user: { ...state.user, aadhaarLast4: action.last4 } };
    case "SET_PROFILE":
      return { ...state, user: { ...state.user, ...action.profile } };
    case "TOGGLE_LIFE": {
      const has = state.lifeContext.includes(action.tag);
      return {
        ...state,
        lifeContext: has
          ? state.lifeContext.filter((t) => t !== action.tag)
          : [...state.lifeContext, action.tag],
      };
    }
    case "SET_ACCESSIBILITY":
      return {
        ...state,
        accessibility: { ...state.accessibility, ...action.prefs },
      };
    case "ADD_APPLICATION":
      return { ...state, submitted: [action.app, ...state.submitted] };
    case "SET_PROXY":
      return { ...state, proxyFor: action.id };
    case "MARK_BILL_PAID":
      return state.paidBills.includes(action.id) ? state : { ...state, paidBills: [...state.paidBills, action.id] };
    case "TOGGLE_CONSENT": {
      const revoked = state.revokedConsents.includes(action.id);
      return {
        ...state,
        revokedConsents: revoked
          ? state.revokedConsents.filter((c) => c !== action.id)
          : [...state.revokedConsents, action.id],
      };
    }
    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        readNotifications: Array.from(new Set([...state.readNotifications, ...action.ids])),
      };
    case "OFFICER_EVENT": {
      const { event, status } = action;
      if (state.officerEvents.some((e) => e.id === event.id)) return state;
      const isSubmitted = state.submitted.some((a) => a.id === event.appId);
      // A decision that doesn't change anything is a duplicate (double click, re-fired timer).
      const current = isSubmitted ? state.submitted.find((a) => a.id === event.appId)?.status : (state.statusOverrides[event.appId] ?? APPLICATIONS.find((a) => a.id === event.appId)?.status);
      if (status && current === status && state.officerEvents[0]?.appId === event.appId && state.officerEvents[0]?.action === event.action) return state;
      return {
        ...state,
        officerEvents: [event, ...state.officerEvents].slice(0, 60),
        submitted: status && isSubmitted ? state.submitted.map((a) => (a.id === event.appId ? { ...a, status } : a)) : state.submitted,
        statusOverrides: status && !isSubmitted ? { ...state.statusOverrides, [event.appId]: status } : state.statusOverrides,
      };
    }
    case "COMPLETE_ONBOARDING":
      return { ...state, onboarded: true };
    case "RESET":
      return { ...INITIAL, hydrated: true };
    default:
      return state;
  }
}

const STORAGE_KEY = "saathi.state";

interface ProtoContextValue extends ProtoState {
  setAadhaar: (last4: string) => void;
  setProfile: (profile: Partial<SaathiUser>) => void;
  toggleLife: (tag: string) => void;
  setAccessibility: (prefs: Partial<AccessibilityPrefs>) => void;
  addApplication: (app: SubmittedApplication) => void;
  setProxy: (id: string | null) => void;
  markBillPaid: (id: string) => void;
  toggleConsent: (id: string) => void;
  markNotificationsRead: (ids: string[]) => void;
  recordOfficerEvent: (event: OfficerEvent, status?: AppStatus) => void;
  completeOnboarding: () => void;
  reset: () => void;
  /** Everything the citizen can track: their submissions, then the samples (with officer status changes applied). */
  applications: TrackableApplication[];
}

const PrototypeContext = createContext<ProtoContextValue | null>(null);

export function usePrototype(): ProtoContextValue {
  const ctx = useContext(PrototypeContext);
  if (!ctx) {
    throw new Error("usePrototype must be used within <PrototypeProvider>");
  }
  return ctx;
}

export function PrototypeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Hydrate once from localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      dispatch({
        type: "HYDRATE",
        payload: raw ? (JSON.parse(raw) as Partial<ProtoState>) : {},
      });
    } catch {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  // Another tab (the department console, or a second prototype) changed the
  // shared state — pick it up so decisions appear live.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        dispatch({ type: "HYDRATE", payload: JSON.parse(e.newValue) as Partial<ProtoState> });
      } catch {
        /* ignore malformed writes */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const persist = {
        onboarded: state.onboarded,
        user: state.user,
        lifeContext: state.lifeContext,
        accessibility: state.accessibility,
        submitted: state.submitted,
        proxyFor: state.proxyFor,
        paidBills: state.paidBills,
        revokedConsents: state.revokedConsents,
        readNotifications: state.readNotifications,
        statusOverrides: state.statusOverrides,
        officerEvents: state.officerEvents,
      };
      const next = JSON.stringify(persist);
      // Skip identical writes so cross-tab sync can't echo back and forth.
      if (window.localStorage.getItem(STORAGE_KEY) === next) return;
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [state]);

  // Actions only close over the stable dispatch, so create them once — stable
  // identities keep effects that depend on them from re-running every render.
  const actions = useMemo<Omit<ProtoContextValue, keyof ProtoState | "applications">>(
    () => ({
      setAadhaar: (last4) => dispatch({ type: "SET_AADHAAR", last4 }),
      setProfile: (profile) => dispatch({ type: "SET_PROFILE", profile }),
      toggleLife: (tag) => dispatch({ type: "TOGGLE_LIFE", tag }),
      setAccessibility: (prefs) => dispatch({ type: "SET_ACCESSIBILITY", prefs }),
      addApplication: (app) => dispatch({ type: "ADD_APPLICATION", app }),
      setProxy: (id) => dispatch({ type: "SET_PROXY", id }),
      markBillPaid: (id) => dispatch({ type: "MARK_BILL_PAID", id }),
      toggleConsent: (id) => dispatch({ type: "TOGGLE_CONSENT", id }),
      markNotificationsRead: (ids) => dispatch({ type: "MARK_NOTIFICATIONS_READ", ids }),
      recordOfficerEvent: (event, status) => dispatch({ type: "OFFICER_EVENT", event, status }),
      completeOnboarding: () => dispatch({ type: "COMPLETE_ONBOARDING" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [],
  );

  const applications = useMemo<TrackableApplication[]>(
    () => [...state.submitted, ...APPLICATIONS.map((a) => (state.statusOverrides[a.id] ? { ...a, status: state.statusOverrides[a.id] } : a))],
    [state.submitted, state.statusOverrides],
  );

  const value: ProtoContextValue = useMemo(() => ({ ...state, ...actions, applications }), [state, actions, applications]);

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
}
