"use client";

// removed unused import
import { useRef, useState } from "react";

type AdSlotProps = {
  label: string;
  description?: string;
  shape: "square" | "banner-wide" | "banner-medium" | "poster";
};

function AdSlot({ label, description, shape }: AdSlotProps) {
  const [hasFile, setHasFile] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePick = () => inputRef.current?.click();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHasFile(true);
  };

  const shapeClasses = (() => {
    switch (shape) {
      case "square":
        return "w-[200px] h-[200px]";
      case "banner-medium":
        return "w-[520px] h-[160px]"; // medium banner
      case "banner-wide":
        return "w-[920px] h-[260px]"; // wide banner
      case "poster":
        return "w-[260px] h-[200px]"; // poster
    }
  })();

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-sm font-semibold">{label}</div>
      {description ? <div className="text-xs opacity-70 -mt-2">{description}</div> : null}
      <div className="flex flex-col items-center">
        <div className={`relative ${shapeClasses} overflow-hidden rounded-md border border-black/10 dark:border-white/20 bg-neutral-200`}>
          <div className="absolute inset-0 grid place-items-center text-xs text-black/60 dark:text-white/70">
            <div className="flex flex-col items-center gap-1">
              <span className="opacity-80" style={{color: hasFile ? "#000" : "#666"}}>{hasFile ? "Creative selected" : "No creative uploaded"}</span>
              <span className="opacity-60">{shape.replace("-", " ")}</span>
            </div>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        <div className="mt-3 flex items-center justify-center gap-2">
          <IconButton onClick={handlePick} label="Upload">
            <UploadIcon className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={() => {}} label="Link">
            <LinkIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default function AdsPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1100px] mx-auto px-4 sm:px-6">
      <h1 className="text-xl lg:text-2xl font-semibold">Ads Management</h1>

      {/* Questionnaire row: three square tiles */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Questionnaire</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AdSlot label="Questionnaire - Slot A" shape="square" />
          <AdSlot label="Questionnaire - Slot B" shape="square" />
          <AdSlot label="Questionnaire - Slot C" shape="square" />
        </div>
      </section>

      {/* Loading page row: one small poster and one medium banner */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Loading page</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
          <AdSlot label="Loading - Side" shape="poster" />
          <AdSlot label="Loading - Banner" shape="banner-medium" />
        </div>
      </section>

      {/* Dashboard row: one very wide banner */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Dashboard</h2>
        <div className="flex flex-wrap items-start gap-8">
          <AdSlot label="Dashboard - Hero Banner" shape="banner-wide" />
        </div>
      </section>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.07 0l3.54-3.54a5 5 0 0 0-7.07-7.07L11 4" />
      <path d="M14 11a5 5 0 0 0-7.07 0L3.39 14.54a5 5 0 0 0 7.07 7.07L13 20" />
    </svg>
  );
}

function IconButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-xs shadow-sm hover:bg-neutral-100 dark:border-black/10 dark:bg-white dark:hover:bg-neutral-100">
      {children}
    </button>
  );
}

