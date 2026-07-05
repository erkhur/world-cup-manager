export default function ImagenModal({ src, alt, onClose }) {
  if (!src) return null
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-sm hover:text-gray-300 transition"
        >
          ✕ Cerrar
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
        />
        {alt && <p className="text-center text-white text-sm mt-3 opacity-80">{alt}</p>}
      </div>
    </div>
  )
}