import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const TextSection = ({ children }: Props) => {
  return (
    <section className="mx-auto max-w-250 p-6">
      <p className="text-lg leading-relaxed">{children}</p>
    </section>
  );
};

export default TextSection;
