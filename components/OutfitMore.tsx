"use client";

import { pickOutfit } from "./RequestForm";

/** The dashed "More than one" tile on the customise page. */
export function OutfitMore() {
  return (
    <a href="#book" onClick={() => pickOutfit("More than one outfit")}
      className="h-full w-full rounded-2xl border border-dashed border-gold flex flex-col justify-end p-4 sm:p-6 bg-chalk hover:bg-blush transition-colors duration-500 group">
      <span className="font-display italic text-gold text-3xl inline-block transition-transform duration-500 group-hover:rotate-90 origin-center w-fit">+</span>
      <span className="block font-display text-2xl sm:text-3xl leading-tight mt-2">More than one</span>
      <span className="block text-sm mt-1 text-muted">Family, bridesmaids or a full wedding wardrobe</span>
    </a>
  );
}
