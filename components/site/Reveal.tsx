"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
} & Omit<HTMLMotionProps<"div">, "ref">;

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as: Component = "div",
  ...rest
}: Props) {
  const MotionComponent = motion(Component as any);
  return (
    <MotionComponent
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}