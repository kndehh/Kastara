import {useState} from 'react'
import {X} from 'lucide-react'
import {type Card} from '@/domain/cards'
import {useCopy} from '@/i18n/use-copy'
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import {CardOpener,CardPreview,elementColor,rarityColor,typeColor} from '@/components/CardParts'

export function CardDialog({
  card,
  onClose,
}:{
  card?:Card
  onClose:()=>void
}){
  return (
    <Dialog
      open={!!card}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-[20px] [&_.dialog-title]:text-[16px] flex flex-col gap-[14px] max-h-[calc(100dvh_-_48px)] overflow-y-[auto] w-[min(880px,calc(100vw_-_32px))] [&_.card-opener]:p-0 [&_.card-opener]:gap-[18px] max-[767px]:max-h-[calc(100dvh_-_24px)] max-[767px]:w-[calc(100vw_-_24px)]"
        style={{
          background: "#151619",
          border: "1px solid rgba(210,175,98,0.15)",
          borderRadius: 12,
          width: "min(880px, calc(100vw - 32px))",
          maxWidth: "none",
          maxHeight: "calc(100dvh - 48px)",
          overflowY: "auto",
        }}
      >
        {card && <CardDialogBody key={card.id} card={card} />}
      </DialogContent>
    </Dialog>
  );
}

function CardDialogBody({card}:{card:Card}){
  const {locale,t}=useCopy()
  const [full,setFull]=useState(false)

  return (
    <>
      <DialogHeader>
        <DialogTitle
          style={{
            fontFamily: '"Unbounded",sans-serif',
            fontSize: 18,
            fontWeight: 500,
            color: "#ece9e2",
            letterSpacing: "-.04em",
            margin: 0,
          }}
        >
          {card.name[locale]}
        </DialogTitle>
        <DialogDescription
          style={{
            fontSize: 11,
            color: "#85878b",
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: rarityColor(card.rarity) }}>
            {t(card.rarity)}
          </span>
          {` / `}
          <span style={{color:typeColor(card.type)}}>{t(card.type)}</span>
          {card.element&&<>{` / `}<span style={{color:elementColor(card.element)}}>{t(card.element)}</span></>}
          {` / ${card.setCode}`}
        </DialogDescription>
      </DialogHeader>
      <DialogClose asChild>
        <Button
          variant="outline"
          size="sm"
          style={{
            alignSelf: "flex-start",
            borderColor: "rgba(44,45,49,0.8)",
            color: "#ece9e2",
            fontSize: 11,
          }}
        >
          <X aria-hidden="true" size={14} style={{ color: "#d2af62" }} />
          {t("close")}
        </Button>
      </DialogClose>
      {full ? (
        <CardOpener card={card} />
      ) : (
        <div className="flex flex-col items-center gap-[18px]">
          <CardPreview card={card} />
          <Button onClick={() => setFull(true)}>{t("viewFull")}</Button>
        </div>
      )}
    </>
  );
}
