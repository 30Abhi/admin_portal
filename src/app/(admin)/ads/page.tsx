"use client";

import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useAdsStore } from "./_store";
import type { AdSlot } from "@/types";
import { LinkIcon } from "lucide-react";

type AdSlotProps = {
  ad: AdSlot;
  label: string;
  description?: string;
};

type UrlModalType = "targetUrl" | "eventTrackerUrl" | "clickTrackerBaseUrl" | "impressionTrackerUrl" | null;

function AdSlotComponent({ ad, label, description }: AdSlotProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [urlModalType, setUrlModalType] = useState<UrlModalType>(null);
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
    if (!ad.imageUrl) {
      toast.error("No image uploaded yet");
      return;
    }
    setUrlModalType("targetUrl");
  };

  const handleEventTrackerClick = () => {
    if (!ad.imageUrl) {
      toast.error("No image uploaded yet");
      return;
    }
    setUrlModalType("eventTrackerUrl");
  };

  const handleClickTrackerBaseClick = () => {
    if (!ad.imageUrl) {
      toast.error("No image uploaded yet");
      return;
    }
    setUrlModalType("clickTrackerBaseUrl");
  };

  const handleImpressionTrackerClick = () => {
    if (!ad.imageUrl) {
      toast.error("No image uploaded yet");
      return;
    }
    setUrlModalType("impressionTrackerUrl");
  };

  const shapeClasses = (() => {
    switch (ad.shape) {
      case "square":
        return "w-[200px] h-[200px] sm:w-[180px] sm:h-[180px]";
      case "banner-medium":
        return "w-[320px] h-[100px] sm:w-[420px] sm:h-[130px] lg:w-[520px] lg:h-[160px]"; // responsive medium banner
      case "banner-wide":
        return "w-[320px] h-[90px] sm:w-[520px] sm:h-[150px] lg:w-[720px] lg:h-[200px] xl:w-[920px] xl:h-[260px]"; // responsive wide banner
      case "poster":
        return "w-[200px] h-[150px] sm:w-[240px] sm:h-[180px] lg:w-[260px] lg:h-[200px]"; // responsive poster
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
            <Image 
              src={ad.imageUrl!} 
              alt={`Ad ${ad.adNumber}`}
              fill
              className="object-contain bg-white dark:bg-gray-100"
              sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
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
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <IconButton onClick={handlePick} label="Upload" disabled={isUploading}>
            <UploadIcon className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={handleLinkClick} label="Link" disabled={isUploading || !hasImage}>
            <LinkIcon  className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={handleEventTrackerClick} label="Event Tracker" disabled={isUploading || !hasImage}>
            <span className="text-[10px] font-medium">EVT</span>
          </IconButton>
          <IconButton onClick={handleClickTrackerBaseClick} label="Click Tracker Base" disabled={isUploading || !hasImage}>
            <span className="text-[10px] font-medium">CLK</span>
          </IconButton>
          <IconButton onClick={handleImpressionTrackerClick} label="Impression Tracker" disabled={isUploading || !hasImage}>
            <span className="text-[10px] font-medium">IMP</span>
          </IconButton>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-1 text-xs">
          {hasTargetUrl && (
            <div className="text-green-600">✓ Target URL set</div>
          )}
          {ad.eventTrackerUrl && (
            <div className="text-green-600">✓ Event tracker set</div>
          )}
          {ad.clickTrackerBaseUrl && (
            <div className="text-green-600">✓ Click tracker base set</div>
          )}
          {ad.impressionTrackerUrl && (
            <div className="text-green-600">✓ Impression tracker set</div>
          )}
        </div>
      </div>
      
      {/* Image Modal */}
      {showImageModal && (
        <ImageModal 
          imageUrl={ad.imageUrl!} 
          onClose={() => setShowImageModal(false)}
          label={label}
        />
      )}

      {/* URL Input Modal */}
      {urlModalType && (
        <UrlInputModal
          type={urlModalType}
          currentUrl={
            urlModalType === "targetUrl" ? ad.targetUrl || "" :
            urlModalType === "eventTrackerUrl" ? ad.eventTrackerUrl || "" :
            urlModalType === "clickTrackerBaseUrl" ? ad.clickTrackerBaseUrl || "" :
            ad.impressionTrackerUrl || ""
          }
          onClose={() => setUrlModalType(null)}
          onSave={async (url) => {
            const trimmed = url.trim();
            try {
              if (trimmed.length > 0) {
                const urlObj = new URL(trimmed);
                if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
                  toast.error("URL must start with http or https");
                  return;
                }
                
                if (urlModalType === "targetUrl") {
                  await updateAd(ad.adNumber, ad.imageUrl!, trimmed);
                  toast.success("Link updated");
                } else {
                  await updateAd(
                    ad.adNumber,
                    ad.imageUrl || "",
                    ad.targetUrl || "",
                    {
                      [urlModalType]: trimmed
                    }
                  );
                  const labels = {
                    eventTrackerUrl: "Event tracker URL",
                    clickTrackerBaseUrl: "Click tracker base URL",
                    impressionTrackerUrl: "Impression tracker URL"
                  };
                  toast.success(`${labels[urlModalType]} updated`);
                }
              } else {
                // Clear URL
                if (urlModalType === "targetUrl") {
                  await updateAd(ad.adNumber, ad.imageUrl!, "");
                  toast.success("Link cleared");
                } else {
                  await updateAd(
                    ad.adNumber,
                    ad.imageUrl || "",
                    ad.targetUrl || "",
                    {
                      [urlModalType]: ""
                    }
                  );
                  const labels = {
                    eventTrackerUrl: "Event tracker URL",
                    clickTrackerBaseUrl: "Click tracker base URL",
                    impressionTrackerUrl: "Impression tracker URL"
                  };
                  toast.success(`${labels[urlModalType]} cleared`);
                }
              }
              setUrlModalType(null);
            } catch {
              toast.error("Invalid URL");
            }
          }}
        />
      )}
    </div>
  );
}

function ImageModal({ imageUrl, onClose, label }: { 
  imageUrl: string; 
  onClose: () => void; 
  label: string; 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-[90vw] max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {label} - Preview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Image */}
        <div className="p-4 relative">
          <Image
            src={imageUrl}
            alt={`${label} preview`}
            width={800}
            height={600}
            className="max-w-full max-h-[70vh] object-contain rounded-md"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      </div>
    </div>
  );
}

function UrlInputModal({ 
  type, 
  currentUrl, 
  onClose, 
  onSave 
}: { 
  type: Exclude<UrlModalType, null>; 
  currentUrl: string; 
  onClose: () => void; 
  onSave: (url: string) => Promise<void>;
}) {
  const [url, setUrl] = useState(currentUrl);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(url);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const labels = {
    targetUrl: "Target URL",
    eventTrackerUrl: "Event Tracker URL",
    clickTrackerBaseUrl: "Click Tracker Base URL",
    impressionTrackerUrl: "Impression Tracker URL"
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {labels[type]}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
            disabled={isSaving}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter URL (include https://)
            </label>
            <input
              ref={inputRef}
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              disabled={isSaving}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Leave empty to clear the URL
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
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
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-8 items-start justify-items-center lg:justify-items-start">
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
        <div className="flex flex-wrap items-start gap-6 lg:gap-8 justify-center lg:justify-start">
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

