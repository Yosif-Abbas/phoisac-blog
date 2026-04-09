export default function ParagraphBlock({ data }: { data: { text: string } }) {
  return (
    <div className="w-full">
      <p
        className="text-lg md:text-xl text-foreground/90 font-medium leading-[1.8] md:leading-[2] tracking-wide
                   [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-8 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary transition-all
                   [&_b]:font-bold [&_i]:italic"
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    </div>
  );
}
