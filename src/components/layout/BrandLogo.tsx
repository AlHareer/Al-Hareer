import Image from 'next/image';

const LOGO_FILE = '/logo.png'; // drop logo.png into /public/ to activate image mode
const USE_IMAGE = true;        // logo.png is in /public/

type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function BrandLogo({ size = 'md', className = '' }: Props) {
  const textSizes = {
    sm: { heading: 'text-xl', sub: 'text-[7.5px]', gap: '-mt-0.5' },
    md: { heading: 'text-2xl sm:text-3xl', sub: 'text-[8px] sm:text-[9px]', gap: '-mt-0.5 sm:-mt-1' },
    lg: { heading: 'text-2xl sm:text-[28px]', sub: 'text-[10px] sm:text-[10.5px]', gap: 'mt-1.5' },
  }[size];

  const imgHeight = { sm: 48, md: 72, lg: 64 }[size];
  const imgWidth = { sm: 140, md: 220, lg: 200 }[size];
  const imgClass = { sm: 'h-9', md: 'h-14 sm:h-16', lg: 'h-14' }[size];

  if (USE_IMAGE) {
    return (
      <Image
        src={LOGO_FILE}
        alt="Al Hareer"
        width={imgWidth}
        height={imgHeight}
        className={`${imgClass} w-auto object-contain ${className}`}
        priority={size !== 'lg'}
      />
    );
  }

  return (
    <div className={`flex flex-col select-none tracking-widest ${className}`}>
      <span
        className={`font-heading ${textSizes.heading} font-bold tracking-[0.22em] text-[#00303A] group-hover:text-[#024F5F] transition-colors leading-tight`}
      >
        AL HAREER
      </span>
      <span
        className={`${textSizes.sub} uppercase tracking-[0.38em] text-[#024F5F] font-medium ${textSizes.gap}`}
      >
        TRADITION IN STYLE
      </span>
    </div>
  );
}
