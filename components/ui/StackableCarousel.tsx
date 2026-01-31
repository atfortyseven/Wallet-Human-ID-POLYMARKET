import React from 'react';

interface StackableCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function StackableCarousel({ children, className = "", itemClassName = "w-[85vw] md:w-[400px]" }: StackableCarouselProps) {
  return (
    <div className={`
      flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 
      scrollbar-hide md:scrollbar-default 
      ${className}
    `}>
      {React.Children.map(children, (child, i) => (
        <div key={i} className={`snap-center shrink-0 ${itemClassName}`}>
          {child}
        </div>
      ))}
    </div>
  );
}
