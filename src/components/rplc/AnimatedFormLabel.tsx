import { TextAnimate } from '@/components/ui/text-animate';
import { FormLabel } from '@/components/ui/form';

interface AnimatedFormLabelProps {
  children: string;
  className?: string;
}

export function AnimatedFormLabel({
  children,
  className,
}: AnimatedFormLabelProps) {
  return (
    <FormLabel className={className}>
      <TextAnimate animation="blurInUp" by="word" duration={0.3} delay={0}>
        {children}
      </TextAnimate>
    </FormLabel>
  );
}
