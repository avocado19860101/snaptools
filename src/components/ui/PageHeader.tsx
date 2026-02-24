interface PageHeaderProps {
  title: string;
  description: string | string[];
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  const descriptions = Array.isArray(description) ? description : [description];
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      {descriptions.map((d, i) => (
        <p key={i} className="text-gray-600 leading-relaxed mb-2 last:mb-0">{d}</p>
      ))}
    </div>
  );
}
