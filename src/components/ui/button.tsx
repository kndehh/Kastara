import {Slot} from 'radix-ui'
import {cva, type VariantProps} from 'class-variance-authority'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50,data-[variant=outline]:border-input data-[size=icon]:h-8 data-[size=icon]:w-8 data-[size=icon]:p-0 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants:{
      variant:{
        default:'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:'border border-input bg-background hover:bg-muted hover:text-foreground',
        secondary:'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:'hover:bg-muted hover:text-foreground',
        link:'text-primary underline-offset-4 hover:underline',
      },
      size:{
        default:'h-9 px-4 py-2',
        sm:'h-8 rounded-md px-3 text-xs',
        'icon-xs':'h-6 w-6 rounded-md p-0',
        'icon-sm':'h-7 w-7 rounded-md p-0',
        'icon': 'h-8 w-8 rounded-md p-0',
        'icon-lg': 'h-9 w-9 rounded-md p-0',
        lg:'h-10 rounded-md px-8',
        xs:'h-6 rounded-md px-2 text-xs',
      },
    },
    defaultVariants:{
      variant:'default',
      size:'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?:boolean}){
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp data-slot="button" {...props} className={buttonVariants({variant,size,className})} />
}

export {Button,buttonVariants}
