import { motion } from 'framer-motion';
import { fadeInUp, scrollTriggerProps, standardTransition } from '../../utils/animations';
import { cn } from '../../utils/cn';

interface SectionHeaderProps {
  overline: string;
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  overlineClassName?: string;
  align?: 'left' | 'center' | 'right';
}

export const SectionHeader = ({
  overline,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  overlineClassName,
  align = 'center',
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <motion.div
      {...scrollTriggerProps}
      variants={fadeInUp}
      transition={standardTransition}
      className={cn(
        'max-w-3xl mb-16',
        alignmentClasses[align],
        align === 'center' && 'mx-auto',
        className
      )}
    >
      <h2 className={cn(
        'text-sm font-medium text-gold-600 uppercase tracking-wider',
        overlineClassName
      )}>
        {overline}
      </h2>
      <h3 className={cn(
        'mt-2 text-3xl md:text-4xl font-serif font-bold text-primary-900',
        titleClassName
      )}>
        {title}
      </h3>
      <p className={cn(
        'mt-4 text-neutral-700',
        descriptionClassName
      )}>
        {description}
      </p>
    </motion.div>
  );
};
