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
    strokeWidth={1.5}
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
      className={`relative group flex flex-col items-center justify-center rounded-sm border transition-all duration-300 cursor-pointer overflow-hidden
        ${isPrimary ? "col-span-2 row-span-2 min-h-[220px]" : "min-h-[120px]"}
        ${previewUrl
          ? "border-neutral-200 bg-neutral-50"
          : "border-dashed border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100"
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
            className="w-full h-full object-cover"
          />
          {/* Remove overlay */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
          >
            <TrashIcon />
          </button>
          {isPrimary && (
            <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase text-neutral-900 shadow-sm">
              Primary
            </span>
          )}
        </>
      ) : (
        <>
          <div className={`text-neutral-400 group-hover:text-neutral-600 transition-colors ${isPrimary ? "mb-3" : "mb-1.5"}`}>
            <UploadIcon />
          </div>
          {isPrimary ? (
            <span className="text-xs tracking-widest text-neutral-500 group-hover:text-neutral-700 transition-colors uppercase font-bold">
              Primary Image
            </span>
          ) : (
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 group-hover:text-neutral-600 transition-colors font-bold">
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
      navigate("/seller/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 py-12 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Back navigation ── */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            <BackArrowIcon />
          </span>
          <span>Back to Dashboard</span>
        </button>

        {/* ── Page header ── */}
        <div className="mb-14">
          <p className="text-sm font-bold text-neutral-400 tracking-widest uppercase mb-3">
            List your item
          </p>
          <h1 className="text-5xl lg:text-6xl font-serif text-neutral-900 tracking-tight leading-none mb-6">
            Create Product
          </h1>
          <div className="w-12 h-0.5 bg-neutral-900" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>

          {/* ── Desktop: two-column | Mobile: single-column ── */}
          <div className="flex flex-col lg:flex-row lg:gap-20 gap-16">

            {/* ════════════════════ LEFT COLUMN — form fields ════════════════════ */}
            <div className="flex-1 space-y-8">

              {/* Section: Title */}
              <div className="space-y-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-neutral-500 tracking-widest uppercase"
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
                  className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base placeholder:text-neutral-400"
                />
              </div>

              {/* Section: Description */}
              <div className="space-y-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-neutral-500 tracking-widest uppercase"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Describe your product in detail — material, condition, sizing…"
                  required
                  className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* Section: Price */}
              <div className="space-y-3">
                <span className="block text-sm font-bold text-neutral-500 tracking-widest uppercase">
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
                      className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base placeholder:text-neutral-400"
                    />
                  </div>

                  {/* Currency */}
                  <div className="w-32">
                    <label htmlFor="priceCurrency" className="sr-only">Currency</label>
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Publish button — visible only on desktop */}
              <div className="hidden lg:block pt-8 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white rounded-sm py-4 px-8 font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Publishing…" : "Publish Product"}
                </button>
              </div>

            </div>

            {/* ════════════════════ RIGHT COLUMN — images ════════════════════ */}
            <div className="lg:w-[480px] space-y-6">

              {/* Images header */}
              <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <span className="block text-xs font-bold text-neutral-500 tracking-widest uppercase">
                    Product Images
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => bulkInputRef.current?.click()}
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 tracking-wide transition-colors underline underline-offset-4"
                    >
                      Select all
                    </button>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">
                  {images.filter(Boolean).length}/{MAX_IMAGES} Added · JPEG/PNG
                </span>
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
                className={`relative transition-all duration-300 ${
                  isDragOver
                    ? "ring-2 ring-neutral-900 ring-offset-4 rounded-sm"
                    : ""
                }`}
                onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleBulkFiles(e.dataTransfer.files);
                }}
              >
                {/* Overlay while dragging */}
                {isDragOver && (
                  <div className="absolute inset-0 z-10 rounded-sm bg-neutral-100/90 border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center pointer-events-none backdrop-blur-sm">
                    <UploadIcon className="text-neutral-600 mb-2 w-8 h-8" />
                    <span className="text-xs text-neutral-900 tracking-widest uppercase font-bold">
                      Drop photos here
                    </span>
                  </div>
                )}

                {/* Image grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Primary — 2 cols × 2 rows */}
                  <div className="col-span-2 row-span-2 min-h-[220px]">
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
                    <div key={i} className="min-h-[104px]">
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
                    <div key={i} className="min-h-[104px]">
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

            </div>

          </div>{/* end two-col */}

          {/* Publish button — mobile only */}
          <div className="lg:hidden pt-12">
            <button
              type="submit"
              disabled={isSubmitting}
               className="w-full bg-neutral-900 text-white rounded-sm py-4 px-8 font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing…" : "Publish Product"}
            </button>
          </div>

        </form>

        <div className="h-24" />
      </div>
    </div>
  );
};

export default CreateProduct;
