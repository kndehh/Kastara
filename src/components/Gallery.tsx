import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  type Card,
  type CardQuery,
  defaultCardQuery,
  queryCards,
} from "@/domain/cards";
import { useState } from "react";
import { useCopy } from "@/i18n/use-copy";
import { useUiStore } from "@/stores/ui-store";
import { clamp } from "@/lib/utils";
import { CardTile } from "@/components/CardParts";
import { CardDialog } from "@/components/CardDialog";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const PREVIEW_COUNT = 5;

const TYPES = [
  { value: "all", labelKey: "filterAll" },
  { value: "character", labelKey: "character" },
  { value: "power_up", labelKey: "power_up" },
  { value: "energy", labelKey: "energy" },
] as const;

export function Gallery({ cards }: { cards: readonly Card[] }) {
  const { locale, t } = useCopy();
  const [searchDraft, setSearchDraft] = useState("");
  const [type, setType] = useState<"all" | "character" | "power_up" | "energy">(
    "all",
  );
  const select = useUiStore((s) => s.selectCard);

  const debouncedSearch = useDebouncedValue(searchDraft, 250);

  const query: CardQuery = {
    ...defaultCardQuery,
    search: debouncedSearch,
    type,
  };
  const matches = queryCards(cards, query, locale);
  const visible = matches.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="kartu"
      className="w-[min(1216px,calc(100%_-_96px))] mx-auto max-[1023px]:w-[calc(100%_-_64px)] max-[767px]:w-[calc(100%_-_40px)] py-[92px] px-0 border-b border-[#26272b] max-[767px]:py-[62px] max-[767px]:px-0"
      aria-labelledby="gallery-title"
    >
      <div className="max-w-[730px] mb-[38px] [&_p]:mt-[18px] [&_p]:max-w-[650px] max-[767px]:mb-[30px] max-[767px]:[&_p]:text-[13px]">
        <h2
          id="gallery-title"
          style={{
            fontFamily: '"Unbounded",sans-serif',
            fontSize: clamp(25, 3, 37),
            fontWeight: 500,
            lineHeight: 1.3,
            letterSpacing: "-.045em",
            textWrap: "balance",
            color: "#ece9e2",
            margin: 0,
          }}
        >
          {t("galleryTitle")}
        </h2>
        <p
          style={{
            marginTop: 18,
            maxWidth: 650,
            color: "#b5b2a9",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {t("galleryCopy")}
        </p>
      </div>

      <div className="flex items-end justify-between gap-[16px] flex-wrap mt-[26px]">
        <label className="flex flex-col gap-[6px] [flex:1] min-w-[220px] max-w-[340px] [&_input]:h-[40px] [&_input]:py-0 [&_input]:px-[13px] [&_input]:bg-[#17181b] [&_input]:border [&_input]:border-[rgba(44,45,49,0.7)] [&_input]:rounded-[8px] [&_input]:text-[#ece9e2] [&_input]:text-[13px] [&_input]:[outline:none] [&_input]:transition-[border-color] [&_input]:duration-[.2s] [&_input::placeholder]:text-[#8f8f95] [&_input:focus]:border-[rgba(210,175,98,0.4)]" htmlFor="gallery-search">
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#85878b] font-semibold">{t("search")}</span>
          <input
            id="gallery-search"
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder={t("searchPlaceholder")}
            maxLength={100}
            autoComplete="off"
          />
        </label>
        <div
          className="flex gap-[6px] flex-wrap"
          role="group"
          aria-label={t("filterType")}
        >
          {TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="h-[32px] py-0 px-[12px] bg-[#17181b] border border-[rgba(44,45,49,0.7)] rounded-[7px] text-[#b5b2a9] cursor-pointer text-[11px] transition-[border-color,color,background-color] duration-[.2s] hover:border-[rgba(210,175,98,0.3)] hover:text-[#ece9e2] aria-pressed:bg-[rgba(210,175,98,0.1)] aria-pressed:border-[rgba(210,175,98,0.45)] aria-pressed:text-[#d2af62] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
              aria-pressed={type === opt.value}
              onClick={() => setType(opt.value)}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
        <Link className="inline-flex items-center gap-[7px] text-[#d2af62] text-[12px] no-underline border-b border-[rgba(210,175,98,0.3)] pb-[3px] transition-[border-color,color] duration-[.2s] hover:text-[#e8cd8a] hover:[border-bottom-color:#d2af62]" to="/kartu">
          {t("gallerySeeAll")}
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>

      <div role="status" aria-live="polite" className="mt-[14px] text-[11px] text-[#85878b]">
        {`${matches.length} ${t("result")}`}
        {type !== "all" && (
          <span className="text-[#8f8f95]"> · {t("galleryFiltered")}</span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {visible.length === 0 ? (
          <motion.div
            key="empty"
            className="mt-[18px] py-[44px] px-[20px] text-center border border-[rgba(44,45,49,0.55)] rounded-[10px] [&_h3]:font-heading [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:text-[#ece9e2] [&_h3]:m-0 [&_p]:text-[12px] [&_p]:text-[#8b8d91] [&_p]:mt-[8px] [&_p]:mx-0 [&_p]:mb-0 max-[767px]:min-h-[310px] max-[767px]:py-[32px] max-[767px]:px-[20px] max-[767px]:[&_h3]:text-[18px] max-[767px]:[&_p]:text-[12px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            <h3>{t("noMatch")}</h3>
            <p>{t("noMatchCopy")}</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-[repeat(5,minmax(0,1fr))] [grid-auto-rows:auto] gap-[14px] mt-[18px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {visible.map((card, i) => (
              <CardTile key={card.id} card={card} index={i} onSelect={select} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Link className="inline-flex items-center gap-[7px] text-[#d2af62] text-[12px] no-underline border-b border-[rgba(210,175,98,0.3)] pb-[3px] transition-[border-color,color] duration-[.2s] hover:text-[#e8cd8a] hover:[border-bottom-color:#d2af62] mt-[22px]" to="/kartu">
        {t("galleryMore")}
        <ArrowRight aria-hidden="true" size={15} />
      </Link>

      <GalleryDialog cards={cards} />
    </section>
  );
}

function GalleryDialog({ cards }: { cards: readonly Card[] }) {
  const selectedId = useUiStore((s) => s.selectedCardId);
  const select = useUiStore((s) => s.selectCard);
  const selected = cards.find((c) => c.id === selectedId);

  return <CardDialog card={selected} onClose={() => select(null)} />;
}
