import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";

/* ------------------------------------------------------------------ */
/*  Tiny SVG icon helpers                                               */
/* ------------------------------------------------------------------ */
const UploadIcon = () => (
  <svg  
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];
const MAX_IMAGES = 7;

/* ------------------------------------------------------------------ */
/*  ImageSlot sub-component                                             */
/* ------------------------------------------------------------------ */
const ImageSlot = ({ index, isPrimary, file, previewUrl, onFile, onRemove }) => {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) onFile(index, dropped);
  };

  return (
    <div
      className={`relative group flex flex-col items-center justify-center rounded-2xl border border-dashed transition-all duration-300 cursor-pointer
        ${isPrimary ? "col-span-2 row-span-2 min-h-[220px]" : "min-h-[120px]"}
        ${previewUrl
          ? "border-[#ffd700]/40 bg-[#0e0e0e]"
          : "border-[#4d4732]/40 bg-[#0e0e0e] hover:border-[#ffd700]/50 hover:bg-[#1c1b1b]"
        }`}
      onClick={() => !previewUrl && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      title={isPrimary ? "Primary Image" : `Image ${index + 1}`}
    >
      {previewUrl ? (
        <>
          {/* Preview image */}
          <img
            src={previewUrl}
            alt={`Upload ${index + 1}`}
            className="w-full h-full object-cover rounded-2xl"
          />
          {/* Remove overlay */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#131313]/80 text-[#ffb4ab] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#93000a]/80"
          >
            <TrashIcon />
          </button>
          {isPrimary && (
            <span className="absolute bottom-2 left-3 text-xs font-semibold tracking-widest uppercase text-[#ffd700]/80">
              Primary
            </span>
          )}
        </>
      ) : (
        <>
          <div className={`text-[#4d4732] group-hover:text-[#ffd700]/60 transition-colors ${isPrimary ? "mb-3" : "mb-1.5"}`}>
            <UploadIcon />
          </div>
          {isPrimary ? (
            <span className="text-sm tracking-widest text-[#4d4732] group-hover:text-[#d0c6ab]/60 transition-colors uppercase font-medium">
              Primary Image
            </span>
          ) : (
            <span className="text-xs tracking-wide text-[#4d4732] group-hover:text-[#d0c6ab]/50 transition-colors">
              Add photo
            </span>
          )}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) onFile(index, f);
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */
const CreateProduct = () => {
  const {handleCreateProduct}=useProduct()
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  // Array of { file, previewUrl } – up to 7 slots
  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const bulkInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFile = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      next[index] = { file, previewUrl: url };
      return next;
    });
  };

  const handleImageRemove = (index) => {
    setImages((prev) => {
      const next = [...prev];
      if (next[index]?.previewUrl) URL.revokeObjectURL(next[index].previewUrl);
      next[index] = null;
      return next;
    });
  };

  // Fill multiple empty slots from a FileList (bulk drop / bulk select)
  const handleBulkFiles = (fileList) => {
    const imageFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!imageFiles.length) return;
    setImages((prev) => {
      const next = [...prev];
      let fileIdx = 0;
      for (let slot = 0; slot < MAX_IMAGES && fileIdx < imageFiles.length; slot++) {
        if (!next[slot]) {
          const url = URL.createObjectURL(imageFiles[fileIdx]);
          next[slot] = { file: imageFiles[fileIdx], previewUrl: url };
          fileIdx++;
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: wire up to useProduct hook / API
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("priceAmount", formData.priceAmount);
      payload.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => {
        if (img?.file) payload.append("images", img.file);
      });
      console.log("Submitting product…", Object.fromEntries(payload));
      await handleCreateProduct(payload);
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  return (
    <div
      className="min-h-screen bg-[#131313] font-['Inter',sans-serif] py-14 px-6 lg:px-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Back navigation ── */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#d0c6ab] hover:text-[#ffd700] transition-colors mb-12 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">
            <BackArrowIcon />
          </span>
          <span className="text-base tracking-wide">Back</span>
        </button>

        {/* ── Page header ── */}
        <div className="mb-14">
          <h1
            className="text-5xl lg:text-6xl font-extrabold text-[#e5e2e1] tracking-tight leading-none mb-3"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Create Product
          </h1>
          <p className="text-base text-[#ffd700]/70 tracking-widest uppercase font-medium">
            List your item for sale
          </p>
          <div className="mt-5 w-10 h-0.5 bg-gradient-to-r from-[#ffd700] to-[#e9c400]" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>

          {/* ── Desktop: two-column | Mobile: single-column ── */}
          <div className="flex flex-col lg:flex-row lg:gap-16 gap-12">

            {/* ════════════════════ LEFT COLUMN — form fields ════════════════════ */}
            <div className="flex-1 space-y-10">

              {/* Section: Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm text-[#d0c6ab] tracking-widest uppercase font-semibold ml-1"
                >
                  Product Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Vintage Leather Jacket"
                  required
                  className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-6 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/60 focus:ring-1 focus:ring-[#ffd700]/30 transition-all outline-none placeholder:text-[#4d4732] text-base"
                />
              </div>

              {/* Section: Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm text-[#d0c6ab] tracking-widest uppercase font-semibold ml-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Describe your product in detail — material, condition, sizing…"
                  required
                  className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-6 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/60 focus:ring-1 focus:ring-[#ffd700]/30 transition-all outline-none resize-none placeholder:text-[#4d4732] text-base leading-relaxed"
                />
              </div>

              {/* Section: Price */}
              <div className="space-y-3">
                <span className="block text-sm text-[#d0c6ab] tracking-widest uppercase font-semibold ml-1">
                  Price
                </span>
                <div className="flex gap-4">
                  {/* Amount */}
                  <div className="flex-1">
                    <label htmlFor="priceAmount" className="sr-only">Amount</label>
                    <input
                      id="priceAmount"
                      type="number"
                      name="priceAmount"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-6 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/60 focus:ring-1 focus:ring-[#ffd700]/30 transition-all outline-none placeholder:text-[#4d4732] text-base"
                    />
                  </div>

                  {/* Currency */}
                  <div className="w-36">
                    <label htmlFor="priceCurrency" className="sr-only">Currency</label>
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-5 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/60 focus:ring-1 focus:ring-[#ffd700]/30 transition-all outline-none text-base appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23d0c6ab' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1c1b1b]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Publish button — visible only on desktop (sits under Left column) */}
              <div className="hidden lg:block pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#ffd700] to-[#e9c400] text-[#3a3000] rounded-full py-4 px-8 font-bold text-base tracking-[0.18em] uppercase transition-all duration-300
                    hover:shadow-[0_0_28px_rgba(255,215,0,0.25)] hover:scale-[1.01]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Publishing…" : "Publish Product"}
                </button>
              </div>

            </div>

            {/* ════════════════════ RIGHT COLUMN — images ════════════════════ */}
            <div className="lg:w-[420px] xl:w-[480px] space-y-4 lg:pt-0">

              {/* Images header */}
              <div className="flex items-end justify-between ml-1">
                <span className="block text-sm text-[#d0c6ab] tracking-widest uppercase font-semibold">
                  Product Images
                </span>
                <div className="flex items-center gap-3">
                  {/* Bulk select button */}
                  <button
                    type="button"
                    onClick={() => bulkInputRef.current?.click()}
                    className="text-xs text-[#ffd700]/60 hover:text-[#ffd700] tracking-wide transition-colors underline underline-offset-2"
                  >
                    Select all
                  </button>
                  <span className="text-xs text-[#4d4732] tracking-wide">
                    {images.filter(Boolean).length}/{MAX_IMAGES} added
                  </span>
                </div>
              </div>

              {/* Hidden multi-file input for bulk select */}
              <input
                ref={bulkInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { handleBulkFiles(e.target.files); e.target.value = ""; }}
              />

              {/* ── Bulk drag-and-drop wrapper ── */}
              <div
                className={`relative rounded-2xl transition-all duration-300 ${
                  isDragOver
                    ? "ring-2 ring-[#ffd700]/60 shadow-[0_0_32px_rgba(255,215,0,0.12)]"
                    : ""
                }`}
                onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => {
                  // only fire when leaving the wrapper itself
                  if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleBulkFiles(e.dataTransfer.files);
                }}
              >
                {/* Gold overlay while dragging */}
                {isDragOver && (
                  <div className="absolute inset-0 z-10 rounded-2xl bg-[#ffd700]/5 border-2 border-dashed border-[#ffd700]/50 flex flex-col items-center justify-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#ffd700]/70 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm text-[#ffd700]/80 tracking-widest uppercase font-semibold">
                      Drop all photos here
                    </span>
                  </div>
                )}

                {/* Image grid:
                    Primary slot spans 2 cols × 2 rows.
                    Slots 1-2 sit in the 3rd column (rows 1-2).
                    Slots 3-6 fill the bottom two rows across 3 cols. */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Primary — 2 cols × 2 rows */}
                  <div className="col-span-2 row-span-2 min-h-[180px] lg:min-h-[220px]">
                    <ImageSlot
                      index={0}
                      isPrimary
                      file={images[0]?.file}
                      previewUrl={images[0]?.previewUrl}
                      onFile={handleImageFile}
                      onRemove={handleImageRemove}
                    />
                  </div>

                  {/* Slots 1-2 (3rd col, rows 1-2) */}
                  {[1, 2].map((i) => (
                    <div key={i} className="min-h-[86px] lg:min-h-[104px]">
                      <ImageSlot
                        index={i}
                        isPrimary={false}
                        file={images[i]?.file}
                        previewUrl={images[i]?.previewUrl}
                        onFile={handleImageFile}
                        onRemove={handleImageRemove}
                      />
                    </div>
                  ))}

                  {/* Slots 3-6 (bottom, 3 across) */}
                  {[3, 4, 5, 6].map((i) => (
                    <div key={i} className="min-h-[86px] lg:min-h-[104px]">
                      <ImageSlot
                        index={i}
                        isPrimary={false}
                        file={images[i]?.file}
                        previewUrl={images[i]?.previewUrl}
                        onFile={handleImageFile}
                        onRemove={handleImageRemove}
                      />
                    </div>
                  ))}
                </div>
              </div>{/* end bulk drop wrapper */}

              <p className="text-xs text-[#4d4732] tracking-wide ml-1">
                Drop multiple photos at once · or click any slot · JPEG, PNG, WebP · Max 7
              </p>
            </div>

          </div>{/* end two-col */}

          {/* Publish button — mobile only (full-width below everything) */}
          <div className="lg:hidden pt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#ffd700] to-[#e9c400] text-[#3a3000] rounded-full py-4 px-8 font-bold text-base tracking-[0.18em] uppercase transition-all duration-300
                hover:shadow-[0_0_28px_rgba(255,215,0,0.25)] hover:scale-[1.01]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Publishing…" : "Publish Product"}
            </button>
          </div>

        </form>

        {/* Bottom breathing space */}
        <div className="h-24" />
      </div>
    </div>
  );
};

export default CreateProduct;
