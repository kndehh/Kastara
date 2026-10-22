import {RotateCw,Skull,Trophy} from 'lucide-react'
import {useCopy} from '@/i18n/use-copy'

export interface SimResultBannerProps {
  /** Which side won the round. */
  won:boolean
  /** The last thing that happened, used as the explanation. */
  reason:string
  /** How many turns the round lasted. */
  turn:number
  /** KOs scored against the rival. */
  ko:number
  /** KOs needed to win. */
  koToWin:number
  /** Called when the player asks for another round. */
  onPlayAgain:()=>void
  /** Called when the player wants to close the result and look at the board. */
  onViewBoard?:()=>void
  /** Renders a compact bar instead of a full board overlay. */
  variant?:'overlay'|'bar'
}

/** Clear win or lose confirmation for the turn simulator. */
export function SimResultBanner({
  won,
  reason,
  turn,
  ko,
  koToWin,
  onPlayAgain,
  onViewBoard,
  variant='overlay',
}:SimResultBannerProps){
  const {t}=useCopy()
  const title=won?t('simWinTitle'):t('simLoseTitle')
  const accent=won?'#e8cd8a':'#e8a08c'
  const border=won?'rgba(210,175,98,0.6)':'rgba(200,110,90,0.55)'
  const fill=won?'rgba(210,175,98,0.14)':'rgba(200,110,90,0.14)'

  if(variant==='bar'){
    return (
      <div
        data-testid="sim-result-banner"
        data-outcome={won?'won':'lost'}
        role="status"
        aria-live="assertive"
        className="flex items-center gap-[12px] flex-wrap py-[12px] px-[14px] rounded-[10px] border bg-[rgba(20,21,24,0.9)]"
        style={{borderColor:border}}
      >
        <span
          aria-hidden="true"
          className="grid place-items-center w-[38px] h-[38px] rounded-full border flex-none"
          style={{borderColor:border,background:fill,color:accent}}
        >
          {won?<Trophy size={20}/>:<Skull size={20}/>}
        </span>
        <div className="flex flex-col gap-[3px] min-w-0 flex-1">
          <strong className="font-heading text-[16px] leading-tight tracking-[-.03em]" style={{color:accent}}>
            {title}
          </strong>
          <span className="text-[11.5px] leading-[1.5] text-[#b5b2a9]">{reason}</span>
          <span className="text-[10px] tracking-[0.08em] uppercase text-[#85878b]">
            {t('simResultTurns')} {turn} · {t('simKO')} {ko}/{koToWin}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-[6px] min-h-[38px] px-[14px] rounded-[8px] border border-[rgba(210,175,98,0.5)] bg-[rgba(210,175,98,0.14)] text-[#e8cd8a] text-[11.5px] font-semibold cursor-pointer hover:bg-[rgba(210,175,98,0.24)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
          onClick={onPlayAgain}
        >
          <RotateCw size={13} aria-hidden="true"/>
          {t('simResultAgain')}
        </button>
      </div>
    )
  }

  return (
    <div
      data-testid="sim-result-banner"
      data-outcome={won?'won':'lost'}
      role="status"
      aria-live="assertive"
      className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-[10px] px-[20px] text-center bg-[rgba(11,12,14,0.88)] backdrop-blur-[3px]"
    >
      <span
        aria-hidden="true"
        className="grid place-items-center w-[58px] h-[58px] rounded-full border"
        style={{borderColor:border,background:fill,color:accent}}
      >
        {won?<Trophy size={28}/>:<Skull size={28}/>}
      </span>
      <strong
        className="font-heading text-[26px] leading-tight tracking-[-.03em]"
        style={{color:accent}}
      >
        {title}
      </strong>
      <p className="m-0 max-w-[280px] text-[12.5px] leading-[1.6] text-[#d8d5cd]">{reason}</p>
      <p className="m-0 text-[10px] tracking-[0.1em] uppercase text-[#85878b]">
        {t('simResultTurns')} {turn} · {t('simKO')} {ko}/{koToWin}
      </p>
      <div className="flex items-center gap-[8px] mt-[2px]">
        <button
          type="button"
          className="inline-flex items-center gap-[6px] min-h-[40px] px-[16px] rounded-[8px] border border-[rgba(210,175,98,0.5)] bg-[rgba(210,175,98,0.14)] text-[#e8cd8a] text-[12px] font-semibold cursor-pointer hover:bg-[rgba(210,175,98,0.24)] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
          onClick={onPlayAgain}
        >
          <RotateCw size={14} aria-hidden="true"/>
          {t('simResultAgain')}
        </button>
        {onViewBoard&&(
          <button
            type="button"
            className="inline-flex items-center gap-[6px] min-h-[40px] px-[16px] rounded-[8px] border border-[rgba(44,45,49,0.9)] bg-transparent text-[#b5b2a9] text-[12px] cursor-pointer hover:border-[rgba(210,175,98,0.35)] hover:text-[#ece9e2] focus-visible:outline-2 focus-visible:outline-[#d2af62] focus-visible:outline-offset-[2px]"
            onClick={onViewBoard}
          >
            {t('simResultClose')}
          </button>
        )}
      </div>
    </div>
  )
}
