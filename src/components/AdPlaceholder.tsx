export default function AdPlaceholder({ slot = 'content' }: { slot?: string }) {
  return null;
  // Uncomment when AdSense is approved:
  // return <div className="w-full min-h-[250px] bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm my-6 rounded-lg">Ad Space — {slot}</div>;
}
