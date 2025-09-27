"use client";

import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdsStore } from "./_store";
import type { AdSlot } from "@/types";

type AdSlotProps = {
  ad: AdSlot;
  label: string;
  description?: string;
};

function AdSlotComponent({ ad, label, description }: AdSlotProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updateAd, uploadAdImage } = useAdsStore();

  const handlePick = () => inputRef.current?.click();
  
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload the image
      const imageUrl = await uploadAdImage(ad.adNumber, file);
      
      // Update the ad with the new image URL
      await updateAd(ad.adNumber, imageUrl, ad.targetUrl || "");
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkClick = () => {
    const targetUrl = prompt("Enter target URL:", ad.targetUrl || "");
    if (targetUrl !== null) {
      updateAd(ad.adNumber, ad.imageUrl || "", targetUrl)
        .then(() => toast.success("Target URL updated"))
        .catch(() => toast.error("Failed to update target URL"));
    }
  };

  const shapeClasses = (() => {
    switch (ad.shape) {
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

  const hasImage = Boolean(ad.imageUrl);
  const hasTargetUrl = Boolean(ad.targetUrl);

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-sm font-semibold">{label}</div>
      {description ? <div className="text-xs opacity-70 -mt-2">{description}</div> : null}
      <div className="flex flex-col items-center">
        <div className={`relative ${shapeClasses} overflow-hidden rounded-md border border-black/10 dark:border-white/20 bg-neutral-200`}>
          {hasImage ? (
            <img 
              src={ad.imageUrl} 
              alt={`Ad ${ad.adNumber}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-black/60 dark:text-white/70">
              <div className="flex flex-col items-center gap-1">
                <span className="opacity-80" style={{color: hasImage ? "#000" : "#666"}}>
                  {isUploading ? "Uploading..." : hasImage ? "Creative uploaded" : "No creative uploaded"}
                </span>
                <span className="opacity-60">{ad.shape.replace("-", " ")}</span>
              </div>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} disabled={isUploading} />
        <div className="mt-3 flex items-center justify-center gap-2">
          <IconButton onClick={handlePick} label="Upload" disabled={isUploading}>
            <UploadIcon className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={handleLinkClick} label="Link" disabled={isUploading}>
            <LinkIcon className="h-4 w-4" />
          </IconButton>
        </div>
        {hasTargetUrl && (
          <div className="mt-2 text-xs text-green-600">
            ✓ Target URL set
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdsPage() {
  const { ads, fetchAds } = useAdsStore();

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Get ads by section
  const questionnaireAds = ads.filter(ad => ad.section === "questionnaire");
  const loadingAds = ads.filter(ad => ad.section === "loading");
  const dashboardAds = ads.filter(ad => ad.section === "dashboard");

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1100px] mx-auto px-4 sm:px-6">
      <h1 className="text-xl lg:text-2xl font-semibold">Ads Management</h1>

      {/* Questionnaire row: three square tiles */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Questionnaire</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {questionnaireAds.map((ad) => (
            <AdSlotComponent 
              key={ad.adNumber}
              ad={ad}
              label={`Questionnaire - Slot ${String.fromCharCode(64 + ad.adNumber)}`}
            />
          ))}
        </div>
      </section>

      {/* Loading page row: one small poster and one medium banner */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Loading page</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
          {loadingAds.map((ad) => (
            <AdSlotComponent 
              key={ad.adNumber}
              ad={ad}
              label={ad.shape === "poster" ? "Loading - Side" : "Loading - Banner"}
            />
          ))}
        </div>
      </section>

      {/* Dashboard row: one very wide banner */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Dashboard</h2>
        <div className="flex flex-wrap items-start gap-8">
          {dashboardAds.map((ad) => (
            <AdSlotComponent 
              key={ad.adNumber}
              ad={ad}
              label="Dashboard - Hero Banner"
            />
          ))}
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

function IconButton({ children, onClick, label, disabled = false }: { 
  children: React.ReactNode; 
  onClick: () => void; 
  label: string;
  disabled?: boolean;
}) {
  return (
    <button 
      onClick={onClick} 
      aria-label={label} 
      title={label} 
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-xs shadow-sm hover:bg-neutral-100 dark:border-black/10 dark:bg-white dark:hover:bg-neutral-100 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}

