import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

declare global {
  interface Window {
    cp?: {
      CloudPayments: new () => CloudPaymentsWidget;
    };
  }
}

export interface CloudPaymentsOptions {
  publicId: string;
  description: string;
  amount: number;
  currency: string;
  accountId?: string;
  invoiceId?: string;
  email?: string;
  skin?: "classic" | "mini" | "modern";
  data?: Record<string, unknown>;
}

export interface CloudPaymentsCallbacks {
  onSuccess?: (options: unknown) => void;
  onFail?: (reason: unknown, options: unknown) => void;
  onComplete?: (
    paymentResult: unknown,
    options: unknown,
    methods: unknown,
  ) => void;
}

interface CloudPaymentsContextValue {
  ready: boolean;
  open: (
    options: CloudPaymentsOptions,
    callbacks?: CloudPaymentsCallbacks,
  ) => void;
}

interface CloudPaymentsWidget {
  pay(
    type: "charge" | "auth",
    options: CloudPaymentsOptions,
    callbacks?: CloudPaymentsCallbacks,
  ): void;
}

const CloudPaymentsContext = createContext<CloudPaymentsContextValue | null>(
  null,
);

const SCRIPT_SRC = "https://widget.cloudpayments.ru/bundles/cloudpayments.js";

export function CloudPaymentsProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  const widgetRef = useRef<CloudPaymentsWidget | null>(null);

  useEffect(() => {
    if (window.cp?.CloudPayments) {
      setReady(true);
      return;
    }

    let script = document.querySelector(
      `script[src="${SCRIPT_SRC}"]`,
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    const onLoad = () => setReady(true);

    script.addEventListener("load", onLoad);

    if (window.cp?.CloudPayments) {
      setReady(true);
    }

    return () => script?.removeEventListener("load", onLoad);
  }, []);

  const open = useCallback(
    (options: CloudPaymentsOptions, callbacks?: CloudPaymentsCallbacks) => {
      if (!widgetRef.current) {
        widgetRef.current = new window.cp!.CloudPayments();
      }

      widgetRef.current.pay("charge", options, callbacks);
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      open,
    }),
    [ready, open],
  );

  return (
    <CloudPaymentsContext.Provider value={value}>
      {children}
    </CloudPaymentsContext.Provider>
  );
}

export function useCloudPayments() {
  const context = useContext(CloudPaymentsContext);

  if (!context) {
    throw new Error(
      "useCloudPayments must be used inside CloudPaymentsProvider",
    );
  }

  return context;
}
