"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gallery } from "@/lib/people";

export function GalleryGrid() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const pic = gallery[index];
  const step = (n: number) => setIndex((index + n + gallery.length) % gallery.length);

  return (
    <div className="wrap-page py-10 sm:py-14">
      <ul className="columns-2 gap-4 lg:columns-3">
        {gallery.map((g, i) => (
          <li key={g.src} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => {
                setIndex(i);
                dialog.current?.showModal();
              }}
              aria-label={`View larger: ${g.alt}`}
              className="group block w-full overflow-hidden rounded-3xl"
            >
              <Image
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                sizes="(min-width: 1024px) 30vw, 46vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-103"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        className="on-dark m-auto w-full max-w-5xl rounded-3xl bg-aubergine p-4 text-porcelain"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        <div className="relative h-[70dvh]">
          <Image src={pic.src} alt={pic.alt} fill sizes="90vw" className="object-contain" />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0">{pic.alt}</p>
          <div className="flex gap-2">
            <button type="button" className="btn border-[1.5px] border-porcelain" onClick={() => step(-1)}>Previous</button>
            <button type="button" className="btn border-[1.5px] border-porcelain" onClick={() => step(1)}>Next</button>
            <button type="button" className="btn btn-champagne" onClick={() => dialog.current?.close()}>Close</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
